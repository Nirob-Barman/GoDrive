using FluentValidation;

namespace CleanArchitecture.Application.Dashboard.Queries.GetCarUtilization;

public class GetCarUtilizationQueryValidator : AbstractValidator<GetCarUtilizationQuery>
{
    public GetCarUtilizationQueryValidator()
    {
        RuleFor(x => x.EndDate)
            .GreaterThanOrEqualTo(x => x.StartDate!.Value)
            .When(x => x.StartDate is not null && x.EndDate is not null)
            .WithMessage("EndDate must be on or after StartDate.");
    }
}
