import mysql from "mysql2";
import * as dotenv from 'dotenv';
dotenv.config();
import { URL } from "url";

const DB = new URL(process.env.DB_URL)

const pool = mysql.createPool({
    host: DB.hostname,
    user: DB.username,
    password: DB.password,
    database: DB.pathname.replace("/", ""),
    port: parseInt(DB.port),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log(" Connected to MySQL Database!");
        connection.release(); // Release the connection back to the pool
    }
});

// Export the connection pool with Promises
export default pool.promise();