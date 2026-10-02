import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getAccount, deposit, withdraw } from "../services/bankService.js";
import AccountCard from "../components/AccountCard.jsx";
import Message from "../components/Message.jsx";
import NotFound from "./NotFound.jsx";

export default function AccountDetail() {
  const { accountNumber } = useParams();
  const [account, setAccount] = useState(null); // null = loading, false = missing
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    setAccount(getAccount(accountNumber) || false);
    setMsg(null);
  }, [accountNumber]);

  if (account === null) return null;
  if (account === false) return <NotFound />;

  const run = (action, label) => {
    try {
      action(accountNumber, amount);
      setAccount(getAccount(accountNumber));
      setAmount("");
      setMsg({ ok: true, text: `${label} completed.` });
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    }
  };

  return (
    <div className="split">
      <AccountCard account={account} />
      <div className="panel">
        <h1>Account summary</h1>
        <p className="muted">
          Holder: {account.holder} · Account {account.accountNumber}
        </p>
        <label>
          Amount (₹)
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            placeholder="1000"
          />
        </label>
        <Message msg={msg} />
        <div className="row">
          <button className="btn" onClick={() => run(deposit, "Deposit")}>
            Deposit
          </button>
          <button
            className="btn ghost"
            onClick={() => run(withdraw, "Withdrawal")}
          >
            Withdraw
          </button>
        </div>
        <div className="row links">
          <Link to="/transfer" state={{ from: account.accountNumber }}>
            Send a transfer
          </Link>
          <Link to={`/accounts/${account.accountNumber}/statement`}>
            View statement
          </Link>
        </div>
      </div>
    </div>
  );
}
