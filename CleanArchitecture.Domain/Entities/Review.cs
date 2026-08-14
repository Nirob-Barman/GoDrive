namespace CleanArchitecture.Domain.Entities;

public class Review
{
    public int Id { get; private set; }
    public int CarId { get; private set; }
    public Car Car { get; private set; } = null!;
    public string UserId { get; private set; } = string.Empty;
    public int Rating { get; private set; }
    public string? Comment { get; private set; }
    public DateTime CreatedAtUtc { get; private set; }
    public DateTime? UpdatedAtUtc { get; private set; }

    private Review()
    {
    }

    public static Review Create(int carId, string userId, int rating, string? comment)
    {
        if (rating is < 1 or > 5)
        {
            throw new ArgumentException("Rating must be between 1 and 5.", nameof(rating));
        }

        return new Review
        {
            CarId = carId,
            UserId = userId,
            Rating = rating,
            Comment = comment,
            CreatedAtUtc = DateTime.UtcNow
        };
    }

    public void Update(int rating, string? comment)
    {
        if (rating is < 1 or > 5)
        {
            throw new ArgumentException("Rating must be between 1 and 5.", nameof(rating));
        }

        Rating = rating;
        Comment = comment;
        UpdatedAtUtc = DateTime.UtcNow;
    }
}
