const jwt = require("jsonwebtoken");
const { User } = require("../models");

const jwtAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token missing"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle hardcoded admin account (id === "admin" in token)
    if (decoded.id === "admin" && decoded.role === "ADMIN") {
      req.user = { UserID: "admin", Ho: "Admin", Ten: "TLK", Email: "admintlk@gmail.com", Role: "ADMIN" };
      return next();
    }

    // Lấy thông tin user đầy đủ từ DB để có trường Role
    const user = await User.findByPk(decoded.id);
    if (!user) {
        return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};

module.exports = jwtAuth;