import Redis from "ioredis";
import * as dotenv from 'dotenv';
dotenv.config();


// Connect to Redis

const redis = new Redis(process.env.REDIS_REST_URL);


redis.on("connect", () => console.log("Connected to Upstash Redis!"));
redis.on("error", (err) => console.error("Redis Error:", err));

export default redis;