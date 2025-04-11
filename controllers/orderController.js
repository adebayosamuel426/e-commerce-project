import pool from '../db/connectDB.js'
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/customError.js';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import { notifyAdminsOfNewOrder } from '../server.js'
import redis from '../config/redisClients.js';
import * as dotenv from 'dotenv';
dotenv.config();

const createOrder = async(req, res) => {

    const user_id = req.user.id; // Get user ID from authentication middleware
    const { items, payment_method = "card" } = req.body; // Only extract items from the request body
    if (!user_id || !items || items.length === 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid order request" });
    }

    // Calculate total price
    let totalPrice = 0;

    for (const item of items) {
        const { id: product_id, quantity: qty } = item;
        const [product] = await pool.query(
            "SELECT price,name,stock FROM products WHERE id = ?", [product_id]
        );

        if (product.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({ message: `Product ID ${product_id} not found` });
        }

        if (qty > product[0].stock) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: `${product[0].name} with Product ID ${product_id} has only ${product[0].stock} items in stock. it is out of stock` });
        }

        totalPrice += product[0].price * qty;

    }




    let connection;
    try {
        connection = await pool.getConnection();
        // Begin a new transaction
        await connection.beginTransaction();

        // Insert order into database
        const [order] = await pool.query(
            "INSERT INTO orders (user_id, total_price) VALUES (?, ?)", [user_id, totalPrice]
        );


        const orderId = order.insertId

        // Insert order items into the order_items table
        for (const item of items) {
            const { id: product_id, quantity: qty } = item;
            const [product] = await pool.query(
                "SELECT price FROM products WHERE id = ?", [product_id]
            );
            await pool.query(
                "INSERT INTO order_items (order_id, product_id, qty, price) VALUES (?, ?, ?, ?)", [orderId, product_id, qty, product[0].price]
            );
        }
        // Create a PaymentIntent with Stripe for the total amount
        // Stripe requires amounts in cents so we multiply by 100 and round off
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalPrice * 100),
            currency: 'usd',
            payment_method_types: ['card'],
            // Optionally, add metadata such as your order ID
            metadata: { order_id: orderId.toString() }
        });

        // Insert a new payment record (pending payment)
        await pool.query(
            "INSERT INTO payments (order_id, user_id, amount, transaction_id) VALUES (?, ?, ?, ?)", [orderId, user_id, totalPrice, paymentIntent.id]
        );



        // Commit the transaction if everything is successful
        await connection.commit();
        // Deduct the number of products in stock
        for (const item of items) {
            const { id: product_id, quantity: qty } = item;
            await pool.query("UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?", [qty, product_id, qty])
        }

        console.log(orderId);

        // Get customer info for notification
        const [customerInfo] = await pool.query(
            "SELECT name, email FROM users WHERE id = ?", [user_id]
        );

        // 🔔 Notify admins
        notifyAdminsOfNewOrder({
            orderId,
            user_id,
            customer_name: customerInfo[0].name,
            customer_email: customerInfo[0].email,
            totalPrice,
            created_at: new Date().toISOString(),
        });
        // invalidating the orders in the cache for new updates
        await redis.del(`users:${user_id}`);
        await redis.del(`usersOrders:${user_id}`);
        await redis.del('allOrders')
        await redis.del('weeklySales')
        res.status(StatusCodes.CREATED).json({
            message: 'Order created successfully',
            orderId,
            clientSecret: paymentIntent.client_secret
        });



    } catch (error) {
        // Roll back the transaction in case of any error
        await connection.rollback();
        // Throw error to let the installed error handler take care of it
        throw error;
    } finally {
        // Release the connection back to the pool
        connection.release();
    }
};


const getAllOrders = async(req, res) => {
    const cacheKey = "allOrders"
    const cacheOrders = await redis.get(cacheKey);

    if (cacheOrders) {
        res.status(StatusCodes.OK).json({ orders: JSON.parse(cacheOrders), message: "these are all orders fetched from cache" });
    }
    const [orders] = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");

    //get all orders from database and store them in the cache
    await redis.setex(cacheKey, process.env.REDIS_EXP_TIME, JSON.stringify(orders));

    res.status(StatusCodes.OK).json({ orders: orders, message: 'these are all orders' });
}

const getUserOrders = async(req, res) => {
    const { id: userId } = req.user;

    const cacheKey = `users/${userId}`;
    const cacheOrders = await redis.get(cacheKey);
    if (cacheOrders) {
        return res.status(StatusCodes.OK).json({ orders: JSON.parse(cacheOrders), message: "these are your orders fetched from cache" });
    }
    const [orders] = await pool.query("SELECT * FROM orders WHERE user_id =? ORDER BY created_at DESC", [userId]);

    // geting user orders from the database and storing them in the cache
    await redis.setex(cacheKey, process.env.REDIS_EXP_TIME, JSON.stringify(orders))

    res.status(StatusCodes.OK).json({ orders: orders, message: 'these are your orders' });
}

