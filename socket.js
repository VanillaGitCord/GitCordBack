const activatedRoomList = new Map();

module.exports = function socket(app) {
  app.io = require("socket.io")({
    cors: {
      origin: "*"
    }
  });

  app.io.on("connection", (socket) => {
    socket.on("join", (roomId) => {
      socket.join(roomId);
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

      app.io.to(roomId).emit("receive participants", activatedRoomList.get(roomId));
      app.io.emit("receive activeRoomList", Object.fromEntries(activatedRoomList));
    });

    socket.on("bye", (email, roomId) => {
      let currentRoom = activatedRoomList.get(roomId);

      if (!currentRoom) return;

      if (currentRoom.owner === email) {
        activatedRoomList.delete(roomId);

        app.io.to(roomId).emit("receive participants", null);
      } else {
        const filtedJoinUser = currentRoom.joinUsers.filter(
          (joinUser) => joinUser !== email
        );

        currentRoom.joinUsers = filtedJoinUser;
        app.io.to(roomId).emit("receive participants", activatedRoomList.get(roomId));
        app.io.emit("receive activeRoomList", Object.fromEntries(activatedRoomList));
      }
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
