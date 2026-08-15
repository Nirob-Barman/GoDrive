import { Link } from "react-router-dom";

export default function AdminHome() {
  return (
    <div>
      <h1>Admin</h1>
      <ul>
        <li>
          <Link to="/admin/reservations">Manage Reservations</Link>
        </li>
      </ul>
      <p>Car, user, and dashboard management land here in a later phase.</p>
    </div>
  );
}
