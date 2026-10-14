const express = require("express");
const router = express.Router();

const { getRecent } = require("../controllers/transactionController");

router.get("/recent", getRecent);

module.exports = router
