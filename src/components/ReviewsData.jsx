import ReviewForm from "./ReviewForm.jsx";
import ReviewsFeed from "./ReviewsFeed.jsx";
import ReviewSummary from "./ReviewSummary.jsx";
import { useCountUpOnView } from "../hooks/useCountUpOnView.js";

export default function ReviewsData({ reviews, onAddReview }) {
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + Number(r.rating || 0), 0) / reviews.length
    : 4.8;

  const avg = useCountUpOnView(Number(avgRating.toFixed(1)), { decimals: 1 });
  const total = useCountUpOnView(reviews.length || 0, { decimals: 0 });

  // demo metric
  const withImages = reviews.filter((r) => Boolean(r.image)).length;
  const images = useCountUpOnView(withImages, { decimals: 0 });

  return (
    <section className="reviews reviews--data">
      <div className="container">
        <div className="section-head">
          <h2>Variation C</h2>
          <p className="muted">Modern dashboard + review management.</p>
        </div>

        <div className="data-modern">
          {/* Left: dashboard */}
          <div className="panel panel--soft">
            <div className="panel__title">
              <h3>Review dashboard</h3>
              <span className="muted">Live from submitted reviews</span>
            </div>

            <ReviewSummary reviews={reviews} showDistribution={true} />

            <div className="kpis">
              <div className="kpi" ref={avg.ref}>
                <div className="kpi__num">{avg.value}</div>
                <div className="kpi__label muted">Avg rating</div>
              </div>

              <div className="kpi" ref={total.ref}>
                <div className="kpi__num">{total.value}+</div>
                <div className="kpi__label muted">Total reviews</div>
              </div>

              <div className="kpi" ref={images.ref}>
                <div className="kpi__num">{images.value}</div>
                <div className="kpi__label muted">With images</div>
              </div>
            </div>

            <div className="panel__sub">
              <p className="muted">
                Tip: Add a review to see the stats update instantly (client-side demo).
              </p>
            </div>
          </div>

          {/* Right: form + comments */}
          <div className="panel panel--glass">
            <ReviewForm onAdd={onAddReview} />
            <div style={{ height: 14 }} />
            <ReviewsFeed 
              reviews={reviews} 
              mode="list" 
              initialCount={3} 
              step={3} 
              animated={false}
              showControls={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
