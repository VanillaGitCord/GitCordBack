const express = require("express");
const router = express.Router();

const { createRoom } = require("../controllers/room.controller");

router.post("/", createRoom);

router.post("/", function(req, res, next) {
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
