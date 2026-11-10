import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { getErrorMessage } from "../../utils/getErrorMessage";
import "../../styles/login.css";

type TLocationState = { from?: { pathname: string } };

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const result = await login({ email, password })
      .unwrap()
      .catch(() => null);
    if (!result) return;

    dispatch(setCredentials(result));
    const state = location.state as TLocationState | null;
    navigate(state?.from?.pathname ?? "/", { replace: true });
  };

  return (
    <main className="login-page">
      <section className="login-visual">
        <Link to="/" className="login-brand">
          <span className="login-brand-icon">G</span>
          <span>GoDrive</span>
        </Link>

        <div className="login-visual-content">
          <span className="login-eyebrow">DRIVE YOUR WAY</span>
          <h1>
            Your journey.
            <br />
            Your freedom.
          </h1>
          <p>
            Find the perfect ride and make every journey memorable. Your next
            adventure starts here.
          </p>
        </div>

        <div className="login-visual-footer">
          Premium rides. Seamless journeys.
        </div>
      </section>

      <section className="login-content">
        <div className="login-card">
          <div className="login-heading">
            <span className="login-welcome">WELCOME BACK</span>
            <h2>Sign in to GoDrive</h2>
            <p>Enter your details to access your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <div className="login-password-label">
              <label htmlFor="login-password">Password</label>
              <Link to="/forgot-password">Forgot password?</Link>
            </div>

            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            {error && <p className="form-error">{getErrorMessage(error)}</p>}

            <button
              type="submit"
              className="btn btn-primary login-submit"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Sign in"}
              {!isLoading && <span>→</span>}
            </button>
          </form>

          <p className="login-register">
            Don't have an account? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
