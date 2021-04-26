module.exports = function connectSocketMain(
  app,
  socket,
  activatedRoomList
) {
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
      "receive active room list",
      Array.from(activatedRoomList.entries())
    );

    app.io.to(roomId).emit(
      "receive target room info",
      activatedRoomList.get(roomId)
    );
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

      app.io.to(roomId).emit(
        "user left",
        targetParticipant
      );
    }
  });
}
