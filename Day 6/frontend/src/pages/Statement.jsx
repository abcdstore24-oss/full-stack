import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getAccount,
  getTransactions,
  formatMoney,
  formatDate,
  TYPE_LABELS,
} from "../services/bankService.js";
import NotFound from "./NotFound.jsx";

export default function Statement() {
  const { accountNumber } = useParams();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const getAccount =async () => {
      try {
        const response = await fetch(`http://localhost:8000/accounts/${accountNumber}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setAccount(data)
      } catch (err) {
        console.log(err.message)
      }
    } 
    getAccount();
    const getTransactions = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/accounts/${accountNumber}/transactions`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }
        setTransactions(data);
      } catch (err) {
        setAccount(false)
      }
    };
    getTransactions();
  }, [accountNumber]);


  if (account === null) return null;
  if (account === false) return <NotFound />;

  const shown =
    filter === "ALL"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  return (
    <div className="panel">
      <Link to={`/accounts/${accountNumber}`}>Back to account</Link>
      <h1>Statement</h1>
      <p className="muted">
        {account.name} · {accountNumber} · Balance{" "}
        ₹ {account.balance}
      </p>
      <label className="inline">
        Show
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">All transactions</option>
          {Object.entries(TYPE_LABELS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {shown.length === 0 ? (
        <p className="muted">No transactions to show.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th className="num">Amount</th>
                <th className="num">Balance</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((t) => {
                const credit = t.type === "DEPOSIT" || t.type === "TRANSFER_IN";
                return (
                  <tr key={t.id}>
                    <dd>{new Date(t.timeStamp).toLocaleString()}</dd>
                    <td>{TYPE_LABELS[t.type]}</td>
                    <td className={`num ${credit ? "credit" : "debit"}`}>
                      {credit ? "+" : "−"}
                      ₹ {t.amount}
                    </td>
                    <td className="num">₹{t.balanceAfter}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
