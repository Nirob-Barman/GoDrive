using MediatR;

namespace CleanArchitecture.Application.Authentication.Commands.RevokeAllTokens;

public record RevokeAllTokensCommand : IRequest;
