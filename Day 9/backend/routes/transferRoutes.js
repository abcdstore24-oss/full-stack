const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/auth")
const { transfer } = require("../controllers/transferController");

router.use(requireLogin)

router.get("/", transfer);

module.exports = router;
