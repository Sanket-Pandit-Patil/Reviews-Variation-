import { useState, useEffect } from "react";
import ReviewForm from "./ReviewForm.jsx";
import StarRating from "./StarRating.jsx";
import ReviewSummary from "./ReviewSummary.jsx";
import ReviewText from "./ReviewText.jsx";
import { formatTimeAgo } from "../utils/timeUtils.js";
import { useCountUpOnView } from "../hooks/useCountUpOnView.js";

/**
 * Variation D - Carousel/Featured Reviews
 * Showcases featured reviews in a carousel with prominent social proof
 */
export default function ReviewsCarousel({ reviews, onAddReview }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Live counters
  const totalReviews = useCountUpOnView(reviews.length || 0, { duration: 900 });
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length
    : 4.8;
  const rating = useCountUpOnView(Number(avgRating.toFixed(1)), { duration: 900, decimals: 1 });
  const verifiedCount = useCountUpOnView(
    reviews.filter((r) => r.verified).length,
    { duration: 900 }
  );

  // Featured reviews (top rated with images)
  const featured = [...reviews]
    .filter((r) => r.rating >= 4.5 && r.image)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  // Fallback: top rated reviews if no featured reviews
  const fallback = [...reviews]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  const displayReviews = featured.length > 0 ? featured : fallback;

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying || displayReviews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayReviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, displayReviews.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000); // Resume after 10s
  };

  const currentReview = displayReviews[currentIndex] || displayReviews[0];

  return (
    <section className="reviews reviews--carousel">
      <div className="container">
        <div className="section-head">
          <h2>Variation D</h2>
          <p className="muted">Featured reviews carousel + live social proof.</p>
        </div>

        {/* Social Proof Banner */}
        <div className="social-proof-banner">
          <div className="social-proof-banner__item">
            <div className="social-proof-banner__icon">📦</div>
            <div>
              <div className="social-proof-banner__value" ref={totalReviews.ref}>
                {totalReviews.value}+
              </div>
              <div className="social-proof-banner__label">Happy Customers</div>
            </div>
          </div>
          <div className="social-proof-banner__item">
            <div className="social-proof-banner__icon">⭐</div>
            <div>
              <div className="social-proof-banner__value" ref={rating.ref}>
                {rating.value}/5
              </div>
              <div className="social-proof-banner__label">Average Rating</div>
            </div>
          </div>
          <div className="social-proof-banner__item">
            <div className="social-proof-banner__icon">✓</div>
            <div>
              <div className="social-proof-banner__value" ref={verifiedCount.ref}>
                {verifiedCount.value}
              </div>
              <div className="social-proof-banner__label">Verified Reviews</div>
            </div>
          </div>
        </div>

        {/* Main Carousel Section */}
        <div className="carousel-section">
          <div className="carousel-section__left">
            <ReviewSummary reviews={reviews} showDistribution={false} />
            <ReviewForm onAdd={onAddReview} />
          </div>

          <div className="carousel-section__right">
            <div className="carousel-container">
              <div className="carousel-header">
                <h3>Featured Reviews</h3>
                <div className="carousel-dots">
                  {displayReviews.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`carousel-dot ${idx === currentIndex ? "is-active" : ""}`}
                      onClick={() => goToSlide(idx)}
                      aria-label={`Go to review ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div className="carousel-slide">
                {currentReview && (
                  <div className="featured-review">
                    {currentReview.image && (
                      <div className="featured-review__image">
                        <img
                          src={currentReview.image}
                          alt={`Review by ${currentReview.name}`}
                        />
                      </div>
                    )}
                    <div className="featured-review__content">
                      <div className="featured-review__header">
                        <StarRating
                          rating={currentReview.rating}
                          size="large"
                          showNumber={true}
                        />
                        {currentReview.verified && (
                          <span className="verified-badge">✓ Verified Purchase</span>
                        )}
                      </div>
                      <div className="featured-review__text">
                        <ReviewText text={currentReview.text} maxLength={200} />
                      </div>
                      <div className="featured-review__author">
                        <strong>{currentReview.name}</strong>
                        <span className="muted"> • {formatTimeAgo(currentReview.createdAt)}</span>
                      </div>


                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              {displayReviews.length > 1 && (
                <div className="carousel-nav">
                  <button
                    type="button"
                    className="carousel-nav__btn"
                    onClick={() =>
                      goToSlide(
                        currentIndex === 0 ? displayReviews.length - 1 : currentIndex - 1
                      )
                    }
                    aria-label="Previous review"
                  >
                    ←
                  </button>
                  <span className="carousel-nav__info">
                    {currentIndex + 1} / {displayReviews.length}
                  </span>
                  <button
                    type="button"
                    className="carousel-nav__btn"
                    onClick={() => goToSlide((currentIndex + 1) % displayReviews.length)}
                    aria-label="Next review"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

