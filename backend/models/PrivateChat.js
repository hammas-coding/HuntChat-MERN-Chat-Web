const mongoose = require("mongoose");

const PrivateMessageSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

PrivateMessageSchema.index(
  { from: 1, to: 1, text: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("PrivateMessage", PrivateMessageSchema);
