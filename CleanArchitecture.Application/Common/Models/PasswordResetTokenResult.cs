namespace CleanArchitecture.Application.Common.Models;

public record PasswordResetTokenResult(string Token, string Email, string FullName);
