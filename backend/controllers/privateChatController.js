const PrivateMessage = require("../models/PrivateChat");
const User = require("../models/User");

exports.getPrivateMessages = async (req, res) => {
  const { recipientId } = req.params;
  try {
    const sender = await User.findById(req.user.id);
    if (!sender) {
      return res.status(404).json({ msg: "Sender not found" });
    }
    const senderUsername = sender.username;

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ msg: "Recipient not found" });
    }
    const recipientUsername = recipient.username;

    const messages = await PrivateMessage.find({
      $or: [
        { from: recipientUsername, to: senderUsername },
        { from: senderUsername, to: recipientUsername },
      ],
    }).sort({ date: 1 });

    res.json(messages);
  } catch (err) {
    console.error("Error in getPrivateMessages:", err.message);
    res.status(500).send("Server error");
  }
};

exports.sendPrivateMessage = async (req, res) => {
  const { to, text } = req.body;
  try {
    const sender = await User.findById(req.user.id);
    if (!sender) {
      return res.status(404).json({ msg: "Sender not found" });
    }
    const senderUsername = sender.username;

    const recipient = await User.findOne({ username: to });
    if (!recipient) {
      return res.status(404).json({ msg: "Recipient not found" });
    }
    const recipientUsername = recipient.username;

    const message = new PrivateMessage({
      from: senderUsername,
      to: recipientUsername,
      text,
    });

    await message.save();
    res.json(message);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
