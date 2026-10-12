import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="empty">
      <h1>Page not found</h1>
      <p>
        That account or page doesn't exist. Check the link or head back to your
        accounts.
      </p>
      <Link to="/" className="btn">
        Go to accounts
      </Link>
    </div>
  );
}
