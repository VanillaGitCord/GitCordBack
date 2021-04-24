const activatedRoomList = new Map();
const typingUsersInEachRoom = new Map();

module.exports = function socket(app) {
  app.io = require("socket.io")({
    cors: {
      origin: "*"
    }
  });

  app.io.on("connection", (socket) => {
    socket.on("disconnect", (reason) => {
      let deleteRoomIndex;

      for (const [roomId, currentRoom] of activatedRoomList) {
        currentRoom.participants.some((participant, index) => {
          if (participant.socketId === socket.id) {
            if (currentRoom.owner.socketId === socket.id) {
              deleteRoomIndex = roomId;

              app.io.to(roomId).emit("receive participants", null);
              return true;
            }

            currentRoom.participants.splice(index, 1);

            app.io.to(roomId).emit(
              "receive participants",
              currentRoom
            );

            app.io.to(roomId).emit(
              "user left",
              participant
            );

            return true;
          }
        });
      }

      socket.leave(deleteRoomIndex);

      activatedRoomList.delete(deleteRoomIndex);

      app.io.emit(
        "receive activeRoomList",
        Array.from(activatedRoomList.entries())
      );
    });

    socket.on("join", (user, roomId) => {
      if (!user.email) return;

      const { email } = user;

      socket.join(roomId);

      if (activatedRoomList.has(roomId)) {
        const targetRoomInfo = activatedRoomList.get(roomId);
        const userInfo = {
          email,
          isOwner: targetRoomInfo.owner.email === email,
          socketId: socket.id
        };

        targetRoomInfo.participants.push(userInfo);
      }

      app.io.emit(
        "receive activeRoomList",
        Array.from(activatedRoomList.entries())
      );

      app.io.to(roomId).emit(
        "receive targetRoomInfo",
        activatedRoomList.get(roomId)
      );
    });

    socket.on("create room", (user, roomInfo) => {
      const { email } = user;
      const { title, roomId } = roomInfo;
      const newRoom = {
        roomTitle: title,
        owner: { email, socketId: socket.id },
        participants: [],
        contents: ""
      };

      activatedRoomList.set(roomId, newRoom);
      typingUsersInEachRoom.set(roomId, new Map());
    });

    socket.on("sending signal", payload => {
      app.io.to(payload.userToSignal).emit(
        "user joined",
        {
          signal: payload.signal,
          isOwner: payload.isUserOwner,
          callerID: payload.callerID
        });
    });

    socket.on("returning signal", payload => {
      app.io.to(payload.callerID).emit(
        "receiving returned signal",
        {
          signal: payload.signal,
          id: socket.id
        });
    });

    socket.on("bye", (email, roomId) => {
      let currentRoom = activatedRoomList.get(roomId);

      if (!currentRoom) return;

      const targetParticipant = currentRoom.participants.find(
        (participant) => participant.email === email
      );

      socket.leave(roomId);

      if (currentRoom.owner.email === email) {
        activatedRoomList.delete(roomId);

        app.io.to(roomId).emit("receive participants", null);

        app.io.to(roomId).emit(
          "user left",
          targetParticipant
        );
      } else {
        const filtedparticipants = currentRoom.participants.filter(
          (participant) => participant.email !== email
        );

        currentRoom.participants = filtedparticipants;

        app.io.to(roomId).emit(
          "receive participants",
          activatedRoomList.get(roomId)
        );

        app.io.emit(
        "receive activeRoomList",
          Array.from(activatedRoomList.entries())
        );

        app.io.to(roomId).emit(
          "user left",
          targetParticipant
        );
      }
    });

    socket.on("send chat", (chatLog) => {
      const { roomId } = chatLog;

      app.io.to(roomId).emit("receive chat", chatLog);
    });

    socket.on("init roomList", () => {
      app.io.emit(
        "receive activeRoomList",
        Array.from(activatedRoomList.entries())
        );
    });

    socket.on("changeEvent", (data) => {
      app.io.emit("changeEvent", data);
    });

    socket.on("start typing", (data) => {
      const {
        typingUser: { name, email },
        value,
        roomId
      } = data;
      const typingUsers = typingUsersInEachRoom.get(roomId);
      const targetRoomInfo = activatedRoomList.get(roomId);

      targetRoomInfo.contents = value;
      typingUsers.set(email, name);

      const typingInfo = {
        text: value,
        typingUsers: Array.from(typingUsers.values())
      };

      app.io.to(roomId).emit("receive text", typingInfo);
    });

    socket.on("stop typing", (stopTypingUserInfo) => {
      if (!stopTypingUserInfo) return;

      const {
        typingUser: { email },
        roomId
      } = stopTypingUserInfo;
      const typingUsers = typingUsersInEachRoom.get(roomId);

      typingUsers && typingUsers.delete(email);

      app.io.to(roomId).emit(
        "receive filtered user list",
        typingUsers
      );
    });

    socket.on("set initial text", (roomId) => {
      const roomInfo = activatedRoomList.get(roomId);

      if (!roomInfo) return;
      app.io.to(roomId).emit("receive initial text", roomInfo.contents);
    });

    socket.on("send draw Start", (roomId, pos) => {
      console.log("send draw Start", pos);
      app.io.to(roomId).emit("drawStart", pos).broadcast;
    });

    socket.on("sendDraw", (roomId, pos) => {
      console.log("sendDraw", pos);
      app.io.to(roomId).emit("drawing", pos).broadcast;
    });
  });
}
