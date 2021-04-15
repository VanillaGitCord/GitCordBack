const mongoose = require("mongoose");

const Document = new mongoose.Schema({
  content: {
    type: String,
    default: ""
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  history: {
    type: [String],
    default: []
  },
  room: {
    type: mongoose.Types.ObjectId,
    ref: "Room"
  }
});

module.exports = mongoose.model("Document", Document);
