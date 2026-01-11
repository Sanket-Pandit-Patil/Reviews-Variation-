import { getStarRatingData } from "../utils/starRating.js";

/**
 * StarRating - Visual star rating display component
 */
export default function StarRating({ rating, size = "medium", showNumber = false, interactive = false, onRatingChange }) {
  const stars = getStarRatingData(rating);
  const sizeClass = size === "small" ? "star-rating--small" : size === "large" ? "star-rating--large" : "";

  const handleClick = (index) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  const handleMouseEnter = (index) => {
    if (interactive) {
      // Visual feedback on hover (handled by CSS)
    }
  };

  return (
    <div className={`star-rating ${sizeClass} ${interactive ? "star-rating--interactive" : ""}`} role="img" aria-label={`Rating: ${rating} out of 5 stars`}>
      {stars.map((star, idx) => (
        <span
          key={idx}
          className={`star star--${star.type}`}
          onClick={() => handleClick(star.index)}
          onMouseEnter={() => handleMouseEnter(star.index)}
          role={interactive ? "button" : undefined}
          tabIndex={interactive ? 0 : undefined}
          aria-label={interactive ? `Rate ${star.index + 1} stars` : undefined}
        >
          ★
        </span>
      ))}
      {showNumber && <span className="star-rating__number">{rating.toFixed(1)}</span>}
    </div>
  );
}

