using MediatR;

namespace CleanArchitecture.Application.Authentication.Commands.ChangePassword;

public record ChangePasswordCommand(string CurrentPassword, string NewPassword, string ConfirmNewPassword) : IRequest;
