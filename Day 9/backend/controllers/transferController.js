const db = require("../config/db");

exports.transfer = async (req, res) => {
  const { from, to, amountInput } = req.body;
  const amount = Number(amountInput);
  if (!from || !to) {
    return res.status(400).json({
      error: "Both accounts are required.",
    });
  }

  if (from === to) {
    return res.status(400).json({
      error: "Source and Destination must be different.",
    });
  }

  if (!amount || amount <= 0) {
    return res.status(400).json({
      error: "Enter a valid amount.",
    });
  }

  const [fromRows] = await db.query(
    "SELECT * FROM accounts WHERE account_number = (?)",
    from,
  );
  const [toRows] = await db.query(
    "SELECT * FROM accounts WHERE account_number = (?)",
    to,
  );
  if (fromRows.length == 0) {
    return res.status(404).json({
      error: "Source Account not found.",
    });
  }

  if (toRows.length == 0) {
    return res.status(404).json({
      error: "Destination Account not found.",
    });
  }

  const fromAccount = fromRows[0];
  if (amount > fromAccount.balance) {
    return res.status(400).json({
      error: "Insufficient Balance.",
    });
  }

  try {
    const toAccount = toRows[0];

    const newFromBalance = Number(fromAccount.balance) - amount;
    const newToBalance = Number(toAccount.balance) + amount;

    db.beginTransaction();
    // FROM
    await db.query(
      "UPDATE accounts SET balance = (?) WHERE account_number = (?)",
      [newFromBalance, fromAccount.account_number],
    );
    await db.query(
      "INSERT INTO transactions (account_number, type, amount, balance_after) VALUES (?,?,?,?)",
      [fromAccount.account_number, "TRANSFER_OUT", amount, newFromBalance],
    );

    // TO
    await db.query(
      "UPDATE accounts SET balance = (?) WHERE account_number = (?)",
      [newToBalance, toAccount.account_number],
    );
    await db.query(
      "INSERT INTO transactions (account_number, type, amount, balance_after) VALUES (?,?,?,?)",
      [toAccount.account_number, "TRANSFER_IN", amount, newToBalance],
    );

    db.commit();
    res.json({
      from: fromAccount.account_number,
      to: toAccount.account_number,
      amount,
      timeStamp: new Date().toISOString(),
    });
  } catch {
    db.rollback();
    res.status(400).json({
      error: "Database Error.",
    });
  }
};
