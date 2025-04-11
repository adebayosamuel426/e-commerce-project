import pool from '../db/connectDB.js'
import redis from '../config/redisClients.js';
import { StatusCodes } from 'http-status-codes';
import { NotFoundError } from '../errors/customError.js';
import path from 'path';
import { fileURLToPath } from "url";
import fs from "fs";
import * as dotenv from 'dotenv';
dotenv.config();
// Define __dirname for ES Modules
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);
import cloudinary from '../config/cloudinaryConfig.js';

const addProduct = async(req, res) => {
    const { name, description, price, category_id, stock, ratings = 3 } = req.body;
    if (!name || !price || !category_id || !stock) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Please provide all required fields: name, description, price, and category_id.' });
    }
    console.log("image", req.file);
    console.log(req.body);

    let image_url;


    if (!req.file) return res.status(400).json({ message: "No file uploaded" });


    // Convert buffer to base64 string
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    console.log(fileBase64);



    // Upload directly to Cloudinary with optimizations
    const result = await cloudinary.uploader.upload(fileBase64, {
        folder: "ecommerce-images",
        quality: "auto:low", // Auto optimize image quality
        transformation: [{ width: 800, height: 800, crop: "limit" }] // Resize if needed
    });

    image_url = result.secure_url; // Save Cloudinary URL
    console.log("Cloudinary URL:", image_url);


    const [products] = await pool.query('INSERT INTO products (name, description, price, stock, image_url, category_id, ratings)  VALUES (?, ?, ?, ?, ?, ?, ?)', [name, description, price, stock, image_url, category_id, ratings]);

    // Invalidate the cache for all products since the list has changed
    await redis.del("all_products");

    res.status(StatusCodes.CREATED).json({ product: products[0], message: "a new product has been created" });
};

const updateProductDetails = async(req, res) => {
    const { id } = req.params;
    const { name, description, price, category_id, stock } = req.body;
    const image = req.file
    const [products] = await pool.query('SELECT * FROM products WHERE id =?', [id])
    if (!products || products.length === 0) {
        throw new NotFoundError("product not found")
    }

    //getting the existing product from database
    const existingProduct = products[0];
    const newName = name || existingProduct.name;
    const newDescription = description || existingProduct.description;
    const newPrice = price || existingProduct.price;
    const newCategoryId = category_id || existingProduct.category_id;
    const newStock = stock || existingProduct.stock;
    let newImagePath = existingProduct.image_url;



    if (image) {
        try {
            // Extract old image public_id and delete it
            if (existingProduct.image_url) {
                const urlParts = existingProduct.image_url.split("/");
                const fileNameWithExtension = urlParts.pop(); // Get 'kc7tlbl0d7tupj2ghrkw.png'
                const publicId = `ecommerce-images/${fileNameWithExtension.split(".")[0]}`; // Remove extension

                await cloudinary.uploader.destroy(publicId);
                console.log(`Deleted old image: ${publicId}`);
            }
        } catch (error) {
            console.error("Error deleting old image from Cloudinary:", error);
        }

        // Convert new image buffer to base64
        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

        // Upload directly to Cloudinary with optimizations
        const result = await cloudinary.uploader.upload(fileBase64, {
            folder: "ecommerce-images",
            quality: "auto:low", // Auto optimize image quality
            transformation: [{ width: 800, height: 800, crop: "limit" }] // Resize if needed

        });

        newImagePath = result.secure_url; // Save Cloudinary URL
    }


    // Updating the product's info in the database
    const [updatedProducts] = await pool.query('UPDATE products SET name =?, description =?, price =?, image_url =?,stock =?, category_id =? WHERE id =?', [newName, newDescription, newPrice, newImagePath, newStock, newCategoryId, id]);


    // Invalidate the cached product and all products cache
    await redis.del(`product:${id}`);
    await redis.del("all_products");

    res.status(StatusCodes.OK).json({ message: "product details have been updated" });
};

const deleteProduct = async(req, res) => {
    const { id } = req.params;
    const [products] = await pool.query('SELECT * FROM products WHERE id =?', [id])
    if (!products || products.length === 0) {
        throw new NotFoundError("product not found")
    }
    const product = products[0];
    const [deletedProduct] = await pool.query('DELETE FROM products WHERE id =?', [id]);


    // Invalidate the cached product and all products cache
    await redis.del(`product:${id}`);
    await redis.del("all_products");

    res.status(StatusCodes.OK).json({ message: `product ${product.name} has been deleted` });

};
const getAllProducts = async(req, res) => {
    const cacheKey = "all_products";

    // Check if the products are already cached in Redis
    const cachedProducts = await redis.get(cacheKey);


    if (cachedProducts) {
        // If cached data exists, return it as JSON
        return res.status(StatusCodes.OK).json({ products: JSON.parse(cachedProducts), message: "Fetched from cache" });
    }
    // If not cached, fetch products from the database 
    const [products] = await pool.query('SELECT * FROM products');
    // Cache the products for future use (set expiration to 1 hour)
    await redis.setex(cacheKey, process.env.REDIS_EXP_TIME, JSON.stringify(products));


    res.status(StatusCodes.OK).json({ products: products, message: "these are all the products fetched from database" });
};

const getProductById = async(req, res) => {
    const { id } = req.params;
    const cacheKey = `product:${id}`; // Unique key for each product

    // Check if the product is already cached in Redis
    const cachedProduct = await redis.get(cacheKey);

    if (cachedProduct) {
        // If cached data exists, return it as JSON
        return res.status(StatusCodes.OK).json({ product: JSON.parse(cachedProduct), message: `Fetched product with ID: ${id} from cache` });
    }


    const [products] = await pool.query('SELECT p.id, p.name, p.description, p.price, p.stock, p.image_url, p.created_at, p.ratings, c.name AS category_name FROM products p JOIN categories c ON p.category_id = c.id WHERE p.id =?', [id])
    if (!products || products.length === 0) {
        throw new NotFoundError("product not found");
    }
    const product = products[0];

    // Cache the product for future use (set expiration to 1 hour)
    await redis.setex(cacheKey, process.env.REDIS_EXP_TIME, JSON.stringify(product));


    res.status(StatusCodes.OK).json({ product: product, message: `product with id:${product.id} ${product.name} has been gotten from database` });
};



const searchProducts = async(req, res) => {
    const { query } = req.query;
    const cacheKey = `search:${query}`;

    // Check if the search results are already cached in Redis
    const cachedResults = await redis.get(cacheKey);

    if (cachedResults) {
        // If cached data exists, return it as JSON
        return res.status(StatusCodes.OK).json({ products: JSON.parse(cachedResults), message: "Fetched search results from cache" });
    }

    const [products] = await pool.query("SELECT * FROM products WHERE MATCH(name, description) AGAINST (?) ORDER BY ratings ASC ", [query])

    await redis.setex(cacheKey, process.env.REDIS_EXP_TIME, JSON.stringify(products));

    res.status(StatusCodes.OK).json({ products: products, message: "here is the likely product" })
}


export { addProduct, updateProductDetails, deleteProduct, getAllProducts, getProductById, searchProducts };