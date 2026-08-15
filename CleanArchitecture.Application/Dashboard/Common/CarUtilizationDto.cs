namespace CleanArchitecture.Application.Dashboard.Common;

public record CarUtilizationDto(
    int CarId,
    string CarName,
    int ConfirmedBookings,
    int BookedHours,
    decimal UtilizationRatePercent);
