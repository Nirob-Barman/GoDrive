using CleanArchitecture.Application.Reviews.Common;
using MediatR;

namespace CleanArchitecture.Application.Reviews.Commands.UpdateReview;

public record UpdateReviewCommand(int Id, int Rating, string? Comment) : IRequest<ReviewDto>;
