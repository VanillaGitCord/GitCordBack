const participants = new Map();

module.exports = function socket(app) {
  app.io = require("socket.io")();

  app.io.on("connection", (socket) => {
    socket.emit("socket Id", socket.id);

    socket.on("disconnect", () => {
      app.io.emit("participants", Array.from(participants.keys()));
    });

    socket.on("init", (user) => {
      user.email && participants.set(user.emil, socket.id);
      app.io.emit("participants", Array.from(participants.keys()));
    });

    socket.on("bye", (user) => {
      participants.delete(user.email);
      socket.disconnect();
    });

    socket.on("send chat", (chat, roomId) => {
      app.io.to(roomId).emit("receive chat", chat);
    });

    socket.on("changeEvent", (data) => {
      app.io.emit("changeEvent", data);
    });
  });
}
