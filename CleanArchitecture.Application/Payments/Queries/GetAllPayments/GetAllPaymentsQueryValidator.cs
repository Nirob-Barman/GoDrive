using FluentValidation;

namespace CleanArchitecture.Application.Payments.Queries.GetAllPayments;

public class GetAllPaymentsQueryValidator : AbstractValidator<GetAllPaymentsQuery>
{
    public GetAllPaymentsQueryValidator()
    {
        RuleFor(x => x.PageNumber).GreaterThan(0);
        RuleFor(x => x.PageSize).InclusiveBetween(1, 100);
    }
}
