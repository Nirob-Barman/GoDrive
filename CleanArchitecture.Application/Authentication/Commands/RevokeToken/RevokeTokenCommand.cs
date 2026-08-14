using MediatR;

namespace CleanArchitecture.Application.Authentication.Commands.RevokeToken;

public record RevokeTokenCommand(string RefreshToken) : IRequest;
