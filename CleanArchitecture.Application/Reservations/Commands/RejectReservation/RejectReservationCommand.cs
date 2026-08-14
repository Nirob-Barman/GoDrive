using CleanArchitecture.Application.Reservations.Common;
using MediatR;

namespace CleanArchitecture.Application.Reservations.Commands.RejectReservation;

public record RejectReservationCommand(int Id, string? Reason) : IRequest<ReservationDto>;
