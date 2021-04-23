const express = require('express');
const router = express.Router();

const { saveDocument } = require("../controllers/document.controller");

router.post("/", saveDocument);

module.exports = router;
