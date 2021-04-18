const mongoose = require("mongoose");

const Room = new mongoose.Schema({
  owner: {
    type: mongoose.Types.ObjectId,
    ref: "User"
  },
  title: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Room", Room);
