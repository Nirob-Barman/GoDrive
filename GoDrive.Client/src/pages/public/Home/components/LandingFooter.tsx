import { Link } from "react-router-dom";

type TLandingFooterProps = {
  isAuthenticated: boolean;
};

export default function LandingFooter({ isAuthenticated }: TLandingFooterProps) {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-grid">
        <div className="landing-footer-brand">
          <h3>GoDrive</h3>
          <p>A car rental reservation platform for finding, booking, and managing your next ride.</p>
        </div>
        <nav className="landing-footer-col" aria-label="Explore">
          <h4>Explore</h4>
          <ul>
            <li>
              <Link to="/cars">Cars</Link>
            </li>
            <li>
              <a href="#how-it-works">How It Works</a>
            </li>
          </ul>
        </nav>
        <nav className="landing-footer-col" aria-label="Account">
          <h4>Account</h4>
          <ul>
            {isAuthenticated ? (
              <>
                <li>
                  <Link to="/reservations">My Reservations</Link>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Log In</Link>
                </li>
                <li>
                  <Link to="/register">Sign Up</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
      <p className="landing-footer-bottom">&copy; 2026 GoDrive. All rights reserved.</p>
    </footer>
  );
}
