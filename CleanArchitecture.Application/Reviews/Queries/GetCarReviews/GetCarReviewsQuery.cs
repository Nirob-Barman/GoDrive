using CleanArchitecture.Application.Common.Models;
using CleanArchitecture.Application.Reviews.Common;
using MediatR;

namespace CleanArchitecture.Application.Reviews.Queries.GetCarReviews;

public record GetCarReviewsQuery(int CarId, int PageNumber = 1, int PageSize = 10) : IRequest<PaginatedList<ReviewDto>>;
