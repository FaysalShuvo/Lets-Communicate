const path = require("path");
const express = require("express");
const app = express();

const server = app.listen(3000, () => {
  console.log("server running in 3000");
});

const io = require("socket.io")(server);
app.use(express.static(path.join(__dirname, "")));
let userConnections = [];
let other_users = userConnections.filter((p) => {
  p.meeting_id == data.meetingId;
});
io.on("connection", (socket) => {
  socket.on("userconnect", (data) => {
    console.log("user connected:", data.displayName, data.meeting_id);

    userConnections.push({
      connectionId: socket.displayName,
      user_id: data.displayName,
      meeting_id: data.meetingId,
    });

    other_users.forEach((v) => {
      socket.to(v.connectionId).emit("inform_others_about_me", {
        other_users_id: data.displayName,
        connId: socket.id,
      });
    });
  });
  socket.on("SDPProcess", (data) => {
    socket.to(data.to_connid).emit("SDPProcess", {
      message: data.message,
      from_connid: socket.id,
    });
  });
});
