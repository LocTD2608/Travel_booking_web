exports.isAdmin = (req, res, next) => {
  // fake admin để test
  req.user = { Role: "ADMIN" };
  next();
};

exports.isUserOrAdmin = (req, res, next) => {
  req.user = { Role: "USER" };
  next();
};
