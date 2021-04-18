const Room = require("../model/Room");
const User = require("../model/User");

module.exports.createRoom = async (req, res, next) => {
  const {
    body: { roomTitle, userEmail }
  } = req;

  const currentUser = await User.findOne({
    email: userEmail
  }).lean();

  try {
    await Room.create({
      owner: currentUser._id,
      title: roomTitle
    });

    const newRoom = await Room.findOne({
      owner: currentUser._id
    }).lean();

    res.json({
      message: null,
      roomId: newRoom._id
    });
  } catch (err) {
    console.log("에?");
    console.error(err);
    res.status(500).json({
      message: "예상치 못한 오류가 발생 했습니다!"
    });
  }
};
