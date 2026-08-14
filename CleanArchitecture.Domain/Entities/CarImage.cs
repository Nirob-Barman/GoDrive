namespace CleanArchitecture.Domain.Entities;

public class CarImage
{
    public int Id { get; private set; }
    public int CarId { get; private set; }
    public Car Car { get; private set; } = null!;
    public string Url { get; private set; } = string.Empty;
    public string PublicId { get; private set; } = string.Empty;
    public bool IsPrimary { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }

    private CarImage()
    {
    }

    // Only Car (the aggregate root) may create or promote a CarImage - hence internal, not public.
    internal static CarImage Create(int carId, string url, string publicId, bool isPrimary)
    {
        return new CarImage
        {
            CarId = carId,
            Url = url,
            PublicId = publicId,
            IsPrimary = isPrimary,
            CreatedAtUtc = DateTime.UtcNow
        };
    }

    internal void MarkPrimary()
    {
        IsPrimary = true;
    }
}
