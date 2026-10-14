const db = require("../config/db");

exports.createAccount = async (req, res) => {
  const { name, amount } = req.body;
  if (!name) {
    return res.status(400).json({
      error: "Please enter a valid name.",
    });
  }
  if (amount < 0) {
    return res.status(400).json({
      error: "Opening deposit cannot be negative.",
    });
  }
  const accountNumber = crypto.randomUUID().replace(/\D/g, "").slice(0, 10);
  try {
    await db.query(
      "INSERT INTO accounts (name, account_number, balance) VALUES (?,?,?)",
      [name, accountNumber, amount],
    );
    await db.query(
      "INSERT INTO transactions (account_number, type, amount, balance_after) VALUES (?,?,?,?)",
      [accountNumber, "DEPOSIT", amount, amount],
    );
    res.json({ name, accountNumber, amount });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

exports.getAccounts = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, account_number, balance FROM accounts",
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

exports.getAccount = async (req, res) => {
  try {
    const accountNumber = req.params.accountNumber;
    const [rows] = await db.query(
      "SELECT id, name, account_number, balance FROM accounts WHERE account_number = (?)",
      accountNumber,
    );

    if (rows.length == 0) {
      return res.status(404).json({
        error: "Account Not Found.",
      });
    }
    return res.json(rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

exports.deposit = async (req, res) => {
  try {
    const accountNumber = req.params.accountNumber;
    const [accounts] = await db.query(
      "SELECT id, name, account_number, balance FROM accounts WHERE account_number = (?)",
      accountNumber,
    );
    if (accounts.length == 0) {
      return res.status(404).json({
        error: "Account Not Found.",
      });
    }
    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: "Enter a valid amount.",
      });
    }
    const account = accounts[0];
    const newBalance = Number(account.balance) + amount;

    await db.query(
      "UPDATE accounts SET balance = (?) WHERE account_number = (?)",
      [newBalance, account.account_number],
    );

    await db.query(
      "INSERT INTO transactions (account_number, type, amount, balance_after) VALUES (?,?,?,?)",
      [account.account_number, "DEPOSIT", amount, newBalance],
    );

    res.json({ ...account, balance: newBalance });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

exports.withdraw = async (req, res) => {
  try {
    const accountNumber = req.params.accountNumber;
    const [accounts] = await db.query(
      "SELECT id, name, account_number, balance FROM accounts WHERE account_number = (?)",
      accountNumber,
    );
    if (accounts.length == 0) {
      return res.status(404).json({
        error: "Account Not Found.",
      });
    }

    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: "Enter a valid amount.",
      });
    }
    const account = accounts[0];
    if (amount > account.balance) {
      return res.status(500).json({
        error: "Insufficient Balance.",
      });
    }
    const newBalance = account.balance - amount;

    await db.query(
      "UPDATE accounts SET balance = (?) WHERE account_number = (?)",
      [newBalance, account.account_number],
    );

    await db.query(
      "INSERT INTO transactions (account_number, type, amount, balance_after) VALUES (?,?,?,?)",
      [account.account_number, "WITHDRAWAL", amount, newBalance],
    );

    res.json({ ...account, balance: newBalance });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Something went wrong.",
    });
  }
};

exports.getStatement = async (req, res) => {
  try {
    const accountNumber = req.params.accountNumber;
    const [rows] = await db.query(
      "SELECT id, account_number, type, amount, balance_after FROM transactions where account_number = (?) ORDER BY created_at DESC",
      [accountNumber],
    );
    res.json(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: "Something went wrong.",
    });
  }
};
