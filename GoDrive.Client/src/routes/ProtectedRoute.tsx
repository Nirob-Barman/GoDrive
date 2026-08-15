import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { selectCurrentToken } from "../redux/features/auth/authSlice";

// UX convenience only - the backend enforces every real authorization rule.
export default function ProtectedRoute() {
  const token = useAppSelector(selectCurrentToken);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
