import pool from '../db/connectDB.js';
import { hashPassword, comparePasswords } from '../utils/passwordUtils.js';
import { UnauthenticatedError, UnauthorizedError } from '../errors/customError.js';
import { createJWT } from '../utils/tokenUtils.js'
import { StatusCodes } from 'http-status-codes';
import redis from '../config/redisClients.js';
import * as dotenv from 'dotenv';
dotenv.config();
export const register = async(req, res) => {
    const { name, email, password, address } = req.body;

    if (!name || !email || !password || !address) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please provide all required fields: name, email, and password.' });
    }
    //To check an existing email
    const [isExisting] = await pool.query("SELECT * FROM users WHERE email = ?", [email])
    if (isExisting.length > 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Email already exists" });
    };
    const [result] = await pool.query("SELECT COUNT(*) AS count FROM users");
    const isFirstUser = result[0].count === 0;
    const role = isFirstUser ? "admin" : "customer";

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert into users table
    const [user] = await pool.query('INSERT INTO users (name, email, password_hash, role, address) VALUES (?,?,?,?,?)', [name, email, hashedPassword, role, address])

    await redis.del("all_users");
    await redis.del("weeklyUsers");
    res.status(StatusCodes.CREATED).json({ message: "a new user has been created" });

};
export const login = async(req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please provide both email and password.' });
    }

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) {
        throw new UnauthenticatedError("Invalid email or password");
    }

    const isValidUser = await comparePasswords(password, user.password_hash);
    if (!isValidUser) throw new UnauthenticatedError('invalid credentials');

    const token = createJWT({ id: user.id, email: user.email, role: user.role });


    res.cookie('token', token, {
        httpOnly: true,
        expires: new Date(Date.now() + 48 * 60 * 60 * 1000),
        secure: process.env.NODE_ENV === 'development',
        sameSite: 'none',
    })

    const { id, name, email: userEmail, role } = user;

    res.status(StatusCodes.OK).json({ user: { id, name, email: userEmail, role }, message: 'user logged in' });

}
export const logout = (req, res) => {
    res.clearCookie("token");
    res.status(StatusCodes.OK).json({ message: 'user logged out!' });
};