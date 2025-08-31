const mongoose = require("mongoose");

const mongodbURI = process.env.DB_CONNECTION_STRING;

const connectToDB = async function () {
  await mongoose
    .connect(mongodbURI)
    .then(() => console.log("Database connected successfully"))
    .catch((err) => {
      console.log("Error occurred while connecting to database: ", err);
      process.exit(1);
    });
};

module.exports = connectToDB;
