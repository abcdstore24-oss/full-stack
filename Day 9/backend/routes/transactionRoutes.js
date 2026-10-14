const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/auth")

const { getRecent } = require("../controllers/transactionController");

router.use(requireLogin)

router.get("/recent", getRecent);

module.exports = router
