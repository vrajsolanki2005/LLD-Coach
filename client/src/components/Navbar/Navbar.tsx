import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/problems" className="logo">
        LLD Coach
      </Link>

      <div className="nav-links">
        <Link to="/problems">Problems</Link>

        {user ? (
          <>
            <span className="user-name">Hi, {user.name}</span>

            <button className="logout-button" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>

            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
