using CleanArchitecture.Application.Reservations.Common;
using MediatR;

namespace CleanArchitecture.Application.Reservations.Commands.ReturnCar;

public record ReturnCarCommand(int Id) : IRequest<ReservationDto>;
