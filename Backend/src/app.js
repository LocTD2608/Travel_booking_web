const express = require('express');
const cors = require('cors');
const testRoutes = require("./routes/testRoutes");
const searchRoutes = require("./routes/search.routes");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const errorHandler = require("./middlewares/errorHandler");
const flightRoutes = require("./routes/flight.routes");
const roomRoutes = require("./routes/room.routes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const dashboardRoutes = require("./routes/dashboard.routes");
const tourRoutes = require("./routes/tour.routes");
const hotelRoutes = require("./routes/hotel.routes");
const accommodationRoutes = require("./routes/accommodation.routes");
const cancellationRoutes = require("./routes/cancellation.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request Logging
app.use((req, res, next) => {
  console.log(`[DEBUG] ${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

const apiRouter = express.Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/search", searchRoutes);
apiRouter.use("/users", userRoutes);
apiRouter.use("/flights", flightRoutes);
apiRouter.use("/hotels", hotelRoutes);
apiRouter.use("/rooms", roomRoutes);
apiRouter.use("/payment", paymentRoutes);
apiRouter.use("/booking", bookingRoutes);
apiRouter.use("/tours", tourRoutes);
apiRouter.use("/accommodations", accommodationRoutes);
apiRouter.use("/cancellations", cancellationRoutes);
apiRouter.use("/", testRoutes);

app.use("/api", apiRouter);

app.use("/api/dashboard", dashboardRoutes);

// Test API
app.get('/', (req, res) => {
  res.json({
    message: 'Travel Booking Backend API is running'
  });
});

//test db
app.get("/test-db", async (req, res) => {
  try {
    await sequelize.authenticate();

    res.json({
      message: "DB is connected",
    });
  } catch (err) {
    res.status(500).json({
      message: "DB connection failed",
      error: err.message,
    });
  }
});

// Catch-all 404 handler
app.use((req, res) => {
  console.log(`[404] ${req.method} ${req.url}`);
  res.status(404).json({ message: `Path ${req.url} not found on this server` });
});

// Global Error Handler
app.use(errorHandler);

require("./workers/bookingWorker");

// Database Sync
const sequelize = require("./configs/database");
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
  } catch (err) {
    console.error("Database connection error:", err);
  }
})();

module.exports = app;


