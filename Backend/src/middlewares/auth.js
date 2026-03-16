exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.Role !== "ADMIN") {
    return res.status(403).json({
      message: "Chỉ Admin mới được phép thực hiện"
    });
  }
  next();
};

exports.isUserOrAdmin = (req, res, next) => {
  const userId = req.params.id;

  if (req.user.Role === "ADMIN") {
    return next();
  }

  if (req.user.Role === "USER" && req.user.UserID == userId) {
    return next();
  }

  return res.status(403).json({
    message: "Bạn không có quyền truy cập"
  });
};