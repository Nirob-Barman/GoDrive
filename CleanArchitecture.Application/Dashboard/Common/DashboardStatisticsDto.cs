namespace CleanArchitecture.Application.Dashboard.Common;

public record DashboardStatisticsDto(
    int TotalCars,
    int AvailableCars,
    int TotalReservations,
    int PendingReservations,
    int CompletedReservations,
    decimal TotalRevenue);
