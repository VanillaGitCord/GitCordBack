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
        const { participants } = activatedRoomList.get(roomId).roomUserList;

        if (user.email) {
          participants = participants.map(participant => {
            if (participant.email === user.email) {
              participant.socketId = socket.id;
            }

            return participant;
          });
        }
      } else {
        const newRoom = {
          roomTitle,
          participants: [{ email: user.email, socketId: socket.id }],
          owner: user.email
        };

        activatedRoomList.set(roomId, newRoom);
      }

      app.io.to(roomId).emit("receive participants", activatedRoomList.get(roomId));
      app.io.emit("receive activeRoomList", Object.fromEntries(activatedRoomList));
    });

    socket.on("sending signal", payload => {
      app.io.to(payload.userToSignal).emit("user joined", { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
      app.io.to(payload.callerID).emit("receiving returned signal", { signal: payload.signal, id: socket.id });
    });

    socket.on("bye", (email, roomId) => {
      let currentRoom = activatedRoomList.get(roomId);

      if (!currentRoom) return;

      if (currentRoom.owner === email) {
        activatedRoomList.delete(roomId);

        app.io.to(roomId).emit("receive participants", null);
      } else {
        const filtedParticipants = currentRoom.participants.filter(
          (participant) => participant.email !== email
        );

        currentRoom.participants = filtedParticipants;
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
