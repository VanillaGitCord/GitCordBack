const express = require("express");
const router = express.Router();

const { createRoom } = require("../controllers/room.controller");
const { authToken } = require("../middleWares/authToken");

router.post("/", authToken, createRoom);

module.exports = router;
