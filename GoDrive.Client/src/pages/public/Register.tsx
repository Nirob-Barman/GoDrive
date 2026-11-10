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
            START YOUR JOURNEY
          </span>

          <h1 className="mt-5 text-4xl leading-tight font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Your next
            <br />
            adventure awaits.
          </h1>

          <p className="mt-5 max-w-[390px] text-base leading-8 text-gray-300">
            Join GoDrive and discover a better way to travel. Find your perfect
            car and enjoy every mile along the way.
          </p>
        </div>

        <p className="hidden text-sm text-gray-400 sm:block">
          Premium rides. Seamless journeys.
        </p>
      </section>

      {/* Right Registration Section */}
      <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-[8%]">
        <div className="w-full max-w-[430px]">
          {/* Heading */}
          <div className="mb-8">
            <span className="text-xs font-extrabold tracking-[2px] text-orange-500">
              CREATE ACCOUNT
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
              Join GoDrive
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Create your account to get started.
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label htmlFor="register-name" className={labelClasses}>
                Full name
              </label>

              <input
                id="register-name"
                type="text"
                placeholder="Enter your full name"
                className={inputClasses}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>

            <div>
              <label htmlFor="register-email" className={labelClasses}>
                Email address
              </label>

              <input
                id="register-email"
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
              <label htmlFor="register-password" className={labelClasses}>
                Password
              </label>

              <input
                id="register-password"
                type="password"
                placeholder="Create a password"
                className={inputClasses}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label
                htmlFor="register-confirm-password"
                className={labelClasses}
              >
                Confirm password
              </label>

              <input
                id="register-confirm-password"
                type="password"
                placeholder="Confirm your password"
                className={inputClasses}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            {/* Terms */}
            <label className="flex cursor-pointer items-center gap-3 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
                className="h-4 w-4 cursor-pointer accent-orange-500"
              />
              <span>
                I accept the{" "}
                <span className="font-semibold text-orange-600">
                  Terms &amp; Conditions
                </span>
              </span>
            </label>

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
              {isLoading ? "Creating account..." : "Create account"}

              {!isLoading && <span>→</span>}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-orange-600 transition hover:text-orange-700"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
