using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Reviews.Common;
using MediatR;

namespace CleanArchitecture.Application.Reviews.Commands.UpdateReview;

public class UpdateReviewCommandHandler : IRequestHandler<UpdateReviewCommand, ReviewDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IIdentityService _identityService;

    public UpdateReviewCommandHandler(
        IApplicationDbContext context, ICurrentUserService currentUser, IIdentityService identityService)
    {
        _context = context;
        _currentUser = currentUser;
        _identityService = identityService;
    }

    public async Task<ReviewDto> Handle(UpdateReviewCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId ?? throw new UnauthorizedAccessException();

        var review = await _context.Reviews.FindAsync([request.Id], cancellationToken)
            ?? throw new NotFoundException("Review", request.Id);

        if (review.UserId != userId)
        {
            throw new ForbiddenAccessException("You do not have permission to update this review.");
        }

        review.Update(request.Rating, request.Comment);

        await _context.SaveChangesAsync(cancellationToken);

        var fullName = (await _identityService.GetProfileAsync(userId, cancellationToken))?.FullName ?? string.Empty;

        return ReviewMapper.ToDto(review, fullName);
    }
}
