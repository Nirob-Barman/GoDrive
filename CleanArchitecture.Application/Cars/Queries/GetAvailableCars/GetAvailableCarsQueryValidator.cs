using FluentValidation;

namespace CleanArchitecture.Application.Cars.Queries.GetAvailableCars;

public class GetAvailableCarsQueryValidator : AbstractValidator<GetAvailableCarsQuery>
{
    public GetAvailableCarsQueryValidator()
    {
        RuleFor(x => x.PickupDate).GreaterThanOrEqualTo(DateTime.UtcNow.Date)
            .WithMessage("Pickup date cannot be in the past.");

        RuleFor(x => x.DropoffDate).GreaterThan(x => x.PickupDate)
            .WithMessage("Drop-off date must be after the pickup date.");

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
