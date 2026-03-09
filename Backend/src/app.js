const express = require('express');
const cors = require('cors');
const testRoutes = require("./routes/testRoutes");
const searchRoutes = require("./routes/search.routes");
const userRoutes = require("./routes/user.routes");
const errorHandler = require("./middlewares/errorHandler");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", testRoutes);

// Search API
app.use("/api/search", searchRoutes);

// User API
app.use("/api/users", userRoutes);

// Test API
app.get('/', (req, res) => {
  res.json({
    message: 'Travel Booking Backend API is running 🚀'
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
