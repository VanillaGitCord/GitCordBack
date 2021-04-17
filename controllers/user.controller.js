const argon2 = require("argon2");
const User = require("../model/User");
const Document = require("../model/Document");

module.exports.joinUser = async (req, res, next) => {
  const {
    body: { email, password, name }
  } = req;

  console.log(email, password, name);

  try {
    await User.create({
      email,
      password: await argon2.hash(password),
      name
    });

    const newUser = await User.findOne({ email }).lean();

    await Document.create({
      owner: newUser._id
    });

    res.json({
      message: null
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "예상치 못한 오류가 발생 했습니다!"
    });
  }
};
