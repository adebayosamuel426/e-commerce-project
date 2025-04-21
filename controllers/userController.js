import pool from '../db/connectDB.js'
import { StatusCodes } from 'http-status-codes';
import { NotFoundError, UnauthorizedError } from '../errors/customError.js';
import { hashPassword } from '../utils/passwordUtils.js';
import redis from '../config/redisClients.js';
import * as dotenv from 'dotenv';
dotenv.config();

const getCurrentUser = async(req, res) => {
    const { id: userId } = req.user;

    const [users] = await pool.query('SELECT id, name, email, role, address FROM users WHERE id = ?', [userId])
    const user = users[0];
    res.status(StatusCodes.OK).json({ user: user, message: `hello ${user.name}` });
};


const getAllUsers = async(req, res) => {
    // assigning a value to cacheKey

    const cacheKey = "all_users";
    const cachedUsers = await redis.get(cacheKey);
    // getting data from cache if it is available
    if (cachedUsers) {
        console.log("Redis HIT:", cacheKey);
        return res.status(StatusCodes.OK).json({ users: JSON.parse(cachedUsers), message: "these are all users fetched from cache" });
    }
    console.log("Redis MISS:", cacheKey);

    // getting data from database if cache is not available
    const [users] = await pool.query('SELECT id, name, email, role, created_at FROM users')

    // caching the users for future use (set expiration to 1 hour)
    await redis.setex(cacheKey, process.env.REDIS_EXP_TIME, JSON.stringify(users));

    res.status(StatusCodes.OK).json({ users: users, message: "these are all users" });

}

const updateCurrentUserProfile = async(req, res) => {
    const { name, email, password, address } = req.body;
    const { id: userId } = req.user;
    const [user] = await pool.query('SELECT * FROM users WHERE id =?', [userId])
    if (!user || user.length === 0) {
        throw new NotFoundError("user not found")
    }

    //getting the existing user from database
    const existingUser = user[0];
    const newName = name || existingUser.name;
    const newEmail = email || existingUser.email;
    const newAddress = address || existingUser.address;
    let newPassword = existingUser.password_hash;
    if (password) {
        newPassword = await hashPassword(password);
    }


    // Updating the user's info in the database
    const [updatedUsers] = await pool.query('UPDATE users SET name =?, email =?, address=?, password_hash =? WHERE id =?', [newName, newEmail, newAddress, newPassword, userId]);

    //invalidating cache users and all users
    await redis.del(`users:${userId}`)
    await redis.del("all_users");

    res.status(StatusCodes.OK).json({ message: "user's profile has been updated" });

};

const deleteUser = async(req, res) => {
    const { id } = req.params;
    const { name, role, id: userId } = req.user;

    const deletedId = id || userId;
    //fetching the details from database
    const [fetchUsers] = await pool.query('SELECT * FROM users WHERE id =?', [deletedId])

    if (!fetchUsers || fetchUsers.length === 0) {
        throw new NotFoundError("user not found");
    }
    if (parseInt(deletedId) === 1) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: "Cannot delete the first admin account." });
    }
    // checking if the user trying to delete is an admin
    if (fetchUsers[0].role === "admin" && role !== "admin") {
        return res.status(403).json({ message: "Admins cannot be deleted by non-admins." });
    };

    const [users] = await pool.query('DELETE FROM users WHERE id =?', [deletedId]);

    //invalidating cache users and all users
    await redis.del("all_users");

    res.status(StatusCodes.OK).json({ message: `user with id:${deletedId} ${fetchUsers[0].name} has been deleted` });
};

