const activatedRoomList = new Map();

module.exports = function socket(app) {
  app.io = require("socket.io")({
    cors: {
      origin: "*"
    }
  });

  app.io.on("connection", (socket) => {
    // main 페이지 입장 시 로직
    socket.on("join", (user, roomId) => {
      if (!user.email) return;

      const { email } = user;

      socket.join(roomId);

      if (activatedRoomList.has(roomId)) {
        const targetRoomInfo = activatedRoomList.get(roomId);
        const userInfo = {
          email,
          isOwner: targetRoomInfo.owner === email,
          socketId: socket.id
        };

        targetRoomInfo.participants.push(userInfo);
      }

      app.io.to(roomId).emit(
        "receive targetRoomInfo", activatedRoomList.get(roomId)
      );
    });

    socket.on("create room", (user, roomInfo) => {
      const { email } = user;
      const { title, roomId } = roomInfo;

      const newRoom = {
        roomTitle: title,
        owner: email,
        participants: [],
        contents: ""
      };

      activatedRoomList.set(roomId, newRoom);
    });

    socket.on("bye", (email, roomId) => {
      let currentRoom = activatedRoomList.get(roomId);

      if (!currentRoom) return;

      if (currentRoom.owner === email) {
        activatedRoomList.delete(roomId);

        app.io.to(roomId).emit("receive participants", null);
      } else {
        const filtedJoinUser = currentRoom.participants.filter(
          (participant) => participant !== email
        );

        currentRoom.participants = filtedJoinUser;
        app.io.to(roomId).emit("receive participants", activatedRoomList.get(roomId));
        app.io.emit("receive activeRoomList", Array.from(activatedRoomList.keys()));
      }
    });

    socket.on("send chat", (chatLog) => {
      const { roomId } = chatLog;

      app.io.to(roomId).emit("receive chat", chatLog);
    });

    socket.on("init roomList", () => {
      app.io.emit("receive activeRoomList", Array.from(activatedRoomList.keys()));
    });

    socket.on("changeEvent", (data) => {
      app.io.emit("changeEvent", data);
    });

    socket.on("send codeEditor text", (data) => {
      const { value, roomId } = data;
      const roomInfo = activatedRoomList.get(roomId);

      roomInfo.contents = value;
      app.io.to(roomId).emit("receive codeEditor text", value);
    });

    socket.on("set initial text", (roomId) => {
      const roomInfo = activatedRoomList.get(roomId);

      if (!roomInfo) return;
      app.io.to(roomId).emit("receive initial text", roomInfo.contents);
    });
  });
}
