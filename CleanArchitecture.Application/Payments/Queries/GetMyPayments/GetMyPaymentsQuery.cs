using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Application.Payments.Common;
using MediatR;

namespace CleanArchitecture.Application.Payments.Queries.GetMyPayments;

public record GetMyPaymentsQuery(int PageNumber = 1, int PageSize = 10) : IRequest<PaginatedList<PaymentDto>>;
