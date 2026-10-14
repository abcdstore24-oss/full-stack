import { Routes, Route, NavLink } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard.jsx";
import NewAccount from "./pages/NewAccount.jsx";
import AccountDetail from "./pages/AccountDetail.jsx";
import Transfer from "./pages/Transfer.jsx";
import Statement from "./pages/Statement.jsx";
import NotFound from "./pages/NotFound.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

export default function App() {
  return (
    <>
      <header className="topbar">
        <NavLink to="/" className="brand">
          Passbook
        </NavLink>
        <nav>
          <NavLink to="/" end>
            Accounts
          </NavLink>
          <NavLink to="/transfer">Transfer</NavLink>
          <NavLink to="/accounts/new" className="pill">
            Open account
          </NavLink>
        </nav>
      </header>
      <main className="page">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts/new"
            element={
              <ProtectedRoute>
                <NewAccount />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts/:accountNumber"
            element={
              <ProtectedRoute>
                <AccountDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts/:accountNumber/statement"
            element={
              <ProtectedRoute>
                <Statement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transfer"
            element={
              <ProtectedRoute>
                <Transfer />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
