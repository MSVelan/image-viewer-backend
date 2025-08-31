const User = require("../models/user.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register controller
const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const checkExistingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (checkExistingUser) {
      return res.status(400).json({
        success: false,
        message: "User with same username or email exists already",
      });
    }

    // hash user password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await user.save();

    if (user) {
      res.status(201).json({
        success: true,
        message: "User created successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid details provided for user creation",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: `Error occurred: ${err}`,
    });
  }
};

// login controller
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    // check if user with the given username exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Username doesn't exists, register first",
      });
    }

    // check if password is correct
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Password is incorrect for the given username",
      });
    }

    // create bearer token
    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "15m" }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      accessToken,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: `Error occurred: ${err}`,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
