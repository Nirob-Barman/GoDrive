import { useAppSelector } from "../../redux/hooks";
import { selectCurrentUser } from "../../redux/features/auth/authSlice";

export default function Dashboard() {
  const user = useAppSelector(selectCurrentUser);

  return (
    <div>
      <h1>My Dashboard</h1>
      <p>Welcome, {user?.fullName}.</p>
      <p>Profile and booking history land here in a later phase.</p>
    </div>
  );
}
