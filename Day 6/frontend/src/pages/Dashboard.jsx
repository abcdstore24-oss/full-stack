import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getAccounts,
  getRecentTransactions,
  formatMoney,
  formatDate,
  TYPE_LABELS,
} from "../services/bankService.js";
import AccountCard from "../components/AccountCard.jsx";

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [recent, setRecent] = useState([]);
  useEffect(() => {
    const getAccount =async () => {
      try {
        const response = await fetch("http://localhost:8000/accounts", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setAccounts(data)
      } catch (err) {
        console.log(err.message)
      }
    } 
    const getRecent =async () => {
      try {
        const response = await fetch("http://localhost:8000/transactions/recent", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        console.log(data)
        setRecent(data)
      } catch (err) {
        console.log(err.message)
      }
    } 
    getAccount();
    getRecent()
  }, []);

  const total = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <>
      <section className="hero">
        <p className="muted">
          Total across {accounts.length} account
          {accounts.length === 1 ? "" : "s"}
        </p>
        <h1 className="big">₹ {total}</h1>
      </section>

      {accounts.length === 0 ? (
        <div className="empty">
          <h2>No accounts yet</h2>
          <p>
            Open your first account to start depositing and transferring money.
          </p>
          <Link to="/accounts/new" className="btn">
            Open an account
          </Link>
        </div>
      ) : (
        <>
          <div className="grid">
            {accounts.map((a) => (
              <Link
                key={a.accountNumber}
                to={`/accounts/${a.accountNumber}`}
                className="card-link"
              >
                <AccountCard account={a} />
              </Link>
            ))}
          </div>
          <h2>Recent activity</h2>
          <ul className="activity">
            {recent.map((t) => (
              <li key={t.id}>
                <span>
                  {TYPE_LABELS[t.type]}
                  <small>
                  {new Date(t.timeStamp).toLocaleString()} · {t.accountNumber}
                  </small>
                </span>
                <strong
                  className={
                    t.type === "DEPOSIT" || t.type === "TRANSFER_IN"
                      ? "credit"
                      : "debit"
                  }
                >
                  {t.type === "DEPOSIT" || t.type === "TRANSFER_IN" ? "+" : "−"}
                  ₹ {t.amount}
                </strong>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
