const express = require("express")
const router = express.Router();

const {createAccount, getAccounts, getAccount, deposit, withdraw, getStatement } = require("../controllers/accountController");

router.post("/", createAccount)
router.get("/", getAccounts)
router.get("/:accountNumber", getAccount)
router.post("/:accountNumber/deposit", deposit)
router.post("/:accountNumber/withdraw", withdraw)
router.get("/:accountNumber/transactions", getStatement)

module.exports = router