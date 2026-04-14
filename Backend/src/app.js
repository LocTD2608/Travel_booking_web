const express = require('express');
const cors = require('cors');
const testRoutes = require("./routes/testRoutes");
const searchRoutes = require("./routes/search.routes");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const errorHandler = require("./middlewares/errorHandler");
const flightRoutes = require("./routes/flight.routes");
const roomRoutes = require("./routes/room.routes");

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
apiRouter.use("/", testRoutes);

app.use("/api", apiRouter);

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

// Database Sync
const sequelize = require("./configs/database");
sequelize.sync({ alter: true })
  .then(() => console.log("Database synced successfully"))
  .catch(err => console.error("Database sync error:", err));

module.exports = app;
