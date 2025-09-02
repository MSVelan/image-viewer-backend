const cloudinary = require("../config/cloudinary.js");

const uploadToCloudinary = async (filePath) => {
  // Upload an image
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath);
    return {
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };
  } catch (err) {
    console.error("Error while uploading to cloudinary: ", err);
  }
};

const deleteResource = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok") {
      return true;
    } else {
      throw new Error("Cloudinary deletion failed");
    }
  } catch (err) {
    throw new Error(
      "Error occurred while deleting file from cloudinary: " + err.message
    );
  }
};

module.exports = {
  uploadToCloudinary,
  deleteResource,
};
