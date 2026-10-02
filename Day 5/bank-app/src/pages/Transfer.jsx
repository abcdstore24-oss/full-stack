import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  getAccounts,
  transfer,
  formatMoney,
  formatDate,
} from "../services/bankService.js";
import Message from "../components/Message.jsx";

export default function Transfer() {
  const location = useLocation();
  const [accounts, setAccounts] = useState([]);
  const [from, setFrom] = useState(location.state?.from || "");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setAccounts(getAccounts());
  }, [result]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      setResult(transfer(from, to, amount));
      setMsg(null);
      setTo("");
      setAmount("");
    } catch (err) {
      setResult(null);
      setMsg({ ok: false, text: err.message });
    }
  };

  return (
    <div className="split">
      <form className="panel" onSubmit={handleSubmit}>
        <h1>Transfer money</h1>
        <label>
          From
          <select value={from} onChange={(e) => setFrom(e.target.value)}>
            <option value="">Choose an account</option>
            {accounts.map((a) => (
              <option key={a.accountNumber} value={a.accountNumber}>
                {a.holder} · {a.accountNumber} · {formatMoney(a.balance)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Destination account number
          <input
            value={to}
            onChange={(e) => setTo(e.target.value)}
            inputMode="numeric"
            placeholder="10-digit number"
          />
        </label>
        <label>
          Amount (₹)
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            placeholder="500"
          />
        </label>
        <Message msg={msg} />
        <button className="btn">Send money</button>
      </form>

      {result && (
        <div className="panel receipt">
          <h2>Transfer complete</h2>
          <p className="big credit">{formatMoney(result.amount)}</p>
          <dl>
            <dt>From</dt>
            <dd>
              {result.fromHolder} · {result.from}
            </dd>
            <dt>To</dt>
            <dd>
              {result.toHolder} · {result.to}
            </dd>
            <dt>Time</dt>
            <dd>{formatDate(result.timestamp)}</dd>
          </dl>
          <Link to={`/accounts/${result.from}/statement`}>View statement</Link>
        </div>
      )}
    </div>
  );
}
