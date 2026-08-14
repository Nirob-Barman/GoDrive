using MediatR;

namespace CleanArchitecture.Application.Users.Commands.SetUserActiveStatus;

public record SetUserActiveStatusCommand(string UserId, bool IsActive) : IRequest;
