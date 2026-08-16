import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../../redux/features/auth/authApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [forgotPassword, { isLoading, error, data: message }] = useForgotPasswordMutation();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    forgotPassword({ email });
  };

  return (
    <div className="auth-form">
      <h1>Forgot Password</h1>

      {message ? (
        <p className="form-success">{message}</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>

          {error && <p className="form-error">{getErrorMessage(error)}</p>}

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      )}

      <p className="text-sm text-muted">
        <Link to="/login">Back to log in</Link>
      </p>
    </div>
  );
}
