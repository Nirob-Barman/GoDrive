import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../redux/features/auth/authApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [token, setToken] = useState(searchParams.get("token") ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const result = await resetPassword({
      email,
      token,
      newPassword,
      confirmNewPassword,
    })
      .unwrap()
      .catch(() => null);

    if (result) {
      navigate("/login", { replace: true });
    }
  };

  const inputClasses =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10";

  const labelClasses = "mb-2 block text-sm font-semibold text-gray-700";

  return (
    <main className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
      {/* Left Visual Section */}
      <section
        className="flex min-h-[300px] flex-col justify-between bg-cover bg-center px-7 py-8 text-white sm:px-12 lg:min-h-screen lg:px-[9%] lg:py-12"
        style={{
          backgroundImage: `
            linear-gradient(
              135deg,
              rgba(15, 18, 25, 0.96),
              rgba(15, 18, 25, 0.72)
            ),
            url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=85")
          `,
        }}
      >
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-3 text-2xl font-extrabold text-white no-underline"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-orange-500 text-xl text-white">
            G
          </span>
          GoDrive
        </Link>

        <div className="my-12 max-w-[490px] lg:my-0">
          <span className="text-xs font-extrabold tracking-[2px] text-orange-500">
            SECURE YOUR ACCOUNT
          </span>

          <h1 className="mt-5 text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            A new password.
            <br />A fresh journey.
          </h1>

          <p className="mt-5 max-w-[390px] text-base leading-8 text-gray-300">
            Almost there! Set a new password and get back to enjoying seamless
            journeys with GoDrive.
          </p>
        </div>

        <p className="hidden text-sm text-gray-400 sm:block">
          Premium rides. Seamless journeys.
        </p>
      </section>

      {/* Right Reset Password Section */}
      <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-[8%]">
        <div className="w-full max-w-[430px]">
          {/* Lock Icon */}
          <div className="mb-7 grid h-14 w-14 place-items-center rounded-2xl bg-orange-50 text-orange-500">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7"
              aria-hidden="true"
            >
              <rect
                x="4"
                y="10"
                width="16"
                height="11"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="M8 10V7a4 4 0 1 1 8 0v3"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
              <path
                d="M12 14v3"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <span className="text-xs font-extrabold tracking-[2px] text-orange-500">
              PASSWORD RESET
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
              Create a new password
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              Enter your reset code and choose a strong new password for your
              GoDrive account.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="reset-email" className={labelClasses}>
                Email address
              </label>

              <input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                className={inputClasses}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label htmlFor="reset-token" className={labelClasses}>
                Reset code
              </label>

              <input
                id="reset-token"
                type="text"
                placeholder="Enter your reset code"
                className={inputClasses}
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="new-password" className={labelClasses}>
                New password
              </label>

              <input
                id="new-password"
                type="password"
                placeholder="Enter your new password"
                className={inputClasses}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label htmlFor="confirm-new-password" className={labelClasses}>
                Confirm new password
              </label>

              <input
                id="confirm-new-password"
                type="password"
                placeholder="Confirm your new password"
                className={inputClasses}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <p
                className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
                role="alert"
              >
                {getErrorMessage(error)}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex min-h-[52px] w-full items-center justify-center gap-3 rounded-xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Resetting..." : "Reset password"}
              {!isLoading && <span>→</span>}
            </button>
          </form>

          {/* Back to Login */}
          <Link
            to="/login"
            className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-orange-600"
          >
            <span aria-hidden="true">←</span>
            Back to log in
          </Link>
        </div>
      </section>
    </main>
  );
}
