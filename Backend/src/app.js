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
apiRouter.use("/rooms", roomRoutes);
apiRouter.use("/payment", paymentRoutes);
apiRouter.use("/booking", bookingRoutes);
apiRouter.use("/tours", tourRoutes);
apiRouter.use("/", testRoutes);
apiRouter.use("/booking", bookingRoutes);

app.use("/api", apiRouter);

app.use("/api/dashboard", dashboardRoutes);

// Test API
app.get('/', (req, res) => {
  res.json({
    message: 'Travel Booking Backend API is running'
  });
});

// Catch-all 404 handler
app.use((req, res) => {
  console.log(`[404] ${req.method} ${req.url}`);
  res.status(404).json({ message: `Path ${req.url} not found on this server` });
});

// Global Error Handler
app.use(errorHandler);

require("./workers/bookingWorker");

module.exports = app;
// Database Sync
const sequelize = require("./configs/database");
sequelize.authenticate()
  .then(() => console.log("Database synced successfully"))
  .catch(err => console.error("Database sync error:", err));
module.exports = app;

