import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Account from "./pages/Account";
import CreateAccount from "./pages/CreateAccount";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      {/* Higlight Active Nav */}
      <div>
        <NavLink
          to="/"
          style={({ isActive }) => ({
            color: isActive ? "red" : "black",
            background: isActive ? "white" : "white",
          })}
        >
          Home
        </NavLink>
      </div>
      <div>
        <NavLink
          to="/about"
          style={({ isActive }) => ({
            color: isActive ? "red" : "black",
            background: isActive ? "white" : "white",
          })}
        >
          About
        </NavLink>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* Dynamic Route */}
        <Route path="/accounts/:id" element={<Account />} />
        <Route path="/create" element={<CreateAccount />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
