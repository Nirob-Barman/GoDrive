using MediatR;

namespace CleanArchitecture.Application.Authentication.Commands.ChangePassword;

// CurrentRefreshToken is read from the httpOnly cookie by the Api layer, never bound
// from the request body - it identifies which session is "this one" so it can be
// spared from the revoke-every-other-session sweep below.
public record ChangePasswordCommand(
    string CurrentPassword,
    string NewPassword,
    string ConfirmNewPassword,
    string? CurrentRefreshToken) : IRequest;
