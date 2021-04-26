module.exports = function camWindowSocket(
  app,
  socket
) {
  socket.on("sending signal", (payload) => {
    app.io.to(payload.userToSignal).emit(
      "user joined",
      {
        signal: payload.signal,
        isOwner: payload.isUserOwner,
        callerID: payload.callerID
      });
  });

  socket.on("returning signal", (payload) => {
    app.io.to(payload.callerID).emit(
      "receiving returned signal",
      {
        signal: payload.signal,
        id: socket.id
      });
  });
}
