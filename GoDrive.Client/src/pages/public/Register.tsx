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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [register, { isLoading, error }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) return;

    try {
      const result = await register({
        fullName,
        email,
        password,
        confirmPassword,
        termsAccepted,
      }).unwrap();

      if (result) {
        navigate("/login", { replace: true });
      }
    } catch {
      // RTK Query exposes the error through mutation state.
    }
  };

  const inputClasses =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition duration-200 placeholder:text-gray-400 hover:border-gray-300 focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/10 disabled:opacity-60";

  const labelClasses = "mb-2 block text-sm font-bold text-gray-800";

  return (
    <main className="grid min-h-screen grid-cols-1 bg-white lg:grid-cols-2">
      {/* Left Hero Section */}
      <section className="relative isolate flex min-h-[300px] flex-col justify-between overflow-hidden bg-gray-950 px-7 py-8 text-white sm:px-12 lg:min-h-screen lg:px-16 lg:py-12">
        {/* Background Image */}
        <div
          className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1600&q=85")',
          }}
        />

        {/* Dark Overlay */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-gray-950/95 via-gray-950/80 to-gray-950/60" />

        {/* Orange Glow */}
        <div className="pointer-events-none absolute -right-24 top-1/4 -z-10 h-80 w-80 rounded-full bg-orange-500/20 blur-[100px]" />

        {/* Brand */}
        <Link to="/" className="relative z-10 flex w-fit items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-2xl font-black text-white shadow-lg shadow-orange-500/30">
            G
          </span>

          <span className="text-2xl font-black tracking-tight text-white">
            Go<span className="text-orange-500">Drive</span>
          </span>
        </Link>

        {/* Hero Content */}
        <div className="relative z-10 my-14 max-w-xl lg:my-0">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Start Your Journey
          </span>

          <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-7xl">
            Your Next
            <span className="mt-2 block text-orange-500">
              Adventure Awaits.
            </span>
          </h1>

          <p className="mt-7 max-w-md text-base leading-8 text-gray-300 sm:text-lg">
            Join GoDrive and discover a better way to travel. Find your perfect
            car and enjoy every mile along the way.
          </p>

          {/* Trust Indicators */}
          <div className="mt-10 flex flex-wrap gap-8 border-t border-white/10 pt-7">
            <div>
              <p className="text-lg font-bold text-white">Easy Booking</p>
              <p className="mt-1 text-xs text-gray-400">Simple reservations</p>
            </div>

            <div>
              <p className="text-lg font-bold text-white">Wide Selection</p>
              <p className="mt-1 text-xs text-gray-400">
                Cars for every journey
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 hidden text-xs font-medium tracking-wide text-gray-400 lg:block">
          Premium rides. Seamless journeys.
        </p>
      </section>

      {/* Right Registration Section */}
      <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-8">
            <span className="mb-4 inline-block text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              Create Account
            </span>

            <h2 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
              Join GoDrive
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500">
              Create your account and get ready for your next journey.
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="register-name" className={labelClasses}>
                Full Name
              </label>

              <input
                id="register-name"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                autoComplete="name"
                required
                disabled={isLoading}
                className={inputClasses}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="register-email" className={labelClasses}>
                Email Address
              </label>

              <input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
                disabled={isLoading}
                className={inputClasses}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="register-password" className={labelClasses}>
                Password
              </label>

              <div className="relative">
                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                  disabled={isLoading}
                  className={`${inputClasses} pr-16`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 transition hover:text-orange-500 focus-visible:outline-2 focus-visible:outline-orange-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="register-confirm-password"
                className={labelClasses}
              >
                Confirm Password
              </label>

              <div className="relative">
                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                  disabled={isLoading}
                  className={`${inputClasses} pr-16`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  aria-pressed={showConfirmPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 transition hover:text-orange-500 focus-visible:outline-2 focus-visible:outline-orange-500"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Password Mismatch */}
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs font-medium text-red-500" role="alert">
                Passwords do not match.
              </p>
            )}

            {/* Terms */}
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-gray-600">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(event) => setTermsAccepted(event.target.checked)}
                required
                disabled={isLoading}
                className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-orange-500"
              />

              <span>
                I accept the{" "}
                <span className="font-bold text-orange-600">
                  Terms &amp; Conditions
                </span>
              </span>
            </label>

            {/* API Error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3.5 text-sm text-red-600"
              >
                <span className="font-bold">!</span>
                <p>{getErrorMessage(error)}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={
                isLoading ||
                !termsAccepted ||
                !fullName.trim() ||
                !email.trim() ||
                !password ||
                !confirmPassword ||
                password !== confirmPassword
              }
              className="group mt-2 flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-orange-500 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <>
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <span className="text-lg transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-orange-600 transition hover:text-orange-700"
            >
              Sign In
            </Link>
          </p>

          {/* Footer */}
          <div className="mt-10 border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} GoDrive. All rights reserved.
          </div>
        </div>
      </section>
    </main>
  );
}
