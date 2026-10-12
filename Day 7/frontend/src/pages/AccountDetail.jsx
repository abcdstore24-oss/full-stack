import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AccountCard from "../components/AccountCard.jsx";
import Message from "../components/Message.jsx";
import NotFound from "./NotFound.jsx";

const API_URL = import.meta.env.VITE_API_URL;

export default function AccountDetail() {
  const { accountNumber } = useParams();
  const [account, setAccount] = useState(null); // null = loading, false = missing
  const [amount, setAmount] = useState("");
  const [msg, setMsg] = useState(null);


  useEffect(() => {
    const getAccount = async () => {
      try {
        const response = await fetch(
          `${API_URL}/accounts/${accountNumber}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }
        setAccount(data);
      } catch (err) {
        setAccount(false)
        ({ ok: false, text: err.message });
      }
    };
    getAccount();
  }, [accountNumber]);


  if (account === null) return null;
  if (account === false) return <NotFound />;

  const run = async (type, label) => {
    try{
      const response = await fetch(`${API_URL}/accounts/${accountNumber}/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({amount}),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error);
      }
      setAccount(data);
      setAmount("")
      setMsg({
        ok: true,
        text: `${label} successfull.`
      })
    } catch (err){
      setMsg({
        ok: false,
        text: err.message
      })
    }
  }

  return (
    <div className="split">
      <AccountCard account={account} />
      <div className="panel">
        <h1>Account summary</h1>
        <p className="muted">
          Holder: {account.name} · Account {account.account_number}
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
          <button className="btn" onClick={() => run("deposit", "Deposit")}>
            Deposit
          </button>
          <button
            className="btn ghost"
            onClick={() => run("withdraw", "Withdrawal")}
          >
            Withdraw
          </button>
        </div>
        <div className="row links">
          <Link to="/transfer" state={{ from: account.account_number }}>
            Send a transfer
          </Link>
          <Link to={`/accounts/${account.account_number}/statement`}>
            View statement
          </Link>
        </div>
      </div>
    </div>
  );
}
