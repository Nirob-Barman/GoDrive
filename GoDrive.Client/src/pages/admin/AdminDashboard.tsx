import { useState } from "react";
import {
  useGetCarUtilizationQuery,
  useGetDashboardStatisticsQuery,
  useGetRevenueByPeriodQuery,
} from "../../redux/features/dashboard/dashboardApi";
import PageHeader from "../../components/ui/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import Skeleton, { SkeletonRows } from "../../components/ui/Skeleton";
import type { TRevenuePeriod } from "../../types/dashboard";

const PERIODS: TRevenuePeriod[] = ["Daily", "Weekly", "Monthly", "Yearly"];

function utilizationLevel(percent: number): "high" | "medium" | "low" {
  if (percent >= 60) return "high";
  if (percent >= 25) return "medium";
  return "low";
}

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
      <PageHeader title="Dashboard" subtitle="Fleet, bookings, and revenue at a glance." />

      {isLoadingStats && (
        <div className="stat-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={88} />
          ))}
        </div>
      )}
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

      <div className="form-section">
        <h2>Revenue</h2>
        <select value={period} onChange={(e) => setPeriod(e.target.value as TRevenuePeriod)}>
          {PERIODS.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        {isLoadingRevenue && <SkeletonRows count={3} />}
        {revenueError && <p className="form-error">Could not load revenue.</p>}
        {revenue && revenue.length === 0 && <EmptyState title="No revenue in this period" />}
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
      </div>

      <div className="form-section">
        <h2>Car Utilization (last 30 days)</h2>
        {isLoadingUtilization && <SkeletonRows count={3} />}
        {utilizationError && <p className="form-error">Could not load car utilization.</p>}
        {utilization && utilization.length === 0 && <EmptyState title="No utilization data yet" />}
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
                {utilization.map((row) => {
                  const level = utilizationLevel(row.utilizationRatePercent);
                  return (
                    <tr key={row.carId}>
                      <td>{row.carName}</td>
                      <td>{row.confirmedBookings}</td>
                      <td>{row.bookedHours}</td>
                      <td>
                        <div className="utilization-bar-wrap">
                          <div className="utilization-bar-track">
                            <div
                              className={`utilization-bar-fill utilization-bar-fill-${level}`}
                              style={{ width: `${Math.min(100, row.utilizationRatePercent)}%` }}
                            />
                          </div>
                          <span className="utilization-bar-label">{row.utilizationRatePercent.toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
