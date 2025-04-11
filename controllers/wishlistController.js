import pool from '../db/connectDB.js'
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/customError.js';
import redis from '../config/redisClients.js';
import * as dotenv from 'dotenv';
dotenv.config();

const addToWishlist = async(req, res) => {
    const { id: userId } = req.user;
    const { id: product_id } = req.body;
    console.log(product_id);

    // fetch the details from database
    const [fetchUsers] = await pool.query('SELECT * FROM users WHERE id =?', [userId])

    if (!fetchUsers || fetchUsers.length === 0) {
        throw new NotFoundError("user not found");
    }

    const [fetchProducts] = await pool.query('SELECT * FROM products WHERE id =?', [product_id])

    if (!fetchProducts || fetchProducts.length === 0) {
        throw new NotFoundError("product not found");
    }

    // Check if product is already in the wishlist
    const [existing] = await pool.query(
        "SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?", [userId, product_id]
    );
    if (existing && existing.length > 0) {
        await pool.query("INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)", [userId, product_id]);
    }
    // Add product to the wishlist
    await pool.query("INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)", [userId, product_id]);

    //updates the cache with the changes in wishlist
    await redis.del(`wishlist:${userId}`);

    res.status(StatusCodes.OK).json({ message: `user with id:${userId} has added product with id:${product_id} to the wishlist` });
};

const removeFromWishlist = async(req, res) => {
    const { id: userId } = req.user;
    const { id: product_id } = req.body;

    // fetch the details from database
    const [fetchUsers] = await pool.query('SELECT * FROM users WHERE id =?', [userId])

    if (!fetchUsers || fetchUsers.length === 0) {
        throw new NotFoundError("user not found");
    }

    const [fetchProducts] = await pool.query('SELECT * FROM products WHERE id =?', [product_id])

    if (!fetchProducts || fetchProducts.length === 0) {
        throw new NotFoundError("product not found");
    }

    // Check if product is in the wishlist
    const [existing] = await pool.query(
        "SELECT * FROM wishlist WHERE user_id = ? AND product_id = ?", [userId, product_id]
    );
    if (!existing || existing.length === 0) {
        await pool.query("INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)", [userId, product_id]);
    }
    // Delete product to the wishlist
    await pool.query("DELETE FROM wishlist WHERE user_id = ? AND  product_id = ?", [userId, product_id]);

    //updates the cache with the changes in wishlist
    await redis.del(`wishlist:${userId}`);

    res.status(StatusCodes.OK).json({ message: `user with id:${userId} has removed product with id:${product_id} from the wishlist.` });
};

const getAllProductsFromWishlist = async(req, res) => {
    const { id: userId } = req.user;
    const cacheKey = `wishlist:${userId}`
    const cachedWishlist = await redis.get(cacheKey);
    if (cachedWishlist) {
        // If cached data exists, return it as JSON
        return res.status(StatusCodes.OK).json({ wishlist: JSON.parse(cachedWishlist), message: "Fetched wishlist from cache" });
    }
    // fetch the details from database
    const [fetchUsers] = await pool.query('SELECT * FROM users WHERE id =?', [userId])

    if (!fetchUsers || fetchUsers.length === 0) {
        throw new NotFoundError("user not found");
    }

    // Check if product is in the wishlist
    const [wishlist] = await pool.query(
        "SELECT p.id, p.name, p.price, p.image_url FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = ?", [userId]
    );
    // Cache the wishlist data for future use (set expiration to 1 hour)
    await redis.setex(cacheKey, process.env.REDIS_EXP_TIME, JSON.stringify(wishlist));

    res.status(StatusCodes.OK).json({ wishlist: wishlist, message: "here is your wishlist" });
}






export { addToWishlist, removeFromWishlist, getAllProductsFromWishlist };