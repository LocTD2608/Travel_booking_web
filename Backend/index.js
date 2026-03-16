const express = require("express");
const app = express();
const sequelize = require("./config/database");

app.use(express.json());

// routes
app.use("/api/users", require("./routes/user.routes"));

// test server
app.get("/", (req, res) => {
  res.send("API is running");
});

// sync DB
sequelize.authenticate()
  .then(() => {
    console.log(" Database connected");
    app.listen(3000, () => {
      console.log(" Server running at http://localhost:3000");
    });
  })
  .catch(err => {
    console.error(" DB connection failed:", err);
  });
