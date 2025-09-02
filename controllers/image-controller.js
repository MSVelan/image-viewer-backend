const Image = require("../models/image.js");
const {
  uploadToCloudinary,
  deleteResource,
} = require("../helpers/cloudinaryHelper.js");
const fs = require("fs");

const uploadImage = async (req, res) => {
  try {
    // check file is there in req obj
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File not found, upload an image to continue",
      });
    }

    // upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    // store the url, publicId along with the associated userId in mongoDB
    const image = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await image.save();

    // delete file from local storage after uploading
    fs.unlinkSync(req.file.path);

    // image uploaded successfully
    res.status(201).json({
      success: true,
      message: "Image uploaded successfully",
      image,
    });
  } catch (err) {
    console.log("Error occurred: ", err);
    res.status(500).json({
      success: false,
      message: `Error occurred: ${err}`,
    });
  }
};

const getImages = async (req, res) => {
  // get all images.
  try {
    // pagination and sorting functionality
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const totalImages = await Image.countDocuments();
    const totalPages = Math.ceil(totalImages / limit);

    const sortObj = {};
    sortObj[sortBy] = sortOrder;

    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
    if (!images) {
      return res.status(404).json({
        success: false,
        message: "No images found",
      });
    }

    return res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: totalPages,
      totalNumImages: totalImages,
      data: images,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error occurred: ${err}`,
    });
  }
};

const deleteImage = async (req, res) => {
  // only person who uploaded the image can delete it.
  // delete from Cloudinary and then from MongoDB
  try {
    const imageId = req.params.id;
    const userId = req.userInfo.userId;

    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    if (image.uploadedBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete the image",
      });
    }

    // delete from Cloudinary
    await deleteResource(image.publicId);

    // delete from MongoDB
    await Image.findByIdAndDelete(imageId);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Error occurred: ${err}`,
    });
  }
};

module.exports = {
  uploadImage,
  getImages,
  deleteImage,
};
