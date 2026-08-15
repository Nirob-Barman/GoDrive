using FluentValidation;

namespace CleanArchitecture.Application.Payments.Queries.GetMyPayments;

public class GetMyPaymentsQueryValidator : AbstractValidator<GetMyPaymentsQuery>
{
    public GetMyPaymentsQueryValidator()
    {
        RuleFor(x => x.PageNumber).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 50);
    }
}
