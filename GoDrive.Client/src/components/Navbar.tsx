import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout, selectCurrentRefreshToken, selectCurrentUser } from "../redux/features/auth/authSlice";
import { useLogoutMutation } from "../redux/features/auth/authApi";

export default function Navbar() {
  const user = useAppSelector(selectCurrentUser);
  const refreshToken = useAppSelector(selectCurrentRefreshToken);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logoutRequest] = useLogoutMutation();

  const handleLogout = async () => {
    if (refreshToken) {
      await logoutRequest({ refreshToken }).catch(() => undefined);
    }
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        GoDrive
      </Link>

      <div className="navbar-links">
        {user ? (
          <>
            {user.role === "Admin" && <Link to="/admin">Admin</Link>}
            <Link to="/dashboard">{user.fullName}</Link>
            <button type="button" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/register">Sign up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
