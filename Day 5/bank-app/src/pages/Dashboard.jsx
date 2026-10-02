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
    setAccounts(getAccounts());
    setRecent(getRecentTransactions(5));
  }, []);

  const total = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <>
      <section className="hero">
        <p className="muted">
          Total across {accounts.length} account
          {accounts.length === 1 ? "" : "s"}
        </p>
        <h1 className="big">{formatMoney(total)}</h1>
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
                    {formatDate(t.timestamp)} · {t.accountNumber}
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
                  {formatMoney(t.amount)}
                </strong>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
