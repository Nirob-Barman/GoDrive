using MediatR;

namespace CleanArchitecture.Application.Authentication.Commands.Register;

public record RegisterCommand(
    string FullName,
    string Email,
    string Password,
    string ConfirmPassword,
    string? PhoneNumber,
    bool TermsAccepted) : IRequest<RegisterResponse>;
