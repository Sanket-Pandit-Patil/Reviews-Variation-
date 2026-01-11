import { useMemo } from "react";
import ReviewForm from "./ReviewForm.jsx";
import ReviewsFeed from "./ReviewsFeed.jsx";
import StarRating from "./StarRating.jsx";
import { useCountUpOnView } from "../hooks/useCountUpOnView.js";

export default function ReviewsMedia({ reviews, onAddReview, onAddReply }) {
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
    };
  }, [reviews]);

  const avgRating = useCountUpOnView(stats.average, { duration: 900, decimals: 1 });
  const totalReviews = useCountUpOnView(stats.total, { duration: 900 });
  const verifiedCount = useCountUpOnView(stats.verified, { duration: 900 });
  const imagesCount = useCountUpOnView(stats.withImages, { duration: 900 });

  return (
    <section className="reviews reviews--media">
      <div className="container">
        <div className="section-head">
          <h2>Variation B</h2>
          <p className="muted">Media-first: UGC wall + image upload.</p>
        </div>

        {/* Modern Review Summary Stats */}
        <div className="reviews-media__stats">
          <div className="reviews-media__stats-main">
            <div className="reviews-media__rating">
              <StarRating rating={stats.average} size="large" showNumber={true} />
              <div className="reviews-media__rating-info">
                <p className="reviews-media__count">
                  Based on <strong ref={totalReviews.ref}>{totalReviews.value}</strong> review{stats.total !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
            <div className="reviews-media__stats-grid">
              <div className="reviews-media__stat-item">
                <div className="reviews-media__stat-value" ref={verifiedCount.ref}>
                  {verifiedCount.value}
                </div>
                <div className="reviews-media__stat-label">Verified</div>
              </div>
              <div className="reviews-media__stat-item">
                <div className="reviews-media__stat-value" ref={imagesCount.ref}>
                  {imagesCount.value}
                </div>
                <div className="reviews-media__stat-label">With Images</div>
              </div>
            </div>
          </div>
        </div>

        <ReviewForm onAdd={onAddReview} />

        <ReviewsFeed
          reviews={reviews}
          mode="media"
          pagination={true}
          pageSize={3}
          showImageOnlyToggle={true}
          showControls={true}
          onAddReply={onAddReply}
        />

      </div>
    </section>
  );
}
