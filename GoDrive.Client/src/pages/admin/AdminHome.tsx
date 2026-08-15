import { Link } from "react-router-dom";

export default function AdminHome() {
  return (
    <div>
      <h1>Admin</h1>
      <ul>
        <li>
          <Link to="/admin/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/admin/reservations">Manage Reservations</Link>
        </li>
        <li>
          <Link to="/admin/cars">Manage Cars</Link>
        </li>
        <li>
          <Link to="/admin/users">Manage Users</Link>
        </li>
      </ul>
    </div>
  );
}
