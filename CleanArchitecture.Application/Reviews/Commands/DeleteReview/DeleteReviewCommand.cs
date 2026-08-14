using MediatR;

namespace CleanArchitecture.Application.Reviews.Commands.DeleteReview;

public record DeleteReviewCommand(int Id) : IRequest;
