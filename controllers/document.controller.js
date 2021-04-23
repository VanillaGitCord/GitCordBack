const Document = require("../model/Document");
const User = require("../model/User");

module.exports.saveDocument = async (req, res, next) => {
  const {
    body: {
      contents,
      user
    }
  } = req;

  try {
    const currentUser = await User.findOne({ email: user });
    const newDocument = await Document.create({
      contents,
      owner: currentUser._id
    });

    currentUser.documents.push(newDocument._id);
    await currentUser.save();

    return res.status(200).json({
      message: "저장에 성공했습니다"
    });
  } catch (err) {
    return res.status(500).json({
      message: "저장에 실패했습니다"
    });
  }
};

module.exports.getDocuments = async (req, res, next) => {};
