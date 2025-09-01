const cloudinary = require("../config/cloudinary.js");

const uploadToCloudinary = async (filePath) => {
  // Upload an image
  try {
    console.log(filePath);
    const uploadResult = await cloudinary.uploader.upload(filePath);
    console.log(uploadResult);
    return {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };
  } catch (err) {
    console.error("Error while uploading to cloudinary: ", err);
  }
};

module.exports = uploadToCloudinary;