const getUserOrdersById = async(req, res) => {
    const { id: userId } = req.params;
    const cacheKey = `usersOrders:${userId}`;
    const cacheOrders = await redis.get(cacheKey);
    if (cacheOrders) {
        return res.status(StatusCodes.OK).json({ orders: JSON.parse(cacheOrders), message: "these are the user's orders fetched from cache" });
    }
    const [orders] = await pool.query("SELECT * FROM orders WHERE user_id =? ORDER BY created_at DESC", [userId]);
    // geting user orders from the database and storing them in the cache
    await redis.setex(cacheKey, process.env.REDIS_EXP_TIME, JSON.stringify(orders))

    res.status(StatusCodes.OK).json({ orders: orders, message: "these are the user's orders" });
}

const updateOrderStatus = async(req, res) => {
    const { id: order_id } = req.params;
    const { status } = req.body;
    let order_status = status
    if (!order_status || typeof order_status !== "string") {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Order status is required and must be a valid string" });
    }

    order_status = order_status.trim().toLowerCase();
    const validStatuses = ["pending", "shipped", "delivered", "cancelled"];

    if (!validStatuses.includes(order_status)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid order status" });
    }

    const [orders] = await pool.query("SELECT * FROM orders WHERE id =?", [order_id]);

    if (!orders || orders.length === 0) {
        throw new NotFoundError("order not found")
    }
    const order = orders[0];
    const newOrder_status = order_status || order.order_status;

    await pool.query(
        "UPDATE orders SET order_status = ? WHERE id = ?", [newOrder_status, order_id]
    );

    // invalidating the orders in the cache for new updates
    await redis.del(`orders:${order_id}`);
    await redis.del('allOrders');

    res.status(StatusCodes.OK).json({ orderStatus: order.order_status, message: "Order status updated successfully" });
}

const updatePaymentStatus = async(req, res) => {
    const { id: order_id } = req.params;
    const { status } = req.body;
    if (status !== 'succeeded') {
        return res.status(400).json({ message: 'Payment not completed' });
    }
    await pool.query('UPDATE payments SET payment_status = ? WHERE order_id = ?', ['paid', order_id])
        // invalidating the orders in the cache for new updates
    await redis.del(`orders:${order_id}`);
    await redis.del('allOrders');
    res.status(StatusCodes.OK).json({ message: "Payment has status updated successfully" });
}

const getOrderById = async(req, res) => {
    const { id: order_id } = req.params;
    const cacheKey = `orders:${order_id}`
    const cacheOrder = await redis.get(cacheKey);

    // get the order from the cache if it is available
    if (cacheOrder) {
        return res.status(StatusCodes.OK).json({...JSON.parse(cacheOrder), message: "this order fetched from cache" });
    }

    const [orders] = await pool.query(`SELECT u.email, u.name, u.address, o.id, o.user_id, o.total_price, o.created_at, o.order_status
       FROM orders o
       JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`, [order_id]);
    if (!orders || orders.length === 0) {
        throw new NotFoundError("order not found");
    }

    const [payment] = await pool.query("SELECT * FROM payments WHERE order_id =?", [order_id]);
    if (!payment || payment.length === 0) {
        throw new NotFoundError("payment not found");
    }
    // Ensure orderResults is an array and contains data
    if (!Array.isArray(orders) || orders.length === 0) {
        return res.status(404).json({ message: "Order not found" });
    };


    // Fetch order items
    const [itemsResults] = await pool.query(
        `SELECT oi.product_id, p.name, p.image_url, oi.qty, oi.price
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`, [order_id]
    );
    // store order results in the cache
    await redis.setex(cacheKey, process.env.REDIS_EXP_TIME, JSON.stringify({ order: orders[0], payment: payment[0], items: itemsResults }));

    res.status(StatusCodes.OK).json({ order: orders[0], payment: payment[0], items: itemsResults, message: `Order with id:${orders[0].id} has been gotten` });
}

const getWeeklySales = async(req, res) => {
    const cacheKey = "weeklySales";
    const cacheWeeklySales = await redis.get(cacheKey);
    if (cacheWeeklySales) {
        return res.status(StatusCodes.OK).json({ weeklySales: JSON.parse(cacheWeeklySales), message: "weekly sales fetched from cache" });
    }
    const [sales] = await pool.query(
        `SELECT 
      DATE(created_at) AS date,
      SUM(total_price) AS total_sales
     FROM orders
     WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
     GROUP BY DATE(created_at)
     ORDER BY date ASC`
    );
    //store weekly sales in cache
    await redis.setex(cacheKey, process.env.REDIS_EXP_TIME, JSON.stringify(sales));
    res.status(StatusCodes.OK).json({ weeklySales: sales, message: "weekly sales stats" });
};
export { createOrder, getAllOrders, getUserOrders, getOrderById, updateOrderStatus, getUserOrdersById, updatePaymentStatus, getWeeklySales }