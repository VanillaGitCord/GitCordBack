var express = require('express');
var router = express.Router();

router.put('/:document_id', function(req, res, next) {
  const {
    body: { content },
    params: { document_id }
  } = req;

  res.json({
    message: null
  });

  /*
  res.status(500).json({
    message: "예상치 못한 에러가 발생했습니다!"
  });
  */
});

module.exports = router;
