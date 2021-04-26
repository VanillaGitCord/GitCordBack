module.exports = function chatSocket(app, socket) {
  socket.on("send chat", (chatLog) => {
    const { roomId } = chatLog;

    app.io.to(roomId).emit("receive chat", chatLog);
  });
}
