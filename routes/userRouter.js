var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  const {
    body: { email, password, userName }
  } = req;

  res.json({
    message: null
  });

  /*
  res.json({
    message: "E-mail을 입력 해주세요!"
  });
  res.json({
    message: "Password를 입력 해주세요!"
  });
  res.json({
    message: "name을 입력 해주세요!"
  });
  res.status(500).json({
    message: "예상치 못한 오류가 발생 했습니다!"
  });
  */
});

router.put('/', function(req, res, next) {
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
