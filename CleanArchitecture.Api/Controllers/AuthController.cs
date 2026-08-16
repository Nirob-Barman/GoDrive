using CleanArchitecture.Api.Common;
using CleanArchitecture.Api.Controllers.Requests;
using CleanArchitecture.Api.Controllers.Responses;
using CleanArchitecture.Application.Authentication.Commands.ChangePassword;
using CleanArchitecture.Application.Authentication.Commands.ForgotPassword;
using CleanArchitecture.Application.Authentication.Commands.Login;
using CleanArchitecture.Application.Authentication.Commands.RefreshAccessToken;
using CleanArchitecture.Application.Authentication.Commands.Register;
using CleanArchitecture.Application.Authentication.Commands.ResetPassword;
using CleanArchitecture.Application.Authentication.Commands.RevokeAllTokens;
using CleanArchitecture.Application.Authentication.Commands.RevokeToken;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanArchitecture.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private const string RefreshTokenCookieName = "refreshToken";

    private readonly ISender _sender;

    public AuthController(ISender sender)
    {
        _sender = sender;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        return StatusCode(StatusCodes.Status201Created, ApiResponse.Ok(result, "Registration successful"));
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginCommand command, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(command, cancellationToken);
        AppendRefreshTokenCookie(result.RefreshToken, result.RefreshTokenExpiresAtUtc);
        return Ok(ApiResponse.Ok(ToAuthResponse(result), "Login successful"));
    }

    // No request body - the refresh token travels only as the httpOnly cookie set by Login/RefreshToken.
    [AllowAnonymous]
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken(CancellationToken cancellationToken)
    {
        if (!Request.Cookies.TryGetValue(RefreshTokenCookieName, out var refreshToken) || string.IsNullOrEmpty(refreshToken))
        {
            return Unauthorized(new { success = false, message = "Missing refresh token.", errors = Array.Empty<string>() });
        }

        var result = await _sender.Send(new RefreshTokenCommand(refreshToken), cancellationToken);
        AppendRefreshTokenCookie(result.RefreshToken, result.RefreshTokenExpiresAtUtc);
        return Ok(ApiResponse.Ok(ToAuthResponse(result), "Token refreshed"));
    }

    [AllowAnonymous]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout(CancellationToken cancellationToken)
    {
        if (Request.Cookies.TryGetValue(RefreshTokenCookieName, out var refreshToken) && !string.IsNullOrEmpty(refreshToken))
        {
            await _sender.Send(new RevokeTokenCommand(refreshToken), cancellationToken);
        }

        Response.Cookies.Delete(RefreshTokenCookieName, new CookieOptions { Path = "/api/auth" });
        return NoContent();
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request, CancellationToken cancellationToken)
    {
        Request.Cookies.TryGetValue(RefreshTokenCookieName, out var currentRefreshToken);

        var command = new ChangePasswordCommand(
            request.CurrentPassword, request.NewPassword, request.ConfirmNewPassword, currentRefreshToken);

        await _sender.Send(command, cancellationToken);
        return Ok(ApiResponse.Ok("Password changed. You have been logged out of all other sessions."));
    }

    [AllowAnonymous]
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordCommand command, CancellationToken cancellationToken)
    {
        await _sender.Send(command, cancellationToken);
        return Ok(ApiResponse.Ok("If that email is registered, a password reset email has been sent."));
    }

    [AllowAnonymous]
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordCommand command, CancellationToken cancellationToken)
    {
        await _sender.Send(command, cancellationToken);
        return Ok(ApiResponse.Ok("Password reset successful."));
    }

    [Authorize]
    [HttpPost("revoke-all-tokens")]
    public async Task<IActionResult> RevokeAllTokens(CancellationToken cancellationToken)
    {
        await _sender.Send(new RevokeAllTokensCommand(), cancellationToken);
        Response.Cookies.Delete(RefreshTokenCookieName, new CookieOptions { Path = "/api/auth" });
        return NoContent();
    }

    private void AppendRefreshTokenCookie(string refreshToken, DateTime expiresAtUtc)
    {
        Response.Cookies.Append(RefreshTokenCookieName, refreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/api/auth",
            Expires = expiresAtUtc,
        });
    }

    private static AuthResponse ToAuthResponse(LoginResponse result) => new(
        result.Token, result.ExpiresAtUtc, result.UserId, result.Email, result.FullName, result.Role);
}
