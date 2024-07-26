const express = require("express");
const privateChatController = require("../controllers/privateChatController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/:recipientId", auth, privateChatController.getPrivateMessages);
router.post("/message", auth, privateChatController.sendPrivateMessage);

module.exports = router;
