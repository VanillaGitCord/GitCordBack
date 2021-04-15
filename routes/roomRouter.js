var express = require('express');
var router = express.Router();

router.get('/:room_id', function(req, res, next) {
  const {
    body: { userEmail },
    params: { room_id }
  } = req;

  res.json({
    content,
    message: null
  });

  /*
  res.status(500).json({
    message: "예상치 못한 오류가 발생 했습니다!"
  });
  */
});

router.post('/', function(req, res, next) {
  const {
    body: { accessToken, refreshToken },
    params: { room_id }
  } = req;

  res.json({
    accessToken,
    message: null
  });

  /*
  res.status(500).json({
    message: "예상치 못한 오류가 발생 했습니다!"
  });
  */
});

module.exports = router;
