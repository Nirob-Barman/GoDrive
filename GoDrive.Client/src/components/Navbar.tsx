import { useState } from "react";
import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout, selectCurrentUser } from "../redux/features/auth/authSlice";
import { useLogoutMutation } from "../redux/features/auth/authApi";

function NavItem({
  to,
  children,
  onClick,
}: {
  to: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex items-center py-2 text-sm font-semibold transition-colors duration-200 ${
          isActive
            ? "text-orange-500 after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-orange-500"
            : "text-gray-500 hover:text-orange-500"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [logoutRequest] = useLogoutMutation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutRequest().unwrap();
    } catch {
      // Clear local authentication even if the API request fails.
    } finally {
      dispatch(logout());
      closeMenu();
      setIsLoggingOut(false);
      navigate("/", { replace: true });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
      <nav className="mx-auto flex min-h-[76px] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        {/* Brand */}
        <NavLink
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-3"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-2xl font-black text-white shadow-lg shadow-orange-500/20">
            G
          </span>

          <span className="text-2xl font-black tracking-tight text-gray-950">
            Go<span className="text-orange-500">Drive</span>
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          <NavItem to="/cars">Explore Cars</NavItem>

          {user && (
            <>
              {user.role === "Admin" && <NavItem to="/admin">Admin</NavItem>}

              <NavItem to="/reservations">My Reservations</NavItem>

              <NavItem to="/profile">My Profile</NavItem>
            </>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="hidden shrink-0 items-center gap-5 lg:flex">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 font-bold text-orange-500">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>

                <span className="max-w-[130px] truncate text-sm font-bold text-gray-700">
                  {user.fullName}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 transition hover:border-orange-500 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoggingOut ? "Logging out..." : "Log out"}
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-sm font-bold text-gray-600 transition hover:text-orange-500"
              >
                Log in
              </NavLink>

              <NavLink
                to="/register"
                className="inline-flex min-h-11 items-center justify-center gap-3 rounded-xl bg-orange-500 px-5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 hover:bg-orange-600"
              >
                Get Started
                <span aria-hidden="true">→</span>
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-xl border border-gray-200 bg-white transition hover:border-orange-300 lg:hidden"
        >
          <span
            className={`h-0.5 w-5 rounded-full bg-gray-800 transition-all duration-200 ${
              menuOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 rounded-full bg-gray-800 transition-all duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 rounded-full bg-gray-800 transition-all duration-200 ${
              menuOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-gray-100 bg-white transition-all duration-300 lg:hidden ${
          menuOpen
            ? "visible max-h-[550px] opacity-100"
            : "invisible max-h-0 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] flex-col gap-1 px-5 py-5 sm:px-8">
          <NavItem to="/" onClick={closeMenu}>
            Home
          </NavItem>

          <NavItem to="/cars" onClick={closeMenu}>
            Explore Cars
          </NavItem>

          {user ? (
            <>
              {user.role === "Admin" && (
                <NavItem to="/admin" onClick={closeMenu}>
                  Admin Dashboard
                </NavItem>
              )}

              <NavItem to="/reservations" onClick={closeMenu}>
                My Reservations
              </NavItem>

              <NavItem to="/profile" onClick={closeMenu}>
                My Profile
              </NavItem>

              <div className="my-3 flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-500">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-gray-900">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full rounded-xl border border-red-100 bg-red-50 px-5 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
              >
                {isLoggingOut ? "Logging out..." : "Log out"}
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 border-t border-gray-100 pt-4">
              <NavLink
                to="/login"
                onClick={closeMenu}
                className="rounded-xl border border-gray-200 px-5 py-3 text-center text-sm font-bold text-gray-700 transition hover:border-orange-500 hover:text-orange-500"
              >
                Log in
              </NavLink>

              <NavLink
                to="/register"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                Create Account
                <span aria-hidden="true">→</span>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
