import pool from '../db/connectDB.js'
import redis from '../config/redisClients.js';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError, UnauthorizedError } from '../errors/customError.js';


const addRatings = async(req, res) => {
    const { rating: parseRating, review } = req.body;
    const { productId } = req.params;
    const userId = req.user.id;
    const rating = parseFloat(parseRating)
        // check if the user exists
    const [user] = await pool.query('SELECT * FROM users WHERE id =?', [userId])

    if (!user) {
        throw new NotFoundError("User not found");
    }

    // check if the product exists
    const [product] = await pool.query('SELECT * FROM products WHERE id =?', [productId])

    if (!product) {
        throw new NotFoundError("Product not found");
    }

    // check if the user has already rated the product
    const [existingRating] = await pool.query('SELECT * FROM ratings WHERE user_id =? AND product_id =?', [userId, productId])

    if (existingRating && existingRating.length > 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "you can only rate this product once" });
    }
    // insert new ratings into the database
    await pool.query('INSERT INTO ratings (user_id, product_id, rating, review) VALUES (?,?,?,?)', [userId, productId, rating, review]);

    // update the cache with the new ratings
    await redis.del("all_products");
    await redis.del("all_ratings");
    await redis.del(`rating:${productId}`);
    await redis.del(`product:${productId}`);

    // insert new ratings into the database
    // get average ratings from the table;
    const [productRatings] = await pool.query("SELECT AVG(rating) as averageRating FROM ratings WHERE product_id = ?", [productId])

    // update the ratings column in the products table
    const averageRating = productRatings[0].averageRating || 3; // Ensure it’s a valid number

    // Check if the average rating has changed
    if (product[0].ratings !== averageRating) {
        // Update the average rating in the products table
        await pool.query("UPDATE products SET ratings = ? WHERE id = ?", [averageRating, productId]);
        // Invalidate the cache for all products since the list has changed
        // update the cache with the new ratings
        await redis.del("all_products");
        await redis.del("all_ratings");
        await redis.del(`rating:${productId}`);
        await redis.del(`product:${productId}`);
    }


    res.status(StatusCodes.CREATED).json({ message: "Ratings added successfully" });
};

const getProductRatings = async(req, res) => {
    const { productId } = req.params

    // check if the product exists
    const [product] = await pool.query('SELECT * FROM products WHERE id =?', [productId])

    if (product.length === 0) {
        throw new NotFoundError("Product not found");
    };
    const cacheKey = `rating:${productId}`;
    const cacheRating = await redis.get(cacheKey);
    if (cacheRating) {
        return res.status(StatusCodes.OK).json({...JSON.parse(cacheRating), message: "this review is fetched from cache" });
    }

    //get the reviews of each ratings
    const [reviews] = await pool.query('SELECT u.id, r.id, r.user_id, r.product_id, r.review AS user_review, r.rating, u.email AS user_email FROM users u JOIN ratings r ON r.user_id = u.id WHERE r.product_id =?', [productId])


    // Cache the product for future use (set expiration to 1 hour)
    await redis.setex(cacheKey, process.env.REDIS_EXP_TIME, JSON.stringify({ review: reviews }));

    res.status(StatusCodes.OK).json({ review: reviews, message: "Ratings added successfully" });
}
const deleteRatings = async(req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const role = req.user.role;
    // check if the user exists
    const [user] = await pool.query('SELECT * FROM users WHERE id =?', [userId])

    if (!user) {
        throw new NotFoundError("User not found");
    }

    // check if the user has already rated the product
    const [ratings] = await pool.query("SELECT * FROM ratings WHERE id =?", [id]);

    if (!ratings || ratings.length === 0 || !ratings[0]) {
        throw new NotFoundError("Rating not found");
    }

    if (ratings[0].user_id !== userId && role !== "admin") {
        throw new UnauthorizedError("only the writer of the review is allowed to delete reviews")
    }

    // delete the ratings in the database
    await pool.query('DELETE FROM ratings WHERE id =?', [id]);

    // update the cache with the new ratings
    await redis.del("all_products");
    await redis.del("all_ratings");
    await redis.del(`rating:${ratings[0].product_id}`);
    await redis.del(`product:${ratings[0].product_id}`);

    res.status(StatusCodes.OK).json({ message: "Ratings deleted successfully" });
};
const getAllRatings = async(req, res) => {
    const cacheKey = "all_ratings";

    // Check if the products are already cached in Redis
    const cachedRatings = await redis.get(cacheKey);

    if (cachedRatings) {
        console.log("Redis HIT:", cacheKey);
        // If cached data exists, return it as JSON
        return res.status(StatusCodes.OK).json({ ratings: JSON.parse(cachedRatings), message: "Fetched from cache" });
    }
    console.log("Redis MISS:", cacheKey);

    const [ratings] = await pool.query("SELECT * FROM ratings")

    // get all ratings from database and store them in the cache for 1 hour
    await redis.setex(cacheKey, process.env.REDIS_EXP_TIME, JSON.stringify(ratings));

    return res.status(StatusCodes.OK).json({ ratings: ratings, message: "these are all ratings" });
};

export { addRatings, getProductRatings, deleteRatings, getAllRatings }