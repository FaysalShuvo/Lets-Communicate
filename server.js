const path = require("path");
const express = require("express");
const app = express();

const server = app.listen(3000, () => {
  console.log("server running in 3000");
});

const io = require("socket.io")(server);
app.use(express.static(path.join(__dirname, "")));

io.on("connection", (socket) => {
  console.log("SOCKET id is:", socket.id);
});
