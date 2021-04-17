const express = require("express");
const router = express.Router();

const { joinUser } = require("../controllers/user.controller");

router.post("/", joinUser);

router.put("/", function(req, res, next) {
  const {
    body: { email, password }
  } = req;

  res.json({
    accessToken,
    refreshToken,
    message: null
  });

  /*
  res.json({
    message: "E-mail을 확인해주세요!"
  });
  res.json({
    message: "Password를 확인해주세요!"
  });
  res.status(500).json({
    message: "예상치 못한 오류가 발생 했습니다!"
  });
  */

});

module.exports = router;
