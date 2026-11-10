import { useState } from "react";
import type { FormEvent } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/features/auth/authSlice";
import { useGetMyReservationsQuery } from "../redux/features/reservations/reservationsApi";
import {
  useCreateReviewMutation,
  useDeleteReviewMutation,
  useGetCarReviewsQuery,
  useUpdateReviewMutation,
} from "../redux/features/reviews/reviewsApi";
import EmptyState from "./ui/EmptyState";
import { SkeletonRows } from "./ui/Skeleton";
import type { TReview } from "../types/reviews";
import { getErrorMessage } from "../utils/getErrorMessage";

function ReviewForm({
  carId,
  existingReview,
  onDone,
}: {
  carId: number;
  existingReview?: TReview;
  onDone?: () => void;
}) {
  const [rating, setRating] = useState(existingReview?.rating ?? 5);
  const [comment, setComment] = useState(existingReview?.comment ?? "");

  const [createReview, { isLoading: isCreating, error: createError }] =
    useCreateReviewMutation();

  const [updateReview, { isLoading: isUpdating, error: updateError }] =
    useUpdateReviewMutation();

  const isLoading = isCreating || isUpdating;
  const error = createError ?? updateError;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const result = existingReview
      ? await updateReview({
          id: existingReview.id,
          rating,
          comment: comment || undefined,
        })
          .unwrap()
          .catch(() => null)
      : await createReview({
          carId,
          rating,
          comment: comment || undefined,
        })
          .unwrap()
          .catch(() => null);

    if (result) {
      onDone?.();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-6"
    >
      <div className="mb-5">
        <span className="text-xs font-bold tracking-[2px] text-orange-500">
          SHARE YOUR EXPERIENCE
        </span>

        <h3 className="mt-2 text-xl font-bold text-gray-950">
          {existingReview ? "Edit your review" : "Write a review"}
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          Tell others what you think about this vehicle.
        </p>
      </div>

      {/* Rating */}
      <div className="mb-5">
        <label
          htmlFor="review-rating"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Your rating
        </label>

        <div className="flex flex-wrap items-center gap-3">
          <select
            id="review-rating"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} / 5
              </option>
            ))}
          </select>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, index) => (
              <span
                key={index}
                className={`text-xl ${
                  index < rating ? "text-amber-400" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Comment */}
      <div className="mb-5">
        <label
          htmlFor="review-comment"
          className="mb-2 block text-sm font-semibold text-gray-700"
        >
          Your experience
          <span className="ml-1 font-normal text-gray-400">(Optional)</span>
        </label>

        <textarea
          id="review-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Share your experience with this vehicle..."
          className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-7 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
        />
      </div>

      {error && (
        <p className="mb-4 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
          {getErrorMessage(error)}
        </p>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading
            ? "Saving..."
            : existingReview
              ? "Update review"
              : "Submit review"}
          {!isLoading && <span>→</span>}
        </button>

        {existingReview && onDone && (
          <button
            type="button"
            onClick={onDone}
            disabled={isLoading}
            className="rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-600 transition hover:border-gray-400 hover:text-gray-900 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default function CarReviews({ carId }: { carId: number }) {
  const user = useAppSelector(selectCurrentUser);

  const [pageNumber, setPageNumber] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, isFetching, error } = useGetCarReviewsQuery({
    carId,
    pageNumber,
    pageSize: 10,
  });

  const { data: myReservations } = useGetMyReservationsQuery(
    { pageNumber: 1, pageSize: 100 },
    { skip: !user },
  );

  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const myReview = data?.items.find((review) => review.userId === user?.userId);

  const hasReturnedThisCar = Boolean(
    myReservations?.items.some(
      (reservation) =>
        reservation.carId === carId && reservation.status === "Returned",
    ),
  );

  const averageRating =
    data && data.items.length > 0
      ? data.items.reduce((total, review) => total + review.rating, 0) /
        data.items.length
      : null;

  return (
    <section className="border-t border-gray-200 pt-10">
      {/* Section Heading */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-extrabold tracking-[3px] text-orange-500">
            CUSTOMER FEEDBACK
          </span>

          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
            Reviews & Ratings
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Discover what other customers think about this vehicle.
          </p>
        </div>

        {data && data.totalCount > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
            <span className="text-3xl font-extrabold text-gray-950">
              {averageRating?.toFixed(1) ?? "—"}
            </span>

            <div>
              <div className="flex gap-0.5 text-amber-400">
                {Array.from({ length: 5 }, (_, index) => (
                  <span key={index}>
                    {index < Math.round(averageRating ?? 0) ? "★" : "☆"}
                  </span>
                ))}
              </div>

              <p className="mt-0.5 text-xs text-gray-400">
                {data.totalCount} customer
                {data.totalCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading && <SkeletonRows count={3} height={80} />}

      {/* Error */}
      {error && !isLoading && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-600">Could not load reviews.</p>
          <p className="mt-2 text-sm text-red-500">Please try again later.</p>
        </div>
      )}

      {/* Empty State */}
      {data && data.items.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <EmptyState
            title="No reviews yet"
            description="Be the first to share your experience with this vehicle."
          />
        </div>
      )}

      {/* Review List */}
      {data && data.items.length > 0 && (
        <div className="space-y-4">
          {data.items.map((review) => (
            <article
              key={review.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-orange-200 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  {/* Avatar */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-50 text-lg font-extrabold text-orange-500">
                    {review.userFullName.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-bold text-gray-900">
                      {review.userFullName}
                    </h3>

                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(review.createdAtUtc).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                      {review.updatedAtUtc && (
                        <span className="ml-1">(Edited)</span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex shrink-0 items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5">
                  <span className="text-amber-500">★</span>
                  <span className="text-sm font-bold text-gray-800">
                    {review.rating}.0
                  </span>
                </div>
              </div>

              {review.comment && (
                <p className="mt-5 text-sm leading-7 text-gray-600">
                  {review.comment}
                </p>
              )}
            </article>
          ))}
        </div>
      )}

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-white p-4">
          <button
            type="button"
            disabled={pageNumber <= 1 || isFetching}
            onClick={() => setPageNumber((page) => page - 1)}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-orange-500 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Previous
          </button>

          <span className="text-sm text-gray-600">
            Page <strong className="text-gray-900">{data.pageNumber}</strong> of{" "}
            <strong className="text-gray-900">{data.totalPages}</strong>
          </span>

          <button
            type="button"
            disabled={pageNumber >= data.totalPages || isFetching}
            onClick={() => setPageNumber((page) => page + 1)}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-orange-500 hover:text-orange-500 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next →
          </button>
        </div>
      )}

      {/* Review Actions */}
      <div className="mt-8">
        {!user && (
          <div className="rounded-2xl border border-orange-100 bg-orange-50/60 p-5">
            <p className="text-sm font-semibold text-gray-800">
              Want to share your experience?
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Log in to your account to write a review.
            </p>
          </div>
        )}

        {user && myReview && !isEditing && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-bold text-gray-900">Your review</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You've already reviewed this vehicle.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-orange-500 hover:text-orange-500"
                >
                  Edit review
                </button>

                <button
                  type="button"
                  onClick={() => deleteReview({ id: myReview.id, carId })}
                  disabled={isDeleting}
                  className="rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete review"}
                </button>
              </div>
            </div>
          </div>
        )}

        {user && myReview && isEditing && (
          <ReviewForm
            carId={carId}
            existingReview={myReview}
            onDone={() => setIsEditing(false)}
          />
        )}

        {user && !myReview && hasReturnedThisCar && (
          <ReviewForm carId={carId} />
        )}

        {user && !myReview && !hasReturnedThisCar && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <p className="text-sm font-semibold text-gray-800">
              Your feedback matters!
            </p>
            <p className="mt-1 text-sm leading-6 text-gray-500">
              You can write a review after renting and returning this vehicle.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
