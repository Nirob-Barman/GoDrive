import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../../redux/features/auth/authApi";
import { getErrorMessage } from "../../utils/getErrorMessage";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const [forgotPassword, { isLoading, error, data: message }] =
    useForgotPasswordMutation();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    forgotPassword({ email });
  };

  const inputClasses =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10";

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
            ACCOUNT RECOVERY
          </span>

          <h1 className="mt-5 text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            A fresh start.
            <br />
            Just one step away.
          </h1>

          <p className="mt-5 max-w-[390px] text-base leading-8 text-gray-300">
            Getting back on the road should be simple. Recover your account and
            continue your journey with GoDrive.
          </p>
        </div>

        <p className="hidden text-sm text-gray-400 sm:block">
          Premium rides. Seamless journeys.
        </p>
      </section>

      {/* Right Recovery Section */}
      <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-[8%]">
        <div className="w-full max-w-[430px]">
          {/* Email Icon */}
          <div className="mb-7 grid h-14 w-14 place-items-center rounded-2xl bg-orange-50 text-orange-500">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-7 w-7"
              aria-hidden="true"
            >
              <path
                d="M3 6.75A2.75 2.75 0 0 1 5.75 4h12.5A2.75 2.75 0 0 1 21 6.75v10.5A2.75 2.75 0 0 1 18.25 20H5.75A2.75 2.75 0 0 1 3 17.25V6.75Z"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="m4 6 8 6.5L20 6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <span className="text-xs font-extrabold tracking-[2px] text-orange-500">
              PASSWORD RECOVERY
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
              Forgot your password?
            </h2>

            <p className="mt-3 text-sm leading-7 text-gray-500">
              No worries! Enter the email address associated with your account
              and we'll send you a reset link.
            </p>
          </div>

          {/* Success Message */}
          {message ? (
            <div
              className="flex items-start gap-4 rounded-xl border border-green-200 bg-green-50 p-5"
              role="status"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-green-100 font-bold text-green-600">
                ✓
              </div>

              <div>
                <h3 className="font-bold text-green-800">Check your inbox</h3>

                <p className="mt-1 text-sm leading-6 text-green-700">
                  {message}
                </p>
              </div>
            </div>
          ) : (
            /* Recovery Form */
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <label
                htmlFor="forgot-email"
                className="text-sm font-semibold text-gray-700"
              >
                Email address
              </label>

              <input
                id="forgot-email"
                type="email"
                placeholder="you@example.com"
                className={inputClasses}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />

              {error && (
                <p
                  className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
                  role="alert"
                >
                  {getErrorMessage(error)}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-3 flex min-h-[52px] w-full items-center justify-center gap-3 rounded-xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Sending..." : "Send reset link"}

                {!isLoading && <span>→</span>}
              </button>
            </form>
          )}

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
