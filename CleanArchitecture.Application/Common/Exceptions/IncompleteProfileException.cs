namespace CleanArchitecture.Application.Common.Exceptions;

public class IncompleteProfileException : Exception
{
    public IncompleteProfileException(string message)
        : base(message)
    {
    }
}
