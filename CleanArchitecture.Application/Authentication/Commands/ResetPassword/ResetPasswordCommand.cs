using MediatR;

namespace CleanArchitecture.Application.Authentication.Commands.ResetPassword;

public record ResetPasswordCommand(string Email, string Token, string NewPassword, string ConfirmNewPassword) : IRequest;
