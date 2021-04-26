module.exports = function whiteBoard(app, socket) {
  socket.on("send draw start", (roomId, pos) => {
    app.io.to(roomId).emit("draw start", pos).broadcast;
  });

  socket.on("send draw", (roomId, pos) => {
    app.io.to(roomId).emit("drawing", pos).broadcast;
  });

  socket.on("delete canvas", (roomId) => {
    app.io.to(roomId).emit("clear canvas");
  });

  socket.on("change color", (roomId, color) => {
    app.io.to(roomId).emit("receive color", color);
  });
}
