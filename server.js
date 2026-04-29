const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let messages = [];

io.on("connection", (socket) => {
  socket.emit("load_messages", messages);

  socket.on("send_message", (msg) => {
    messages.push(msg);
    io.emit("receive_message", msg);
  });

  socket.on("clear_messages", () => {
    messages = [];
    io.emit("messages_cleared");
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});