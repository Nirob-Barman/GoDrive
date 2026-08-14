using CleanArchitecture.Application.Authentication.Commands.Login;
using MediatR;

namespace CleanArchitecture.Application.Authentication.Commands.RefreshAccessToken;

public record RefreshTokenCommand(string RefreshToken) : IRequest<LoginResponse>;
