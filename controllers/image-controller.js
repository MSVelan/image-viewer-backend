const Image = require("../models/image.js");
const uploadToCloudinary = require("../helpers/cloudinaryHelper.js");
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
    // get all images from mongoDB

    // const userId = req.userInfo.userId;
    // const images = Image.find({ uploadedBy: userId });

    const images = await Image.find({});
    if (!images) {
      return res.status(404).json({
        success: false,
        message: "No images found",
      });
    }

    return res.status(200).json({
      success: true,
      images,
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
};
