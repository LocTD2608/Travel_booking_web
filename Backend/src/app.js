const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test API
app.get('/', (req, res) => {
  res.json({
    message: 'Travel Booking Backend API is running 🚀'
  });
});

module.exports = app;
