const ChatMessage = require("./models/ChatMessage");
const PrivateMessage = require("./models/PrivateChat");

const userSocketMap = new Map();
const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("New WebSocket connection");

    socket.on("setUsername", (username) => {
      userSocketMap.set(username, socket.id);
    });

    socket.on("disconnect", () => {
      userSocketMap.forEach((id, username) => {
        if (id === socket.id) {
          userSocketMap.delete(username);
        }
      });
      console.log("User disconnected");
    });

    socket.on("sendPrivateMessage", async ({ from, to, text }) => {
      try {
        const privateMessage = new PrivateMessage({ from, to, text });
        await privateMessage.save();

        const recipientSocketId = userSocketMap.get(to);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("privateMessage", { from, text });
          io.to(recipientSocketId).emit("notification", { from });
        } else {
          console.log(`Recipient ${to} is not connected`);
        }

        socket.emit("privateMessageSent", { from, to, text });
      } catch (error) {
        console.error("Error sending private message:", error);
      }
    });

    socket.on("notifyPrivateMessage", ({ from, to }) => {
      const recipientSocketId = userSocketMap.get(to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("notification", { from });
      }
    });

    socket.on("notifyMessage", ({ room, user }) => {
      io.to(room).emit("notification", { user });
    });
    socket.on("joinRoom", ({ username, room }) => {
      socket.join(room);
      socket.broadcast.to(room).emit("notification", {
        user: username,
        message: `${username} has joined the room`,
      });
      console.log(`${username} joined room ${room}`);
    });

    socket.on("sendMessage", async ({ username, room, message }) => {
      try {
        const chatMessage = new ChatMessage({
          user: username,
          room,
          text: message,
        });
        await chatMessage.save();

        io.to(room).emit("message", chatMessage);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });
  });
};

module.exports = {
  socketHandler,
};
