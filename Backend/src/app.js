const express = require('express');
const cors = require('cors');
const testRoutes = require("./routes/testRoutes");
const errorHandler = require("./middlewares/errorHandler");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", testRoutes);

// Test API
app.get('/', (req, res) => {
  res.json({
    message: 'Travel Booking Backend API is running 🚀'
  });
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;

app.use(errorHandler);