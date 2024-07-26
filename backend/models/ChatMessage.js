const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  fileUrl: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
ChatMessageSchema.index(
  { room: 1, tusero: 1, text: 1, date: 1, fileUrl: 1 },
  { unique: true }
);

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);
