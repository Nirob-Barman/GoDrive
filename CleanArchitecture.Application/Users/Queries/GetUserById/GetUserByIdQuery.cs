using CleanArchitecture.Application.Users.Queries.GetMyProfile;
using MediatR;

namespace CleanArchitecture.Application.Users.Queries.GetUserById;

public record GetUserByIdQuery(string UserId) : IRequest<UserProfileDto>;
