import express from 'express';
const app = express();
import "express-async-errors"; // This enables Express to catch async throws
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import orderRouter from "./routes/orderRoute.js";
import wishlistRouter from "./routes/wishlistRoute.js";
import ratingsRouter from "./routes/ratingsRoute.js";
import { authenticateUser, authorizePermissions } from "./middlewares/authMiddleware.js"
import * as dotenv from 'dotenv';
dotenv.config();

import errorHandlerMiddleware from './middlewares/errorHandlerMiddleware.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
import { createServer } from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';

// Use Helmet to secure HTTP headers
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Parses form data
app.use(cookieParser());


const allowedOrigins = [
    "http://localhost:5173", // for development
    process.env.CLIENT_URL // for production (set this on Render)
];
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

// Socket.io setup
const httpServer = createServer(app); // Wrap express with http server
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    }
});

// Store connected admins
let adminSockets = [];

// Socket.io connection
io.on("connection", (socket) => {


    socket.on("admin_join", () => {
        adminSockets.push(socket.id);

    });

    socket.on("disconnect", () => {
        adminSockets = adminSockets.filter((id) => id !== socket.id);

    });
});

// Export to use in other files
export const notifyAdminsOfNewOrder = (orderData) => {
    adminSockets.forEach((socketId) => {
        io.to(socketId).emit("new_order", orderData);
    });
};

// for linking routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', authenticateUser, userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/orders', authenticateUser, orderRouter);
app.use('/api/v1/wishlist', authenticateUser, authorizePermissions("customer"), wishlistRouter);
app.use('/api/v1/ratings', ratingsRouter);
app.get('/', (req, res) => {
    res.send('Hello from e-commerce');
})






// Error handling middleware
app.use(errorHandlerMiddleware);



const port = process.env.PORT || 5050;
httpServer.listen(port, () => {

    console.log(`Server is running on port ${port}`);
});
// Graceful shutdown
process.on("unhandledRejection", (err) => {
    console.error(" Unhandled Promise Rejection:", err);
    process.exit(1);
});