const Room = require("../model/Room");
const User = require("../model/User");

module.exports.createRoom = async (req, res, next) => {
  const {
    user,
    accessToken,
    body: { roomTitle }
  } = req;

  try {
    const currentUser = await User.findOne({
      email: user.email
    }).lean();

    await Room.create({
      owner: currentUser._id,
      title: roomTitle
    });

    const newRoom = await Room.findOne({
      owner: currentUser._id
    }).lean();

    res.json({
      message: null,
      roomId: newRoom._id,
      accessToken
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "예상치 못한 오류가 발생 했습니다!"
    });
  }
};
