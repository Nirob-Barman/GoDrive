using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using MediatR;

namespace CleanArchitecture.Application.Reviews.Commands.DeleteReview;

public class DeleteReviewCommandHandler : IRequestHandler<DeleteReviewCommand>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;

    public DeleteReviewCommandHandler(IApplicationDbContext context, ICurrentUserService currentUser)
    {
        _context = context;
        _currentUser = currentUser;
    }

    public async Task Handle(DeleteReviewCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId ?? throw new UnauthorizedAccessException();

        var review = await _context.Reviews.FindAsync([request.Id], cancellationToken)
            ?? throw new NotFoundException("Review", request.Id);

        if (review.UserId != userId)
        {
            throw new ForbiddenAccessException("You do not have permission to delete this review.");
        }

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync(cancellationToken);
    }
}
