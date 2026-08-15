export type TRevenuePeriod = "Daily" | "Weekly" | "Monthly" | "Yearly";

// Mirrors CleanArchitecture.Application.Dashboard.Common.DashboardStatisticsDto
export type TDashboardStatistics = {
  totalCars: number;
  availableCars: number;
  totalReservations: number;
  pendingReservations: number;
  completedReservations: number;
  totalRevenue: number;
};

// Mirrors CleanArchitecture.Application.Dashboard.Common.RevenueDataPointDto
export type TRevenueDataPoint = {
  periodStart: string;
  revenue: number;
};

// Mirrors CleanArchitecture.Application.Dashboard.Common.CarUtilizationDto
export type TCarUtilization = {
  carId: number;
  carName: string;
  confirmedBookings: number;
  bookedHours: number;
  utilizationRatePercent: number;
};

export type TRevenueFilters = {
  period: TRevenuePeriod;
  startDate?: string;
  endDate?: string;
};

export type TCarUtilizationFilters = {
  startDate?: string;
  endDate?: string;
};
