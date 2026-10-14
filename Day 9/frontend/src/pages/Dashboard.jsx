import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AccountCard from "../components/AccountCard.jsx";

const TYPE_LABELS = {
  DEPOSIT: "Deposit",
  WITHDRAWAL: "Withdrawal",
  TRANSFER_OUT: "Transfer sent",
  TRANSFER_IN: "Transfer received",
};
const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [recent, setRecent] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token")
    const getAccount =async () => {
      try {
        const response = await fetch(`${API_URL}/accounts`, {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization:`Bearer ${token}`},
        });
        const data = await response.json();
        setAccounts(data)
      } catch (err) {
        console.log(err.message)
      }
    } 
    const getRecent =async () => {
      try {
        const response = await fetch(`${API_URL}/transactions/recent`, {
          method: "GET",
          headers: { "Content-Type": "application/json", Authorization:`Bearer ${token}`},
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

  const total = accounts.reduce((sum, a) => sum + Number(a.balance), 0);

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
                key={a.id}
                to={`/accounts/${a.account_number}`}
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
                  {new Date(t.created_at).toLocaleString()} · {t.account_number}
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
