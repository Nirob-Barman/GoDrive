import { Link } from "react-router-dom";

type TLandingFooterProps = {
  isAuthenticated: boolean;
};

export default function LandingFooter({
  isAuthenticated,
}: TLandingFooterProps) {
  return (
    <footer className="relative isolate overflow-hidden rounded-3xl bg-gray-950 px-6 pb-6 pt-12 text-white sm:px-10 sm:pt-16 lg:px-14">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-72 w-72 rounded-full bg-orange-500/5 blur-3xl" />

      {/* Main Footer */}
      <div className="relative z-10 grid grid-cols-1 gap-12 border-b border-white/10 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-2xl font-black text-white shadow-lg shadow-orange-500/20 transition duration-300 hover:rotate-3">
              G
            </span>

            <span className="text-2xl font-black tracking-tight text-white">
              Go<span className="text-orange-500">Drive</span>
            </span>
          </Link>

          <p className="mt-6 max-w-sm text-sm leading-8 text-gray-400">
            Your trusted car rental reservation platform. Discover vehicles,
            manage bookings, and make every journey more convenient with
            GoDrive.
          </p>

          {/* Brand Tag */}
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2.5 text-xs font-semibold text-orange-400">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            Your journey starts here.
          </div>
        </div>

        {/* Explore */}
        <nav aria-label="Explore">
          <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-white">
            Explore
          </h3>

          <ul className="flex flex-col gap-5">
            <li>
              <Link
                to="/"
                className="text-sm text-gray-400 transition-colors duration-200 hover:text-orange-400"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                to="/cars"
                className="text-sm text-gray-400 transition-colors duration-200 hover:text-orange-400"
              >
                Explore Cars
              </Link>
            </li>

            <li>
              <a
                href="#how-it-works"
                className="text-sm text-gray-400 transition-colors duration-200 hover:text-orange-400"
              >
                How It Works
              </a>
            </li>
          </ul>
        </nav>

        {/* Account */}
        <nav aria-label="Account">
          <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-white">
            Account
          </h3>

          <ul className="flex flex-col gap-5">
            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to="/reservations"
                    className="text-sm text-gray-400 transition-colors duration-200 hover:text-orange-400"
                  >
                    My Reservations
                  </Link>
                </li>

                <li>
                  <Link
                    to="/profile"
                    className="text-sm text-gray-400 transition-colors duration-200 hover:text-orange-400"
                  >
                    My Profile
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="text-sm text-gray-400 transition-colors duration-200 hover:text-orange-400"
                  >
                    Log In
                  </Link>
                </li>

                <li>
                  <Link
                    to="/register"
                    className="text-sm text-gray-400 transition-colors duration-200 hover:text-orange-400"
                  >
                    Create Account
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      {/* Bottom Bar */}
      <div className="relative z-10 flex flex-col items-center justify-between gap-5 pt-7 text-center sm:flex-row sm:text-left">
        <p className="text-xs leading-6 text-gray-500">
          © {new Date().getFullYear()} GoDrive. All rights reserved.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-5">
          <Link
            to="/cars"
            className="text-xs font-semibold text-gray-400 transition-colors duration-200 hover:text-orange-400"
          >
            Find Your Next Ride
          </Link>

          <span className="h-4 w-px bg-white/10" />

          <Link
            to="/"
            className="text-xs font-semibold text-gray-400 transition-colors duration-200 hover:text-orange-400"
          >
            Back to Home ↑
          </Link>
        </div>
      </div>
    </footer>
  );
}
