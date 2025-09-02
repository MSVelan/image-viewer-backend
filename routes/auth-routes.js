const express = require("express");
const controller = require("../controllers/auth-controller.js");
const authMiddleware = require("../middleware/auth-middleware.js");

const router = express.Router();

// routes related to authentication
router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);
router.post("/change-password", authMiddleware, controller.changePassword);

module.exports = router;
