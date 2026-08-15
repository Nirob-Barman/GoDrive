using FluentValidation;

namespace CleanArchitecture.Application.Cars.Queries.GetAllCars;

public class GetAllCarsQueryValidator : AbstractValidator<GetAllCarsQuery>
{
    public GetAllCarsQueryValidator()
    {
        RuleFor(x => x.PageNumber).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 50);
        RuleFor(x => x.MinPrice).GreaterThanOrEqualTo(0).When(x => x.MinPrice is not null);
        RuleFor(x => x.MaxPrice).GreaterThanOrEqualTo(0).When(x => x.MaxPrice is not null);
        RuleFor(x => x.MaxPrice)
            .GreaterThanOrEqualTo(x => x.MinPrice!.Value)
            .When(x => x.MinPrice is not null && x.MaxPrice is not null)
            .WithMessage("MaxPrice must be greater than or equal to MinPrice.");
    }
}
