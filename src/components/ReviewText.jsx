import { useState } from "react";

/**
 * ReviewText - Component that truncates long reviews with show more/less functionality
 */
export default function ReviewText({ text, maxLength = 150 }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const shouldTruncate = text.length > maxLength;
  const displayText = isExpanded || !shouldTruncate ? text : `${text.slice(0, maxLength)}...`;

  if (!shouldTruncate) {
    return <p className="review-text">{text}</p>;
  }

  return (
    <div className="review-text">
      <p className="review-text__content">{displayText}</p>
      <button
        type="button"
        className="review-text__toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? "Show less" : "Show more"}
      >
        {isExpanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
}

