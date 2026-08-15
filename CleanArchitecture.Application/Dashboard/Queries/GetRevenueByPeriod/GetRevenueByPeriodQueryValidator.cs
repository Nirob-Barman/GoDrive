using FluentValidation;

namespace CleanArchitecture.Application.Dashboard.Queries.GetRevenueByPeriod;

public class GetRevenueByPeriodQueryValidator : AbstractValidator<GetRevenueByPeriodQuery>
{
    public GetRevenueByPeriodQueryValidator()
    {
        RuleFor(x => x.Period).IsInEnum();

        RuleFor(x => x.EndDate)
            .GreaterThanOrEqualTo(x => x.StartDate!.Value)
            .When(x => x.StartDate is not null && x.EndDate is not null)
            .WithMessage("EndDate must be on or after StartDate.");
    }
}
