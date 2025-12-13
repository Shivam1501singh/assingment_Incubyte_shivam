const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError=require("../utils/AppError");

exports.register = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new AppError("Missing required fields",400);
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError("Email already in use",401);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return token;
};

exports.login = async ({ email, password }) => {
  if (!email || !password) {
    throw new AppError("Missing credentials",400);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("Invalid credentials",401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError("Invalid credentials",401);
  }

  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};