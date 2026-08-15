import { Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";

export default function Dashboard() {
  const user = useAppSelector(selectCurrentUser);

  return (
    <div>
      <h1>My Dashboard</h1>
      <p>Welcome, {user?.fullName}.</p>
      <ul>
        <li>
          <Link to="/reservations">My Reservations</Link>
        </li>
        <li>
          <Link to="/profile">My Profile</Link>
        </li>
        <li>
          <Link to="/cars">Browse Cars</Link>
        </li>
      </ul>
    </div>
  );
}
