const express = require("express");
const controller = require("../controllers/image-controller.js");
const authMiddleware = require("../middleware/auth-middleware.js");
const adminMiddleware = require("../middleware/admin-middleware.js");
const uploadMiddleware = require("../middleware/image-upload-middleware.js");

const router = express.Router();

// all users who are authenticated can get all images
router.get(
  "/",
  authMiddleware,
  uploadMiddleware.single("image"),
  controller.getImages
);
// only admins can post an image
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"),
  controller.uploadImage
);

module.exports = router;
