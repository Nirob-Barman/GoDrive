using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Application.Payments.Common;
using MediatR;

namespace CleanArchitecture.Application.Payments.Queries.GetAllPayments;

public record GetAllPaymentsQuery(int PageNumber = 1, int PageSize = 20) : IRequest<PaginatedList<PaymentDto>>;
