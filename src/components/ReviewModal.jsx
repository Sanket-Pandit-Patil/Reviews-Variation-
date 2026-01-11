import { useEffect } from "react";
import StarRating from "./StarRating.jsx";
import ReviewText from "./ReviewText.jsx";
import { formatTimeAgo, formatFullDate } from "../utils/timeUtils.js";

/**
 * ReviewModal - Modal to display full review details
 */
export default function ReviewModal({ review, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!review) return null;

  return (
    <div className="review-modal" onClick={onClose} role="dialog" aria-modal="true" aria-label="Review details">
      <div className="review-modal__content" onClick={(e) => e.stopPropagation()}>
        <button
          className="review-modal__close"
          onClick={onClose}
          aria-label="Close review modal"
        >
          ×
        </button>

        <div className="review-modal__header">
          <div className="review-modal__rating">
            <StarRating rating={review.rating} size="large" showNumber={true} />
          </div>
          <div className="review-modal__meta">
            <div className="review-modal__author">
              <strong>{review.name}</strong>
              {review.verified && <span className="verified-badge">✓ Verified Purchase</span>}
            </div>
            <span className="review-modal__time" title={formatFullDate(review.createdAt)}>
              {formatTimeAgo(review.createdAt)}
            </span>
          </div>
        </div>

        {review.image && (
          <div className="review-modal__image">
            <img
              src={review.image}
              alt={`Review image by ${review.name}`}
            />
          </div>
        )}

        <div className="review-modal__body">
          <ReviewText text={review.text} maxLength={500} />


        </div>
      </div>
    </div>
  );
}
