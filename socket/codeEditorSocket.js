module.exports = function codeEditorSocket(
  app,
  socket,
  activatedRoomList,
  typingUsersInEachRoom
) {
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

  socket.on("set contents", (contentsInfo) => {
    const { value, roomId } = contentsInfo;
    const targetRoomInfo = activatedRoomList.get(roomId);

    targetRoomInfo.contents = value;

    app.io.to(roomId).emit("receive document text", value);
  });

  socket.on("set initial text", (roomId) => {
    const roomInfo = activatedRoomList.get(roomId);

    if (!roomInfo) return;
    app.io.to(roomId).emit("receive initial text", roomInfo.contents);
  });
}
