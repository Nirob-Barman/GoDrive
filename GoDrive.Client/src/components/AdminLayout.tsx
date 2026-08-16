import { NavLink, Outlet } from "react-router-dom";

const ADMIN_NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard" },
  { to: "/admin/reservations", label: "Reservations" },
  { to: "/admin/cars", label: "Cars" },
  { to: "/admin/users", label: "Users" },
];

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <p className="admin-sidebar-label">Admin</p>
        <nav>
          {ADMIN_NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "active" : undefined)}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
