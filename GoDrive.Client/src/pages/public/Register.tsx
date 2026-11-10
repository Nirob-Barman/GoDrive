import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../redux/features/auth/authApi";
import { getErrorMessage } from "../../utils/getErrorMessage";
import "../../styles/register.css";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const result = await register({
      fullName,
      email,
      password,
      confirmPassword,
      termsAccepted,
    })
      .unwrap()
      .catch(() => null);

    if (!result) return;

    navigate("/login", { replace: true });
  };

  return (
    <main className="register-page">
      <section className="register-visual">
        <Link to="/" className="register-brand">
          <span className="register-brand-icon">G</span>
          <span>GoDrive</span>
        </Link>

        <div className="register-visual-content">
          <span className="register-eyebrow">START YOUR JOURNEY</span>

          <h1>
            Your next
            <br />
            adventure awaits.
          </h1>

          <p>
            Join GoDrive and discover a better way to travel. Find your perfect
            car and enjoy every mile along the way.
          </p>
        </div>

        <div className="register-visual-footer">
          Premium rides. Seamless journeys.
        </div>
      </section>

      <section className="register-content">
        <div className="register-card">
          <div className="register-heading">
            <span className="register-welcome">CREATE ACCOUNT</span>
            <h2>Join GoDrive</h2>
            <p>Create your account to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            <div className="register-field">
              <label htmlFor="register-name">Full name</label>
              <input
                id="register-name"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-email">Email address</label>
              <input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-password">Password</label>
              <input
                id="register-password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div className="register-field">
              <label htmlFor="register-confirm-password">
                Confirm password
              </label>
              <input
                id="register-confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <label className="register-terms">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
              />
              <span>I accept the Terms &amp; Conditions</span>
            </label>

            {error && (
              <p className="register-error" role="alert">
                {getErrorMessage(error)}
              </p>
            )}

            <button
              type="submit"
              className="btn btn-primary register-submit"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
              {!isLoading && <span>→</span>}
            </button>
          </form>

          <p className="register-login">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
