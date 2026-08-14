using CleanArchitecture.Application.Reservations.Common;
using MediatR;

namespace CleanArchitecture.Application.Reservations.Queries.GetReservationById;

public record GetReservationByIdQuery(int Id) : IRequest<ReservationDto>;
