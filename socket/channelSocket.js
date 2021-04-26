module.exports = function channelSocket(
  app,
  socket,
  activatedRoomList,
  typingUsersInEachRoom
) {
  socket.on("init room list", () => {
    app.io.emit(
      "receive active room list",
      Array.from(activatedRoomList.entries())
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
}
