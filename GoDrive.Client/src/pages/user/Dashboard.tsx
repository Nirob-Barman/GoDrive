import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";
import PageHeader from "../../components/ui/PageHeader";

export default function Dashboard() {
  const user = useAppSelector(selectCurrentUser);

  return (
    <div>
      <PageHeader title="My Dashboard" subtitle={`Welcome, ${user?.fullName}.`} />

      <div className="page-header-actions">
        <Link to="/reservations" className="btn">
          My Reservations
        </Link>
        <Link to="/profile" className="btn">
          My Profile
        </Link>
        <Link to="/cars" className="btn btn-primary">
          Browse Cars
        </Link>
      </div>
    </div>
  );
}
