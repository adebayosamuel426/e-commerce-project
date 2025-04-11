import {
    UnauthenticatedError,
    UnauthorizedError

} from '../errors/customError.js';
import pool from '../db/connectDB.js';
import { verifyJWT } from '../utils/tokenUtils.js';

export const authenticateUser = async(req, res, next) => {

    const token = req.cookies.token || "";
    //console.log(token);
    console.log("Cookies received:", req.cookies);
    if (!token) throw new UnauthenticatedError("no token provided");
    // if (!token) {
    //     return res.status(401).json({ error: "No token provided" });
    // }

    try {
        const { id: userId } = verifyJWT(token);

        //console.log(userId);

        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (!users || users.length == 0) throw new UnauthenticatedError("authentication is not valid");
        // console.log(users);

        const user = users[0];
        // deleting hash password from storing in the req.user

        delete user.password_hash;
        req.user = user;
        //console.log(req.user);

        next();
    } catch (error) {
        console.error("Authentication error:", error);
        throw new UnauthenticatedError("authentication invalid");
        // return res.status(401).json({ error: "Authentication invalid" });
    }
};


export const authorizePermissions = (...roles) => {
    return (req, res, next) => {
        //if the roles argument is not the same as the roles in req.user.role throw an error.
        if (!roles.includes(req.user.role)) {
            throw new UnauthorizedError('Unauthorized to access this route');
        }
        next();
    };
};