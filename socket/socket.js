const connectSocketMain = require("./mainSocket");
const camWindowSocket = require("./camWindowSocket");
const channelSocket = require("./channelSocket");
const codeEditorSocket = require("./codeEditorSocket");
const whiteBoardSocket = require("./whiteBoardSocket");
const chatSocket = require("./chatSocket");

const activatedRoomList = new Map();
const typingUsersInEachRoom = new Map();

module.exports = function socket(app) {
  app.io = require("socket.io")({
    cors: {
      origin: "*"
    }
  });

  app.io.on("connection", (socket) => {
    socket.on("disconnect", () => {
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
        "receive active room list",
        Array.from(activatedRoomList.entries())
      );
    });

    connectSocketMain(app, socket, activatedRoomList);
    camWindowSocket(app, socket);
    channelSocket(app, socket, activatedRoomList, typingUsersInEachRoom);
    codeEditorSocket(app, socket, activatedRoomList, typingUsersInEachRoom);
    whiteBoardSocket(app, socket);
    chatSocket(app, socket);
  });
}
