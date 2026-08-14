namespace CleanArchitecture.Application.Common.Exceptions;

public class IdentityOperationException : Exception
{
    public IReadOnlyCollection<string> Errors { get; }

    public IdentityOperationException(IEnumerable<string> errors)
        : base("Identity operation failed.")
    {
        Errors = errors.ToArray();
    }
}
