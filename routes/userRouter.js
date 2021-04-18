const express = require("express");
const router = express.Router();

const { joinUser, loginUser } = require("../controllers/user.controller");

router.post("/", joinUser);

router.put("/", loginUser);

module.exports = router;
