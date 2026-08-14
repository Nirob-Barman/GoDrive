using CleanArchitecture.Application.Common.Exceptions;
using FluentValidation;
using Microsoft.AspNetCore.Diagnostics;

namespace CleanArchitecture.Api.Middleware;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        var (statusCode, message, errors) = MapException(exception);

        if (statusCode == StatusCodes.Status500InternalServerError)
        {
            _logger.LogError(exception, "Unhandled exception");
        }

        httpContext.Response.StatusCode = statusCode;
        httpContext.Response.ContentType = "application/json";

        await httpContext.Response.WriteAsJsonAsync(
            new { success = false, message, errors },
            cancellationToken);

        return true;
    }

    private static (int StatusCode, string Message, IReadOnlyCollection<string> Errors) MapException(Exception exception) =>
        exception switch
        {
            ValidationException validationEx => (
                StatusCodes.Status400BadRequest,
                "Validation failed",
                validationEx.Errors.Select(e => e.ErrorMessage).ToArray()),

            NotFoundException notFoundEx => (
                StatusCodes.Status404NotFound,
                notFoundEx.Message,
                Array.Empty<string>()),

            ForbiddenAccessException forbiddenEx => (
                StatusCodes.Status403Forbidden,
                forbiddenEx.Message,
                Array.Empty<string>()),

            ConflictException conflictEx => (
                StatusCodes.Status409Conflict,
                conflictEx.Message,
                Array.Empty<string>()),

            InvalidOperationException invalidOpEx => (
                StatusCodes.Status409Conflict,
                invalidOpEx.Message,
                Array.Empty<string>()),

            IncompleteProfileException incompleteProfileEx => (
                StatusCodes.Status422UnprocessableEntity,
                incompleteProfileEx.Message,
                Array.Empty<string>()),

            IdentityOperationException identityOpEx => (
                StatusCodes.Status400BadRequest,
                "Identity operation failed",
                identityOpEx.Errors),

            UnauthorizedAccessException => (
                StatusCodes.Status401Unauthorized,
                "Unauthorized",
                Array.Empty<string>()),

            _ => (
                StatusCodes.Status500InternalServerError,
                "An unexpected error occurred",
                Array.Empty<string>())
        };
}
