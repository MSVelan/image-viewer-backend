const isAdmin = (req, res, next) => {
  const { role } = req.userInfo;
  if (role !== "admin") {
    return res.status(400).json({
      success: false,
      message: "Only admins can access this page, you are not an admin",
    });
  }
  next();
};

module.exports = isAdmin;
