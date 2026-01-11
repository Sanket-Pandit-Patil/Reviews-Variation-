import { useState } from "react";
import ReviewForm from "./ReviewForm.jsx";
import StarRating from "./StarRating.jsx";
import ReviewText from "./ReviewText.jsx";
import ReviewModal from "./ReviewModal.jsx";
import { useCountUpOnView } from "../hooks/useCountUpOnView.js";

export default function ReviewsTicker({ reviews = [], onAddReview }) {
  const [selectedReview, setSelectedReview] = useState(null);
  const orders = useCountUpOnView(912, { duration: 900 });
  const reco = useCountUpOnView(98, { duration: 900 });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length
      : 4.8;

  const rating = useCountUpOnView(Number(avgRating.toFixed(1)), { duration: 900, decimals: 1 });

  // Take top 6 reviews by rating for ticker (duplicate for seamless)
  const latest = [...reviews]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  const tickerItems = latest.length
    ? latest
    : [
        { id: "d1", rating: 5.0, text: "Chatpata is dangerously good — finished it in 3 days.", name: "Aditi" },
        { id: "d2", rating: 4.8, text: "Perfect with toast + onions. Peak snack.", name: "Rohan" },
        { id: "d3", rating: 5.0, text: "Finally a peanut butter that isn’t dessert.", name: "Neha" },
      ];

  return (
    <section className="reviews reviews--ticker">
      <div className="container">
        <div className="section-head">
          <h2>Variation A</h2>
          <p className="muted">Minimal ticker + quick stats + write review.</p>
        </div>

        {/* Write review */}
       <ReviewForm onAdd={onAddReview} allowImage={false} />

        <div style={{ height: 14 }} />

        {/* Ticker */}
        <div className="ticker">
          <div className="ticker__track">
            {[...tickerItems, ...tickerItems].map((r, idx) => (
              <div
                className="quote quote--clickable"
                key={`${r.id}-${idx}`}
                onClick={() => setSelectedReview(r)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedReview(r);
                  }
                }}
                aria-label={`View review by ${r.name}`}
              >
                <StarRating rating={r.rating} size="small" showNumber={true} />
                <div className="quote__text">
                  <ReviewText text={r.text} maxLength={100} />
                </div>
                <span className="by">— {r.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="wom-row">
          <div className="wom-box" ref={orders.ref}>
            <p className="wom-big">{orders.value}</p>
            <p className="muted">Orders shipped this month</p>
          </div>
          <div className="wom-box" ref={reco.ref}>
            <p className="wom-big">{reco.value}%</p>
            <p className="muted">Would recommend</p>
          </div>
          <div className="wom-box" ref={rating.ref}>
            <p className="wom-big">{rating.value}/5</p>
            <p className="muted">Average rating</p>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {selectedReview && (
        <ReviewModal review={selectedReview} onClose={() => setSelectedReview(null)} />
      )}
    </section>
  );
}
