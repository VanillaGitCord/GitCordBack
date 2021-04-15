const mongoose = require("mongoose");

const Room = new mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: true
  },
  document: {
    type: mongoose.Types.ObjectId,
    ref: "Document"
  },
  chatLog: {
    type: [{
      id: mongoose.Types.ObjectId,
      ref: "User",
      chatContent: String,
      date: {
        type: Date,
        default: date.now()
      }
    }]
  }
});

module.exports = mongoose.model("Room", Room);
