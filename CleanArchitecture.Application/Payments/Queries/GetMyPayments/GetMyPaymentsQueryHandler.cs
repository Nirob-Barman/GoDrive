using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Application.Payments.Common;
using CleanArchitecture.Domain.Entities;
using MediatR;

namespace CleanArchitecture.Application.Payments.Queries.GetMyPayments;

public class GetMyPaymentsQueryHandler : IRequestHandler<GetMyPaymentsQuery, PaginatedList<PaymentDto>>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public GetMyPaymentsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task<PaginatedList<PaymentDto>> Handle(GetMyPaymentsQuery request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId ?? throw new UnauthorizedAccessException();

        var query = _context.Payments
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAtUtc);

        var paged = await PaginatedList<Payment>.CreateAsync(query, request.PageNumber, request.PageSize, cancellationToken);

        return new PaginatedList<PaymentDto>(
            paged.Items.Select(PaymentMapper.ToDto).ToArray(),
            paged.TotalCount,
            paged.PageNumber,
            request.PageSize);
    }
}
