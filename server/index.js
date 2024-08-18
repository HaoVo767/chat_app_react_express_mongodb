const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./database");
const routers = require("./Routes");

const app = express();

const corsOptions = {
  origin: ["chat-app-react-express-mongodb-git-master-haovo767s-projects.vercel.app"],
  credentials: true,
};

const server = require("http").Server(app, {});
const io = require("socket.io")(server, {
  cors: corsOptions,
});

dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

connectDB.connect();

app.use("/api", routers);
app.get("/", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.status(200).send({ author: "Hao" });
});

const onlineUsers = [];
io.on("connection", (socket) => {
  console.log("new connection", socket.id);

  socket.on("addNewUser", (userId) => {
    if (userId) {
      console.log("user ID ", userId);
      if (onlineUsers.some((onlineUser) => onlineUser?.userId === userId)) {
        const exitsUser = onlineUsers.find((onlineUser) => onlineUser.userId === userId);
        onlineUsers.splice(onlineUsers.indexOf(exitsUser), 1);
        onlineUsers.push({
          userId,
          socketId: socket.id,
        });
      } else {
        onlineUsers.push({
          userId,
          socketId: socket.id,
        });
      }
    }
    io.emit("getUsersOnline", onlineUsers);
  });
  console.log("online users", onlineUsers);
  socket.on("disconnect", () => {
    const newOnlineUsers = onlineUsers.filter((onlineUser) => onlineUser.socketId !== socket.id);
    io.emit("getUsersOnline", newOnlineUsers);
  });
  socket.on("sendMessage", (message) => {
    console.log("message send from socket", socket.id);
    const user = onlineUsers.find((user) => user?.userId === message?.recipientId);
    console.log(message);
    if (user) {
      console.log("this is user", user);
      io.to(user?.socketId).emit("getMessage", message);
      io.to(user?.socketId).emit("getNotifications", {
        ...message,
        isRead: false,
        date: new Date(),
      });
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, function (err) {
  if (err) {
    console.log("server error: " + err);
  }
  console.log("app listening on port " + port);
});

// module.exports = server;
