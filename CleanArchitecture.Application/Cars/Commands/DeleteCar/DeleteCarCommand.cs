using MediatR;

namespace CleanArchitecture.Application.Cars.Commands.DeleteCar;

public record DeleteCarCommand(int Id) : IRequest;
