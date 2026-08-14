using CleanArchitecture.Domain.Enums;

namespace CleanArchitecture.Domain.Entities;

public class Car
{
    private readonly List<CarImage> _images = new();

    public int Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Brand { get; private set; } = string.Empty;
    public string Model { get; private set; } = string.Empty;
    public int Year { get; private set; }
    public string? Description { get; private set; }
    public CarType CarType { get; private set; }
    public FuelType FuelType { get; private set; }
    public TransmissionType Transmission { get; private set; }
    public int Seats { get; private set; }
    public decimal PricePerHour { get; private set; }
    public string Location { get; private set; } = string.Empty;
    public CarStatus Status { get; private set; } = CarStatus.Active;
    public DateTime CreatedAtUtc { get; private set; }
    public DateTime? UpdatedAtUtc { get; private set; }

    public IReadOnlyCollection<CarImage> Images => _images;

    private Car()
    {
    }

    public static Car Create(
        string name,
        string brand,
        string model,
        int year,
        string? description,
        CarType carType,
        FuelType fuelType,
        TransmissionType transmission,
        int seats,
        decimal pricePerHour,
        string location)
    {
        return new Car
        {
            Name = name,
            Brand = brand,
            Model = model,
            Year = year,
            Description = description,
            CarType = carType,
            FuelType = fuelType,
            Transmission = transmission,
            Seats = seats,
            PricePerHour = pricePerHour,
            Location = location,
            Status = CarStatus.Active,
            CreatedAtUtc = DateTime.UtcNow
        };
    }

    public void UpdateDetails(
        string name,
        string brand,
        string model,
        int year,
        string? description,
        CarType carType,
        FuelType fuelType,
        TransmissionType transmission,
        int seats,
        decimal pricePerHour,
        string location,
        CarStatus status)
    {
        Name = name;
        Brand = brand;
        Model = model;
        Year = year;
        Description = description;
        CarType = carType;
        FuelType = fuelType;
        Transmission = transmission;
        Seats = seats;
        PricePerHour = pricePerHour;
        Location = location;
        Status = status;
        UpdatedAtUtc = DateTime.UtcNow;
    }

    public CarImage AddImage(string url, string publicId)
    {
        var isPrimary = _images.Count == 0;
        var image = CarImage.Create(Id, url, publicId, isPrimary);
        _images.Add(image);
        return image;
    }

    public void RemoveImage(int imageId)
    {
        var image = _images.FirstOrDefault(i => i.Id == imageId);
        if (image is null)
        {
            return;
        }

        var wasPrimary = image.IsPrimary;
        _images.Remove(image);

        if (wasPrimary)
        {
            _images.FirstOrDefault()?.MarkPrimary();
        }
    }
}
