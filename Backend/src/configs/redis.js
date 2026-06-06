const Redis = require("ioredis");

let connection = null;

if (process.env.REDIS_URL) {
  try {
    connection = new Redis(process.env.REDIS_URL);

    connection.on("connect", () => {
      console.log("Redis connected successfully");
    });

    connection.on("error", (err) => {
      console.error("Redis connection error:", err.message);
    });

  } catch (e) {
    console.error("Failed to initialize Redis:", e.message);
    connection = null;
  }
} else {
  console.log("⚠️ REDIS_URL not defined. Redis disabled.");
}

module.exports = connection;