const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied, bearer token is not provided. Login to continue",
    });
  }

  // decode the token
  try {
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
    req.userInfo = decodedTokenInfo;
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Invalid bearer token, login again with valid credentials",
    });
  }
  next();
};

module.exports = authMiddleware;
