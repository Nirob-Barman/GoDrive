// Mirrors CleanArchitecture.Application.Reviews.Common.ReviewDto
export type TReview = {
  id: number;
  carId: number;
  userId: string;
  userFullName: string;
  rating: number;
  comment: string | null;
  createdAtUtc: string;
  updatedAtUtc: string | null;
};

export type TCreateReviewRequest = {
  carId: number;
  rating: number;
  comment?: string;
};

export type TUpdateReviewRequest = {
  id: number;
  rating: number;
  comment?: string;
};

export type TCarReviewsFilters = {
  carId: number;
  pageNumber?: number;
  pageSize?: number;
};
