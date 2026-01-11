import { useEffect, useMemo, useState } from "react";
import ReviewsTicker from "./ReviewsTicker.jsx";
import ReviewsMedia from "./ReviewsMedia.jsx";
import ReviewsData from "./ReviewsData.jsx";
import ReviewsCarousel from "./ReviewsCarousel.jsx";
import { reviewsSeed } from "../data/reviewsSeed.js";
import { loadReviews, saveReviews } from "../utils/reviewsStorage.js";

export default function ReviewsSwitch() {
  const [active, setActive] = useState("A");

  const [reviews, setReviews] = useState(() => loadReviews(reviewsSeed));

  useEffect(() => {
    saveReviews(reviews);
  }, [reviews]);

  function addReview(r) {
    setReviews((prev) => [r, ...prev]);
  }

  const items = useMemo(
    () => [
      { key: "A", label: "Variation A · Ticker", desc: "Minimal + fast social proof" },
      { key: "B", label: "Variation B · Media", desc: "UGC wall + upload" },
      { key: "C", label: "Variation C · Data", desc: "Dashboard + show more" },
      { key: "D", label: "Variation D · Carousel", desc: "Featured reviews + live stats" },
    ],
    []
  );

  return (
    <section className="reviews-switch" id="reviews">
      <div className="container">
        <div className="section-head">
          <h2>Reviews</h2>
          <p className="muted">Switch between 4 creative variations.</p>
        </div>

        <div className="review-tabs" role="tablist" aria-label="Review variations">
          {items.map((it) => (
            <button
              key={it.key}
              type="button"
              role="tab"
              aria-selected={active === it.key}
              className={`tab-btn ${active === it.key ? "is-active" : ""}`}
              onClick={() => setActive(it.key)}
            >
              <span className="tab-title">{it.label}</span>
              <span className="tab-desc">{it.desc}</span>
            </button>
          ))}
        </div>

        <div className="tab-panel" role="tabpanel">
          {active === "A" && <ReviewsTicker reviews={reviews} onAddReview={addReview} />}
          {active === "B" && <ReviewsMedia reviews={reviews} onAddReview={addReview} />}
          {active === "C" && <ReviewsData reviews={reviews} onAddReview={addReview} />}
          {active === "D" && <ReviewsCarousel reviews={reviews} onAddReview={addReview} />}
        </div>
      </div>
    </section>
  );
}
