import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { getErrorMessage } from "../../utils/getErrorMessage";

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
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white">
      {/* Left visual section */}
      <section
        className="relative flex min-h-[300px] lg:min-h-screen flex-col justify-between overflow-hidden bg-cover bg-center px-7 py-8 sm:px-12 lg:px-16 lg:py-12 text-white"
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
        {/* Brand */}
        <Link
          to="/"
          className="relative z-10 flex w-fit items-center gap-3 text-2xl font-extrabold tracking-tight text-white"
        >
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#FF713D] text-xl text-white shadow-lg">
            G
          </span>
          GoDrive
        </Link>

        {/* Hero content */}
        <div className="relative z-10 my-12 max-w-xl lg:my-0">
          <span className="text-xs font-extrabold tracking-[0.25em] text-[#FF713D]">
            DRIVE YOUR WAY
          </span>

          <h1 className="mt-5 text-4xl leading-[1.12] font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Your journey.
            <br />
            Your freedom.
          </h1>

          <p className="mt-6 max-w-md text-base leading-8 text-gray-300 sm:text-lg">
            Find the perfect ride and make every journey memorable. Your next
            adventure starts here.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 hidden text-sm font-medium tracking-wide text-gray-400 lg:block">
          Premium rides. Seamless journeys.
        </div>
      </section>

      {/* Right login section */}
      <section className="flex min-h-[550px] items-center justify-center bg-white px-6 py-14 sm:px-12 lg:px-16">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-9">
            <span className="text-xs font-extrabold tracking-[0.2em] text-[#FF713D]">
              WELCOME BACK
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[#171A21] sm:text-4xl">
              Sign in to GoDrive
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Enter your details to access your account.
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="login-email"
                className="block text-sm font-semibold text-[#292D36]"
              >
                Email address
              </label>

              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-[#171A21] outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-[#FF713D] focus:ring-4 focus:ring-[#FF713D]/10"
              />
            </div>

            {/* Password label */}
            <div className="flex items-center justify-between pt-1">
              <label
                htmlFor="login-password"
                className="text-sm font-semibold text-[#292D36]"
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-[#F26532] transition hover:text-[#D94F20]"
              >
                Forgot password?
              </Link>
            </div>

            {/* Password input */}
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-[#171A21] outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-[#FF713D] focus:ring-4 focus:ring-[#FF713D]/10"
            />

            {/* Error message */}
            {error && (
              <p
                role="alert"
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
              >
                {getErrorMessage(error)}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group mt-3 flex min-h-[54px] w-full items-center justify-center gap-3 rounded-xl bg-[#FF713D] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-[#FF713D]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#E95B2B] hover:shadow-xl hover:shadow-[#FF713D]/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF713D] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isLoading ? "Logging in..." : "Sign in"}

              {!isLoading && (
                <span className="text-lg transition-transform group-hover:translate-x-1">
                  →
                </span>
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-9 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-[#F26532] transition hover:text-[#D94F20]"
            >
              Create an account
            </Link>
          </p>

          {/* Footer */}
          <div className="mt-12 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} GoDrive. All rights reserved.
          </div>
        </div>
      </section>
    </main>
  );
}
