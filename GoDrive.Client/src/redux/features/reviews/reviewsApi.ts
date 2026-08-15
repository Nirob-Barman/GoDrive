import { baseApi } from "../../api/baseApi";
import { buildQueryParams } from "../../../utils/queryParams";
import type { TApiEnvelope, TPaginatedList } from "../../../types/common";
import type { TCarReviewsFilters, TCreateReviewRequest, TReview, TUpdateReviewRequest } from "../../../types/reviews";

export const reviewsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCarReviews: builder.query<TPaginatedList<TReview>, TCarReviewsFilters>({
      query: ({ carId, ...filters }) => ({ url: `/cars/${carId}/reviews`, params: buildQueryParams(filters) }),
      transformResponse: (response: TApiEnvelope<TPaginatedList<TReview>>) => response.data!,
      providesTags: (result, _error, { carId }) => [
        { type: "Review", id: carId },
        ...(result?.items.map((r) => ({ type: "Review" as const, id: r.id })) ?? []),
      ],
    }),
    createReview: builder.mutation<TReview, TCreateReviewRequest>({
      query: ({ carId, ...body }) => ({ url: `/cars/${carId}/reviews`, method: "POST", body }),
      transformResponse: (response: TApiEnvelope<TReview>) => response.data!,
      invalidatesTags: (_result, _error, { carId }) => [{ type: "Review", id: carId }, "Car"],
    }),
    updateReview: builder.mutation<TReview, TUpdateReviewRequest>({
      query: ({ id, ...body }) => ({ url: `/reviews/${id}`, method: "PUT", body }),
      transformResponse: (response: TApiEnvelope<TReview>) => response.data!,
      invalidatesTags: (result) => [{ type: "Review", id: result?.carId }, "Car"],
    }),
    deleteReview: builder.mutation<void, { id: number; carId: number }>({
      query: ({ id }) => ({ url: `/reviews/${id}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, { carId }) => [{ type: "Review", id: carId }, "Car"],
    }),
  }),
});

export const { useGetCarReviewsQuery, useCreateReviewMutation, useUpdateReviewMutation, useDeleteReviewMutation } =
  reviewsApi;
