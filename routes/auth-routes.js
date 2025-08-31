const express = require("express");
const controller = require("../controllers/auth-controller.js");

const router = express.Router();

// routes related to authentication
router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);

module.exports = router;
