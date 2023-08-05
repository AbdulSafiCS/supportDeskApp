const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

//Register a new User

// route --> /api/Users

//access --> public

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //validation

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("please include all fields");
  }
  // User already exist?
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error(
      "User with that email already exist. Try logging in, please."
    );
  }

  //hashing the password with bcrypt
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //create a new User

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("invalid User data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  //email and user password authentication
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password combination");
  }
});
//generate token function

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
const getMe = asyncHandler(async (req, res) => {
  const user = {
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
  };
  res.status(200).json(user);
});
module.exports = {
  registerUser,
  loginUser,
  getMe,
};

//get cuurent user - private route
