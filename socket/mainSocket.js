const EVENT = require("../constants/socketEvents");

module.exports = function connectSocketMain(
  app,
  socket,
  activatedRoomList
) {
  socket.on(EVENT.JOIN, (user, roomId) => {
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
      EVENT.RECEIVE_ACTIVE_ROOM_LIST,
      Array.from(activatedRoomList.entries())
    );

    app.io.to(roomId).emit(
      EVENT.RECEIVE_TARGET_ROOM_INFO,
      activatedRoomList.get(roomId)
    );
  });

  socket.on(EVENT.BYE, (email, roomId) => {
    let currentRoom = activatedRoomList.get(roomId);

    if (!currentRoom) return;

    const targetParticipant = currentRoom.participants.find(
      (participant) => participant.email === email
    );

    socket.leave(roomId);

    if (currentRoom.owner.email === email) {
      activatedRoomList.delete(roomId);

      app.io.to(roomId).emit(EVENT.RECEIVE_PARTICIPANTS, null);

      app.io.to(roomId).emit(
        EVENT.USER_LEFT,
        targetParticipant
      );
    } else {
      const filtedparticipants = currentRoom.participants.filter(
        (participant) => participant.email !== email
      );

      currentRoom.participants = filtedparticipants;

      app.io.to(roomId).emit(
        EVENT.RECEIVE_PARTICIPANTS,
        activatedRoomList.get(roomId)
      );

      app.io.to(roomId).emit(
        EVENT.USER_LEFT,
        targetParticipant
      );
    }
  });
}