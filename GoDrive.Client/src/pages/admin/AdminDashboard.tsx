import { useState } from "react";
import {
  useGetCarUtilizationQuery,
  useGetDashboardStatisticsQuery,
  useGetRevenueByPeriodQuery,
} from "../../redux/features/dashboard/dashboardApi";
import type { TRevenuePeriod } from "../../types/dashboard";

const PERIODS: TRevenuePeriod[] = ["Daily", "Weekly", "Monthly", "Yearly"];

export default function AdminDashboard() {
  const [period, setPeriod] = useState<TRevenuePeriod>("Monthly");

  const { data: stats, isLoading: isLoadingStats, error: statsError } = useGetDashboardStatisticsQuery();
  const {
    data: revenue,
    isLoading: isLoadingRevenue,
    error: revenueError,
  } = useGetRevenueByPeriodQuery({ period });
  const {
    data: utilization,
    isLoading: isLoadingUtilization,
    error: utilizationError,
  } = useGetCarUtilizationQuery({});

  return (
    <div>
      <h1>Dashboard</h1>

      {isLoadingStats && <p>Loading statistics...</p>}
      {statsError && <p className="form-error">Could not load statistics.</p>}
      {stats && (
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-value">{stats.totalCars}</span>
            <span className="stat-label">Total Cars</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.availableCars}</span>
            <span className="stat-label">Available Cars</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.totalReservations}</span>
            <span className="stat-label">Total Reservations</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.pendingReservations}</span>
            <span className="stat-label">Pending Reservations</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{stats.completedReservations}</span>
            <span className="stat-label">Completed Reservations</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">${stats.totalRevenue.toFixed(2)}</span>
            <span className="stat-label">Total Revenue</span>
          </div>
        </div>
      )}

      <h2>Revenue</h2>
      <select value={period} onChange={(e) => setPeriod(e.target.value as TRevenuePeriod)}>
        {PERIODS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {isLoadingRevenue && <p>Loading revenue...</p>}
      {revenueError && <p className="form-error">Could not load revenue.</p>}
      {revenue && revenue.length === 0 && <p>No revenue in this period.</p>}
      {revenue && revenue.length > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {revenue.map((point) => (
                <tr key={point.periodStart}>
                  <td>{new Date(point.periodStart).toLocaleDateString()}</td>
                  <td>${point.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2>Car Utilization (last 30 days)</h2>
      {isLoadingUtilization && <p>Loading utilization...</p>}
      {utilizationError && <p className="form-error">Could not load car utilization.</p>}
      {utilization && utilization.length === 0 && <p>No data yet.</p>}
      {utilization && utilization.length > 0 && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Car</th>
                <th>Bookings</th>
                <th>Booked Hours</th>
                <th>Utilization</th>
              </tr>
            </thead>
            <tbody>
              {utilization.map((row) => (
                <tr key={row.carId}>
                  <td>{row.carName}</td>
                  <td>{row.confirmedBookings}</td>
                  <td>{row.bookedHours}</td>
                  <td>{row.utilizationRatePercent.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
