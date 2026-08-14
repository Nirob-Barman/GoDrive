using MediatR;

namespace CleanArchitecture.Application.Authentication.Commands.Login;

public record LoginCommand(string Email, string Password) : IRequest<LoginResponse>;
