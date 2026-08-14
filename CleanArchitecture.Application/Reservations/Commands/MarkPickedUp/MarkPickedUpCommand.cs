using CleanArchitecture.Application.Reservations.Common;
using MediatR;

namespace CleanArchitecture.Application.Reservations.Commands.MarkPickedUp;

public record MarkPickedUpCommand(int Id) : IRequest<ReservationDto>;
