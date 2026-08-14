using CleanArchitecture.Application.Reviews.Common;
using MediatR;

namespace CleanArchitecture.Application.Reviews.Commands.CreateReview;

public record CreateReviewCommand(int CarId, int Rating, string? Comment) : IRequest<ReviewDto>;
