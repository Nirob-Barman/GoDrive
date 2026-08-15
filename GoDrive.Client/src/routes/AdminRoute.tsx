import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/features/auth/authSlice";

// UX convenience only - the backend enforces every real authorization rule.
export default function AdminRoute() {
  const user = useAppSelector(selectCurrentUser);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
