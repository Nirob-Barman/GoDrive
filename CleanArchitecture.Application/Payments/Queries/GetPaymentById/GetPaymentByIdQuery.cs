using CleanArchitecture.Application.Payments.Common;
using MediatR;

namespace CleanArchitecture.Application.Payments.Queries.GetPaymentById;

public record GetPaymentByIdQuery(int Id) : IRequest<PaymentDto>;
