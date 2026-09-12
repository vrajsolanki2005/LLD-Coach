import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-logo">LLD Coach</span>
          <p>Practice low-level design. Build better software.</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <span className="footer-col-title">Practice</span>
            <Link to="/problems">All Problems</Link>
            <Link to="/attempts">My Attempts</Link>
          </div>

          <div className="footer-col">
            <span className="footer-col-title">Account</span>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>LLD Coach. Built for engineers who care about design.</span>
      </div>
    </footer>
  );
};

export default Footer;
