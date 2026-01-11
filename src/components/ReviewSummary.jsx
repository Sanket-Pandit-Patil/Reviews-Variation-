import { useMemo } from "react";
import StarRating from "./StarRating.jsx";
import RatingDistribution from "./RatingDistribution.jsx";

/**
 * ReviewSummary - Shows overall review statistics
 */
export default function ReviewSummary({ reviews, showDistribution = true }) {
  const stats = useMemo(() => {
    if (reviews.length === 0) {
      return {
        average: 0,
        total: 0,
        verified: 0,
        withImages: 0,
      };
    }

    const total = reviews.length;
    const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    const average = sum / total;
    const verified = reviews.filter((r) => r.verified).length;
    const withImages = reviews.filter((r) => Boolean(r.image)).length;

    return {
      average: Number(average.toFixed(1)),
      total,
      verified,
      withImages,
      verifiedPercent: Math.round((verified / total) * 100),
    };
  }, [reviews]);

  return (
    <div className="review-summary">
      <div className="review-summary__main">
        <div className="review-summary__rating">
          <StarRating rating={stats.average} size="large" showNumber={true} />
          <p className="review-summary__count">
            Based on <b>{stats.total}</b> review{stats.total !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="review-summary__stats">
          <div className="review-summary__stat">
            <span className="review-summary__stat-label">Verified</span>
            <span className="review-summary__stat-value">
              {stats.verified} ({stats.verifiedPercent}%)
            </span>
          </div>
          <div className="review-summary__stat">
            <span className="review-summary__stat-label">With Images</span>
            <span className="review-summary__stat-value">{stats.withImages}</span>
          </div>
        </div>
      </div>
      {showDistribution && reviews.length > 0 && (
        <RatingDistribution reviews={reviews} />
      )}
    </div>
  );
}

