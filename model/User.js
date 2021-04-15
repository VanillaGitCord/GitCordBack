const mongoose = require("mongoose");

const User = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
    validate: {
      validator: function(v) {
        return v.match(/\w+@\w+.\w+/g);
      },
      message: props => `${props.value} is not a valid Email!`
    }
  },
  password: {
    type: String,
    require: true,
    validate: {
      validator: function(v) {
        return v.match(/^(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,16}$/g);
      },
      message: props => `${props.value} is not a valid Email!`
    }
  },
  name: {
    type: String,
    require: true
  },
  joinRoom: {
    type: [{
      type: mongoose.Types.ObjectId,
      ref: "Room"
    }],
    default: []
  },
  myRoom: {
    type: mongoose.Types.ObjectId,
    ref: "Room",
    default: ""
  },
  refreshAuth: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("User", User);
