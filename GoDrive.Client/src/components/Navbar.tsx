import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout, selectCurrentUser } from "../redux/features/auth/authSlice";
import { useLogoutMutation } from "../redux/features/auth/authApi";

function NavItem({ to, children }: { to: string; children: ReactNode }) {
  return (
    <NavLink to={to} className={({ isActive }) => (isActive ? "active" : undefined)}>
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutRequest] = useLogoutMutation();

  const handleLogout = async () => {
    await logoutRequest().catch(() => undefined);
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand" end>
        GoDrive
      </NavLink>

      <div className="navbar-links">
        <NavItem to="/cars">Cars</NavItem>
        {user ? (
          <>
            {user.role === "Admin" && <NavItem to="/admin">Admin</NavItem>}
            <NavItem to="/reservations">My Reservations</NavItem>
            <NavItem to="/profile">{user.fullName}</NavItem>
            <button type="button" className="btn btn-sm" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <NavItem to="/login">Log in</NavItem>
            <NavLink to="/register" className="btn btn-primary btn-sm">
              Sign up
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
