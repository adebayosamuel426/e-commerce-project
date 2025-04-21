import pool from '../db/connectDB.js'
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/customError.js';
import redis from '../config/redisClients.js';
import * as dotenv from 'dotenv';
dotenv.config();
const addCategory = async(req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please provide a category name' });
    }
    //To check an existing email
    const [isExisting] = await pool.query("SELECT * FROM categories WHERE name = ?", [name])
    if (isExisting.length > 0) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "category name already exists" });
    };

    //insert a new category
    const [category] = await pool.query("INSERT INTO categories (name) VALUES (?)", [name]);
    // Delete the old category from Redis cache
    // Invalidate the all categories cache
    await redis.del("allCategories");

    res.status(StatusCodes.CREATED).json({ category: category[0], message: "a new category has been created" });
};

const getCategoryById = async(req, res) => {
    const { id } = req.params;
    const cacheKey = `category:${id}`; // Unique key for each category
    // Check if the category is already cached in Redis
    const cacheCategory = await redis.get(cacheKey);
    if (cacheCategory) {
        console.log("Redis HIT:", cacheKey);
        // If cached data exists, return it as JSON
        return res.status(StatusCodes.OK).json({ category: JSON.parse(cacheCategory), message: `Fetched category with ID: ${id} from cache` });
    }
    console.log("Redis MISS:", cacheKey);

    const [category] = await pool.query('SELECT * FROM categories WHERE id =?', [id]);
    if (!category || category.length === 0) {
        throw new NotFoundError("category not found");
    }

    // Cache the category data for 1 hour
    await redis.setex(cacheKey, process.env.REDIS_EXP_TIME, JSON.stringify(category[0]));

    res.status(StatusCodes.OK).json({ category: category[0] });
}

const updateCategory = async(req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if (!name) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please provide a category name' });
    };

    const [categories] = await pool.query('SELECT * FROM categories WHERE id =?', [id])
    if (!categories || categories.length === 0) {
        throw new NotFoundError("category not found")
    }
    const category = categories[0];
    const newName = name || category.name;

    // Updating the category info in the database
    const [updatedUsers] = await pool.query('UPDATE categories SET name =? WHERE id =?', [newName, id]);

    // Invalidate the cached category and all categories cache
    await redis.del(`category:${id}`)
    await redis.del(`categoryProducts:${id}`)
    await redis.del("allCategories");
    res.status(StatusCodes.OK).json({ message: " category name has been updated" });
};

const deleteCategory = async(req, res) => {
    const { id } = req.params;
    const [categories] = await pool.query('SELECT * FROM categories WHERE id =?', [id])
    if (!categories || categories.length === 0) {
        throw new NotFoundError("category not found")
    }
    const category = categories[0];
    const [deletedCategory] = await pool.query('DELETE FROM categories WHERE id =?', [id]);

    // Invalidate the cached category and all categories cache
    await redis.del("allCategories");
    res.status(StatusCodes.OK).json({ message: `category ${category.name} has been deleted` });
};

const getAllCategories = async(req, res) => {
    const cacheKey = 'allCategories';
    const cacheCategory = await redis.get(cacheKey);

    if (cacheCategory) {
        console.log("Redis HIT:", cacheKey);
        // If cached data exists, return it as JSON
        return res.status(StatusCodes.OK).json({ categories: JSON.parse(cacheCategory), message: "Fetched categories from cache" });
    }

    console.log("Redis MISS:", cacheKey);

    const [categories] = await pool.query('SELECT * FROM categories');
    // Cache the categories data for 1 hour
    await redis.setex(cacheKey, process.env.REDIS_EXP_TIME, JSON.stringify(categories));

    res.status(StatusCodes.OK).json({ categories: categories, message: "these are all categories" });
};

const getCategoryProductsById = async(req, res) => {
    const { id } = req.params;
    const cacheKey = `categoryProducts${id}`
    const cacheCategory = await redis.get(cacheKey);
    if (cacheCategory) {
        console.log("Redis HIT:", cacheKey);
        // getting data from cache if it exists in the cache
        return res.status(StatusCodes.OK).json({ categoryProducts: JSON.parse(cacheCategory), message: "products in category gotten from cache" });

    }
    console.log("Redis MISS:", cacheKey);

    const [categoryProducts] = await pool.query('SELECT p.id, p.name, p.price, p.stock, p.image_url, p.ratings, c.name AS category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE c.id =?', [id]);

    // Cache the category products data for 1 hour
    await redis.setex(cacheKey, process.env.REDIS_EXP_TIME, JSON.stringify(categoryProducts));

    res.status(StatusCodes.OK).json({ categoryProducts: categoryProducts, message: `products in category with id: ${id}` });
}

export { addCategory, updateCategory, deleteCategory, getAllCategories, getCategoryProductsById, getCategoryById };