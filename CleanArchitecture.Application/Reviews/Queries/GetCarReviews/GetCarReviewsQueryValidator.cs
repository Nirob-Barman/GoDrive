using FluentValidation;

namespace CleanArchitecture.Application.Reviews.Queries.GetCarReviews;

public class GetCarReviewsQueryValidator : AbstractValidator<GetCarReviewsQuery>
{
    public GetCarReviewsQueryValidator()
    {
        RuleFor(x => x.CarId).GreaterThan(0);
        RuleFor(x => x.PageNumber).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 50);
    }
}
