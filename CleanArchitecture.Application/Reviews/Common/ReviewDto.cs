namespace CleanArchitecture.Application.Reviews.Common;

public record ReviewDto(
    int Id,
    int CarId,
    string UserId,
    string UserFullName,
    int Rating,
    string? Comment,
    DateTime CreatedAtUtc,
    DateTime? UpdatedAtUtc);
