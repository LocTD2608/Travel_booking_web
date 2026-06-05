const Redis = require("ioredis");
let connection = null;

if (process.env.REDIS_HOST || process.env.REDIS_PORT) {
  try {
    connection = new Redis({
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      maxRetriesPerRequest: null,
    });

    connection.on("connect", () => {
      console.log("Redis connected successfully");
    });

    connection.on("error", (err) => {
      console.error("Redis connection error:", err.message);
    });
  } catch (e) {
    console.error("Failed to initialize Redis connection:", e.message);
    connection = null;
  }
} else {
  console.log("⚠️ REDIS_HOST/REDIS_PORT not defined in env. Redis features are disabled (running in-memory mode).");
}

module.exports = connection;