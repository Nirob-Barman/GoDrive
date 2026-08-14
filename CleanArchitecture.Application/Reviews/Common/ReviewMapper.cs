using CleanArchitecture.Domain.Entities;

namespace CleanArchitecture.Application.Reviews.Common;

public static class ReviewMapper
{
    public static ReviewDto ToDto(Review review, string userFullName) => new(
        review.Id,
        review.CarId,
        review.UserId,
        userFullName,
        review.Rating,
        review.Comment,
        review.CreatedAtUtc,
        review.UpdatedAtUtc);
}
