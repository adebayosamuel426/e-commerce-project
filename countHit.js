import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { inspect } from 'util';
// ESM __dirname “polyfill”
const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// Now build a path to logs.txt in the same folder
const logPath = path.join(__dirname, "logs.txt");
const log = fs.readFileSync(logPath, "utf-8");

const hits = (log.match(/Redis HIT/g) || []).length;
const misses = (log.match(/Redis MISS/g) || []).length;

console.log(` REDIS HITs: ${hits}`);
console.log(` REDIS MISSes: ${misses}`);

const total = hits + misses;
const hitRate = ((hits / total) * 100).toFixed(2);

console.log(` Cache Effectiveness (Hit Rate): ${hitRate}%`);


//Frequency of Requests per Endpoint
const endpoints = {};

log.split('\n').forEach(line => {
    const match = line.match(/GET|POST|DELETE|PATCH|PUT/);
    if (match) {
        const endpoint = line.split(' ')[2]; // e.g. /api/v1/products
        endpoints[endpoint] = (endpoints[endpoint] || 0) + 1;
    }
});

console.log(` Request Frequencies:`);
console.table(endpoints);

// GET /api/v1/users/profile 200 141 - 472.146 ms
const lineRe = /^(?<method>GET|POST|PUT|DELETE|PATCH)\s+(?<url>\/\S*)\s+(?<status>\d{3})\s+(?<size>\d+|-) \s*-\s* (?<time>[\d.]+)\s*ms$/gm;

const entries = [];
let match;
while ((match = lineRe.exec(log)) !== null) {
    const { method, url, status, size, time } = match.groups;
    entries.push({
        method,
        url,
        status: Number(status),
        responseSize: size === '-' ? null : Number(size),
        responseTimeMs: Number(time),
    });
}
const okUrls = entries
    .filter(e => e.status === 200)

console.log(
    inspect(okUrls, {
        depth: null, // follow nested objects
        maxArrayLength: null // show *all* array items
    })
);