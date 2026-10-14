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

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e) => e.preventDefault();

  return (
    <div className="auth">
      <aside className="auth-side">
        <div className="auth-card" aria-hidden="true">
          <div className="passbook">
            <span className="chip" />
            <p className="pb-number">•••• •••• ••••</p>
            <p className="pb-balance">₹ 0.00</p>
            <p className="pb-holder">{name.trim() || "Your name here"}</p>
          </div>
        </div>
        <div className="auth-copy">
          <h2>Start with a name. Open an account next.</h2>
          <p>Sign up takes a minute. Your first account can be opened right after.</p>
        </div>
      </aside>

      <section className="auth-main">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>Create your login</h1>
          <p className="muted">Your name appears on your passbook card.</p>

          <div className="two">
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder="Asha Sharma"
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Mobile number</label>
              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                autoComplete="tel-national"
                placeholder="9876543210"
              />
            </div>
          </div>

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

          <div className="two">
            <Password
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="8+ characters"
            />
            <Password
              id="confirm"
              label="Confirm password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <label className="check">
            <input type="checkbox" /> I agree to the terms and privacy policy.
          </label>

          <button className="btn">Sign up</button>
          <p className="switch">
            Already have a login? <Link to="/login">Log in</Link>
          </p>
        </form>
      </section>
    </div>
  );
}