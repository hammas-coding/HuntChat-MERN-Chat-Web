const mongoose = require("mongoose");

const PendingUserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  otpExpiry: {
    type: Date,
    required: true,
  },
  profilePic: {
    type: String,
  },
});

module.exports = mongoose.model("PendingUser", PendingUserSchema);
