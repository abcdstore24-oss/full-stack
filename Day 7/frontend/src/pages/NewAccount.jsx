import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAccount } from "../services/bankService.js";
import Message from "../components/Message.jsx";

export default function NewAccount() {
  const [name, setName] = useState("");
  const [opening, setOpening] = useState("");
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, amount: opening }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      navigate(`/accounts/${data.accountNumber}`);
    } catch (err) {
      setMsg({ ok: false, text: err.message });
    }
  };

  return (
    <form className="panel narrow" onSubmit={handleSubmit}>
      <h1>Open an account</h1>
      <label>
        Account holder name
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Asha Sharma"
        />
      </label>
      <label>
        Opening deposit (optional)
        <input
          value={opening}
          onChange={(e) => setOpening(e.target.value)}
          inputMode="decimal"
          placeholder="5000"
        />
      </label>
      <Message msg={msg} />
      <button className="btn">Open account</button>
    </form>
  );
}
