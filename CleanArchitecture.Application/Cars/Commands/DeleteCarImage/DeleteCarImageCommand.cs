using MediatR;

namespace CleanArchitecture.Application.Cars.Commands.DeleteCarImage;

public record DeleteCarImageCommand(int CarId, int ImageId) : IRequest;