const getUser = async(req, res) => {
    const { id: userId } = req.params;
    const cacheKey = `users:${userId}`
    const cachedUser = await redis.get(cacheKey);

    if (cachedUser) {
        console.log("Redis HIT:", cacheKey);
        // If cached data exists, return it as JSON
        return res.status(StatusCodes.OK).json({ user: JSON.parse(cachedUser), message: "Fetched user from cache" });
    }
    console.log("Redis HIT:", cacheKey);

    const [user] = await pool.query('SELECT id, name, email, role, created_at, address FROM users WHERE id =?', [userId])
    if (!user || user.length === 0) {
        throw new NotFoundError("user not found");
    }
    // deleting password from the user object before sending it back
    delete user[0].password_hash;
    await redis.setex(cacheKey, process.env.REDIS_EXP_TIME, JSON.stringify(user[0]));

    res.status(StatusCodes.OK).json({ user: user[0], message: `user with id:${userId} ${user[0].name} has been gotten` });
};

const searchUsers = async(req, res) => {
    const { query } = req.query;
    const cacheKey = `search:${query}`
    const cachedUsers = await redis.get(cacheKey);

    if (cachedUsers) {
        console.log("Redis HIT:", cacheKey);
        // If cached data exists, return it as JSON
        return res.status(StatusCodes.OK).json({ users: JSON.parse(cachedUsers), message: "Fetched users from cache" });
    }
    console.log("Redis MISS:", cacheKey);

    const [users] = await pool.query("SELECT * FROM users WHERE name LIKE ? OR email LIKE ? ORDER BY created_at ASC", [`%${query}%`, `%${query}%`])
        //store data in cache and set an expiration time
    await redis.setex(cacheKey, process.env.REDIS_EXP_TIME, JSON.stringify(users));
    res.status(StatusCodes.OK).json({ users: users, message: "here is the likely product from database" })
}

const updateUser = async(req, res) => {
    const { id } = req.params; // User ID to update
    const { name, email, address, role } = req.body;

    // Ensure admin cannot change their own role to prevent privilege escalation
    if (req.user.id == id && req.user.role === "admin" && role && role !== "admin") {
        return res.status(StatusCodes.FORBIDDEN).json({
            message: "Admins cannot change their own role.",
        });
    };
    if (parseInt(id) === 1) {
        return res.status(StatusCodes.FORBIDDEN).json({ message: "Cannot update the first admin account." });
    }
    // Fetch the existing user from the database
    const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

    if (users.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" });
    }

    const existingUser = users[0];

    // Prepare updated fields (use existing values if not provided)
    const updatedName = name || existingUser.name;
    const updatedEmail = email || existingUser.email;
    const updatedRole = role || existingUser.role;
    const updatedAddress = address || existingUser.address


    const [updatedUser] = await pool.query(
        "UPDATE users SET name = ?, email = ?, role = ?, address =? WHERE id = ?", [updatedName, updatedEmail, updatedRole, updatedAddress, id]
    );

    //invalidating cache users and all users
    await redis.del(`users:${id}`)
    await redis.del("all_users");

    res.status(StatusCodes.OK).json({ user: updatedUser[0], message: "user's profile has been updated" });

}


const getWeeklyUsers = async(req, res) => {
    const cacheKey = "weeklyUsers";
    const cacheWeeklyUsers = await redis.get(cacheKey)
        //if the weekly users are available in the caache fetch them
    if (cacheWeeklyUsers) {
        console.log("Redis HIT:", cacheKey);
        res.status(StatusCodes.OK).json({ weeklyUsers: JSON.parse(cacheWeeklyUsers), message: "weekly user fetched from cache" })
    }
    console.log("Redis MISS:", cacheKey);

    const [users] = await pool.query(
        `SELECT 
      DATE(created_at) AS date,
      COUNT(*) AS total_users
     FROM users
     WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
     GROUP BY DATE(created_at)
     ORDER BY date ASC`
    );

    const formattedData = users.map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-GB'),
        total_users: parseFloat(item.total_users),
    }));
    await redis.setex(cacheKey, process.env.REDIS_EXP_TIME, JSON.stringify(formattedData));
    res.status(StatusCodes.OK).json({ weeklyUsers: formattedData, message: "users weekly stats" });
};


export { getCurrentUser, getAllUsers, updateCurrentUserProfile, deleteUser, getUser, updateUser, searchUsers, getWeeklyUsers };