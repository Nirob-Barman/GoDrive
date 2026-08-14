using MediatR;

namespace CleanArchitecture.Application.Users.Commands.ChangeUserRole;

public record ChangeUserRoleCommand(string UserId, string NewRole) : IRequest;
