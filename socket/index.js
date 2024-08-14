const { Server } = require("socket.io");
const io = new Server();
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
io.listen(3000);
module.exports = io;
