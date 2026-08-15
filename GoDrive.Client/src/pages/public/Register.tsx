import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../redux/features/auth/authApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

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

    const result = await register({ fullName, email, password, confirmPassword, termsAccepted })
      .unwrap()
      .catch(() => null);
    if (!result) {
      return;
    }

    navigate("/login", { replace: true });
  };

  return (
    <div className="auth-form">
      <h1>Sign up</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Full name
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Confirm password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            required
          />
          I accept the Terms &amp; Conditions
        </label>

        {error && <p className="form-error">{getErrorMessage(error)}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign up"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
