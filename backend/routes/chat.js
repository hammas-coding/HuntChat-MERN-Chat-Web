const express = require("express");
const {
  uploadFile,
  joinChatRoom,
  sendMessage,
  getAllRooms,
  createRoom,
} = require("../controllers/chatController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.use(auth);
router.post("/upload", uploadFile);
router.post("/join", joinChatRoom);
router.post("/send", sendMessage);
router.get("/", getAllRooms);
router.post("/", createRoom);

module.exports = router;
