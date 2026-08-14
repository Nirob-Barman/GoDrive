namespace CleanArchitecture.Application.Common.Models;

public record ChangePasswordResult(bool Succeeded, IReadOnlyCollection<string> Errors);
