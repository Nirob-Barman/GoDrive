using CleanArchitecture.Application.Reservations.Common;
using MediatR;

namespace CleanArchitecture.Application.Reservations.Commands.ApproveReservation;

public record ApproveReservationCommand(int Id) : IRequest<ReservationDto>;
