const activatedRoomList = new Map();

module.exports = function socket(app) {
  app.io = require("socket.io")();

  app.io.on("connection", (socket) => {
    socket.on("join", (roomId) => {
      socket.join(roomId);
    });

    socket.on("disconnect", () => {
      app.io.emit("activatedRoomList", Array.from(activatedRoomList.keys()));
    });

    socket.on("init", (user, roomInfo) => {
      if (!user.email) return;

      const { roomTitle, roomId } = roomInfo;

      if (activatedRoomList.has(roomId)) {
        const roomUserList = activatedRoomList.get(roomId);

        user.email && roomUserList.joinUsers.push(user.email);
      } else {
        const newRoom = {
          roomTitle,
          joinUsers: [user.email],
          owner: user.email
        };

        activatedRoomList.set(roomId, newRoom);
      }

      app.io.emit("receive participants", activatedRoomList.get(roomId));
    });

    socket.on("bye", (user) => {
      activatedRoomList.delete(user.email);
      socket.disconnect();
    });

    socket.on("send chat", (chatLog) => {
      const { roomId } = chatLog;

      app.io.to(roomId).emit("receive chat", chatLog);
    });

    socket.on("init roomList", () => {
      app.io.emit("receive activeRoomList", Object.fromEntries(activatedRoomList));
    });

    socket.on("changeEvent", (data) => {
      app.io.emit("changeEvent", data);
    });
  });
}
