using MediatR;

namespace CleanArchitecture.Application.Authentication.Commands.ForgotPassword;

public record ForgotPasswordCommand(string Email) : IRequest;
