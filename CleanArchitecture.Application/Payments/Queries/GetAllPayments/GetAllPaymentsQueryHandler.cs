using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Application.Payments.Common;
using CleanArchitecture.Domain.Entities;
using MediatR;

namespace CleanArchitecture.Application.Payments.Queries.GetAllPayments;

public class GetAllPaymentsQueryHandler : IRequestHandler<GetAllPaymentsQuery, PaginatedList<PaymentDto>>
{
    private readonly IApplicationDbContext _context;

    public GetAllPaymentsQueryHandler(IApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedList<PaymentDto>> Handle(GetAllPaymentsQuery request, CancellationToken cancellationToken)
    {
        var query = _context.Payments.OrderByDescending(p => p.CreatedAtUtc);

        var paged = await PaginatedList<Payment>.CreateAsync(query, request.PageNumber, request.PageSize, cancellationToken);

        return new PaginatedList<PaymentDto>(
            paged.Items.Select(PaymentMapper.ToDto).ToArray(),
            paged.TotalCount,
            paged.PageNumber,
            request.PageSize);
    }
}
