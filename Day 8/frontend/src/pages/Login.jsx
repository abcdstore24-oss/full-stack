import { useState } from "react";
import { Link } from "react-router-dom";

// Design only: no backend call. Styles live in index.css (Auth pages section).

function Password({ id, label, value, onChange, autoComplete, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="pw">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="pw-toggle"
          onClick={() => setShow((s) => !s)}
          aria-pressed={show}
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => e.preventDefault();

  return (
    <div className="auth">
      <aside className="auth-side">
        <div className="auth-card" aria-hidden="true">
          <div className="passbook">
            <span className="chip" />
            <p className="pb-number">•••• •••• ••••</p>
            <p className="pb-balance">₹ 0.00</p>
            <p className="pb-holder">Your name here</p>
          </div>
        </div>
        <div className="auth-copy">
          <h2>Your accounts, right where you left them.</h2>
          <p>Check balances, move money and pull a statement for any account.</p>
        </div>
      </aside>

      <section className="auth-main">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>Log in</h1>
          <p className="muted">Welcome back. Enter your details to continue.</p>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="asha@example.com"
            />
          </div>

          <Password
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <div className="row-between">
            <label className="check">
              <input type="checkbox" /> Keep me logged in
            </label>
            <a href="#forgot">Forgot password?</a>
          </div>

          <button className="btn">Log in</button>
          <p className="switch">
            New to Passbook? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </section>
    </div>
  );
}