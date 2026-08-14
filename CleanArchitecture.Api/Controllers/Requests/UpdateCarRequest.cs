using CleanArchitecture.Domain.Enums;

namespace CleanArchitecture.Api.Controllers.Requests;

public class UpdateCarRequest
{
    public string Name { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int Year { get; set; }
    public string? Description { get; set; }
    public CarType CarType { get; set; }
    public FuelType FuelType { get; set; }
    public TransmissionType Transmission { get; set; }
    public int Seats { get; set; }
    public decimal PricePerHour { get; set; }
    public string Location { get; set; } = string.Empty;
    public CarStatus Status { get; set; }
}
