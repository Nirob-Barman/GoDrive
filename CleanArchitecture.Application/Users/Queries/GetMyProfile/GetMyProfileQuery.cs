using MediatR;

namespace CleanArchitecture.Application.Users.Queries.GetMyProfile;

public record GetMyProfileQuery : IRequest<UserProfileDto>;
