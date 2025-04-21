import { StatusCodes } from 'http-status-codes';
import { CustomError } from "../errors/customError.js";
const errorHandlerMiddleware = (err, req, res, next) => {
    console.log(" Error handler triggered:", err.message); // log to verify

    // Log errors only in development
    if (process.env.NODE_ENV === "development") {
        console.log(" Error:", err.message);
    }
    if (err instanceof CustomError) {
        return res.status(err.statusCode).json({ message: err.message });
    }

    res.status(500).json({ message: "Something went wrong, please try again later." });
};

export default errorHandlerMiddleware;