const express = require("express");
const router = express.Router();

const { transfer } = require("../controllers/transferController");

router.get("/", transfer);

module.exports = router;
