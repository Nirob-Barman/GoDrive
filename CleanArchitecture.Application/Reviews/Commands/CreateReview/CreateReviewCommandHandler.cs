using CleanArchitecture.Application.Common.Exceptions;
using CleanArchitecture.Application.Common.Interfaces;
using CleanArchitecture.Application.Reviews.Common;
using CleanArchitecture.Domain.Entities;
using CleanArchitecture.Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace CleanArchitecture.Application.Reviews.Commands.CreateReview;

public class CreateReviewCommandHandler : IRequestHandler<CreateReviewCommand, ReviewDto>
{
    private readonly IApplicationDbContext _context;
    private readonly ICurrentUserService _currentUser;
    private readonly IIdentityService _identityService;

    public CreateReviewCommandHandler(
        IApplicationDbContext context, ICurrentUserService currentUser, IIdentityService identityService)
    {
        _context = context;
        _currentUser = currentUser;
        _identityService = identityService;
    }

    public async Task<ReviewDto> Handle(CreateReviewCommand request, CancellationToken cancellationToken)
    {
        var userId = _currentUser.UserId ?? throw new UnauthorizedAccessException();

        var carExists = await _context.Cars.AnyAsync(c => c.Id == request.CarId, cancellationToken);
        if (!carExists)
        {
            throw new NotFoundException("Car", request.CarId);
        }

        var hasReturnedReservation = await _context.Reservations.AnyAsync(
            r => r.CarId == request.CarId && r.UserId == userId && r.Status == ReservationStatus.Returned,
            cancellationToken);

        if (!hasReturnedReservation)
        {
            throw new ForbiddenAccessException("You can only review a car you have rented and returned.");
        }

        var alreadyReviewed = await _context.Reviews.AnyAsync(
            r => r.CarId == request.CarId && r.UserId == userId, cancellationToken);

        if (alreadyReviewed)
        {
            throw new ConflictException("You have already reviewed this car. Update your existing review instead.");
        }

        var review = Review.Create(request.CarId, userId, request.Rating, request.Comment);

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync(cancellationToken);

        var fullName = (await _identityService.GetProfileAsync(userId, cancellationToken))?.FullName ?? string.Empty;

        return ReviewMapper.ToDto(review, fullName);
    }
}
