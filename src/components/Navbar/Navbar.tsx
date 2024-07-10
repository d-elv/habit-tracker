import { useState } from "react";
import "./Navbar.css";
import { useAuth } from "../../contexts/authContext";
import { useNavigate, Link } from "react-router-dom";

export const Navbar = () => {
  const [error, setError] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setError("");
    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Failed to log out");
    }
  };
  return (
    <div className="nav-container">
      <ul className="nav-list">
        <li className="nav-list-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-list-item">
          <Link className="nav-link" to="/habits">
            View Habits
          </Link>
        </li>
        <li className="nav-list-item">
          <Link className="nav-link" to="/finished-habits">
            Finished Habits
          </Link>
        </li>
        <li className="nav-list-item">
          <button className="sign-out-button" onClick={handleLogout}>
            Sign Out
          </button>
        </li>
        {error && <h1 className="error-message">{error}</h1>}
      </ul>
    </div>
  );
};
