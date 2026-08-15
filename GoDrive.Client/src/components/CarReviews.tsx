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
  const [createReview, { isLoading: isCreating, error: createError }] = useCreateReviewMutation();
  const [updateReview, { isLoading: isUpdating, error: updateError }] = useUpdateReviewMutation();

  const isLoading = isCreating || isUpdating;
  const error = createError ?? updateError;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const result = existingReview
      ? await updateReview({ id: existingReview.id, rating, comment: comment || undefined }).unwrap().catch(() => null)
      : await createReview({ carId, rating, comment: comment || undefined }).unwrap().catch(() => null);

    if (result) {
      onDone?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <label>
        Rating
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} / 5
            </option>
          ))}
        </select>
      </label>
      <label>
        Comment
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
      </label>

      {error && <p className="form-error">{getErrorMessage(error)}</p>}

      <button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : existingReview ? "Update Review" : "Submit Review"}
      </button>
    </form>
  );
}

export default function CarReviews({ carId }: { carId: number }) {
  const user = useAppSelector(selectCurrentUser);
  const [pageNumber, setPageNumber] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading } = useGetCarReviewsQuery({ carId, pageNumber, pageSize: 10 });
  const { data: myReservations } = useGetMyReservationsQuery({ pageNumber: 1, pageSize: 100 }, { skip: !user });
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();

  const myReview = data?.items.find((r) => r.userId === user?.userId);
  const hasReturnedThisCar = Boolean(
    myReservations?.items.some((r) => r.carId === carId && r.status === "Returned"),
  );

  return (
    <div className="car-reviews">
      <h2>Reviews</h2>

      {isLoading && <p>Loading reviews...</p>}
      {data && data.items.length === 0 && <p>No reviews yet.</p>}

      <ul className="review-list">
        {data?.items.map((review) => (
          <li key={review.id} className="review-item">
            <p className="review-meta">
              <strong>{review.userFullName}</strong> &middot; {review.rating} / 5 &middot;{" "}
              {new Date(review.createdAtUtc).toLocaleDateString()}
              {review.updatedAtUtc && " (edited)"}
            </p>
            {review.comment && <p>{review.comment}</p>}
          </li>
        ))}
      </ul>

      {data && data.totalPages > 1 && (
        <div className="pagination">
          <button type="button" disabled={pageNumber <= 1} onClick={() => setPageNumber((p) => p - 1)}>
            Previous
          </button>
          <span>
            Page {data.pageNumber} of {data.totalPages}
          </span>
          <button type="button" disabled={pageNumber >= data.totalPages} onClick={() => setPageNumber((p) => p + 1)}>
            Next
          </button>
        </div>
      )}

      {!user && <p>Log in to write a review.</p>}

      {user && myReview && !isEditing && (
        <div>
          <p>You've already reviewed this car.</p>
          <div className="reservation-actions">
            <button type="button" onClick={() => setIsEditing(true)}>
              Edit your review
            </button>
            <button
              type="button"
              onClick={() => deleteReview({ id: myReview.id, carId })}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete your review"}
            </button>
          </div>
        </div>
      )}

      {user && myReview && isEditing && (
        <ReviewForm carId={carId} existingReview={myReview} onDone={() => setIsEditing(false)} />
      )}

      {user && !myReview && hasReturnedThisCar && <ReviewForm carId={carId} />}

      {user && !myReview && !hasReturnedThisCar && (
        <p>You can review this car once you've rented and returned it.</p>
      )}
    </div>
  );
}
