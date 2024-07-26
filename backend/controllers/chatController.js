const ChatMessage = require("../models/ChatMessage");
const PrivateMessage = require("../models/PrivateChat");
const { getIO } = require("../socketHandler");
const jwt = require("jsonwebtoken");
const ChatRoom = require("../models/ChatRoom");

const saveMessage = async (room, message) => {
  try {
    if (!message.room || !message.user) {
      throw new Error("Missing required fields: room or user");
    }

    const newMessage = new ChatMessage({ room, ...message });
    await newMessage.save();
  } catch (err) {
    console.error(err.message);
  }
};

const uploadFile = async (req, res) => {
  const { fileUrl, room, message } = req.body;

  if (!fileUrl || !room || !message) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const newMessage = {
      user: req.user.username,
      text: message,
      room,
      fileUrl,
    };

    await saveMessage(room, newMessage);
    res.status(200).json({ fileUrl });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: "Token is not valid" });
  }
};

const joinChatRoom = (req, res) => {
  const { username, room } = req.body;

  if (!username || !room) {
    return res.status(400).json({ msg: "Username and room are required" });
  }

  res.status(200).json({ msg: `User ${username} joined room ${room}` });
};

const sendMessage = async (req, res) => {
  const { room, message, from } = req.body;

  if (!room || !message || !from) {
    return res
      .status(400)
      .json({ msg: "Room, message, and from are required" });
  }

  try {
    const newMessage = new ChatMessage({
      user: from,
      text: message,
      room,
    });
    await newMessage.save();

    const io = getIO();
    io.to(room).emit("message", newMessage);

    res.status(200).json(newMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server error" });
  }
};
const getAllRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find();
    res.status(200).json({ rooms });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
};

const createRoom = async (req, res) => {
  const { room } = req.body;
  try {
    const newRoom = new ChatRoom({ name: room });
    await newRoom.save();
    res.status(201).json({ room: newRoom.name });
  } catch (error) {
    res.status(500).json({ message: "Failed to create room" });
  }
};
module.exports = {
  saveMessage,
  uploadFile,
  auth,
  joinChatRoom,
  sendMessage,
  getAllRooms,
  createRoom,
};
