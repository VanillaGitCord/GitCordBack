const EVENT = require("../constants/socketEvents");

module.exports = function camWindowSocket(
  app,
  socket
) {
  socket.on(EVENT.SENDING_SIGNAL, (payload) => {
    app.io.to(payload.userToSignal).emit(
      EVENT.USER_JOINED,
      {
        signal: payload.signal,
        isOwner: payload.isUserOwner,
        callerID: payload.callerID
      }
    );
  });

  socket.on(EVENT.RETURNING_SIGNAL, (payload) => {
    app.io.to(payload.callerID).emit(
      EVENT.RECEIVE_RETURNED_SIGNAL,
      {
        signal: payload.signal,
        id: socket.id
      }
    );
  });
}
