const express = require("express");
const http = require("http");
const app = express();
const port = 3000;

app.use("/public", express.static("public"));
// const server = http.createServer(app);

const io = require("socket.io")(8000,{
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const users = {};
io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    console.log("New User Connected ", name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
    socket.emit("current-members", Object.values(users));
  });
  socket.on("send", (message) => {
    socket.broadcast.emit("recieve", {
      message: message,
      name: users[socket.id],
    });
  });
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("leave", users[socket.id]);
    delete users[socket.id];
  });
});
app.get('/socket.io', function(req, res) {
  console.log("got request for socket.io");
    res.send("Got request for socket.io");
    res.end();
})
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
