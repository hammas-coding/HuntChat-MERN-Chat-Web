const PendingUser = require("../models/PendingUser");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, profilePic } = req.body;
  try {
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "Email is already registered" });
    }

    let existingPendingUser = await PendingUser.findOne({ email });
    if (existingPendingUser) {
      await PendingUser.deleteOne({ email });
    }

    let existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ msg: "Username is already taken" });
    }

    const otp = crypto.randomBytes(3).toString("hex");
    const otpExpiry = Date.now() + 3600000; // 1 hour

    let pendingUser = new PendingUser({
      username,
      email,
      password,
      otp,
      otpExpiry,
      profilePic,
    });
    await pendingUser.save();

    sendEmail(email, "Account Verification OTP", `Your OTP is ${otp}`);

    res.status(200).json({ msg: "OTP sent to email" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    let pendingUser = await PendingUser.findOne({
      email,
      otp,
      otpExpiry: { $gt: Date.now() },
    });
    if (!pendingUser) {
      return res.status(400).json({ msg: "Invalid OTP or OTP has expired" });
    }

    const { username, password, profilePic } = pendingUser;
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPassword,
      profilePic,
    });

    await PendingUser.deleteOne({ email });

    const payload = { user: { id: pendingUser.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = { user: { id: user.id, username: user.username } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "username");
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Error fetching users" });
  }
};
