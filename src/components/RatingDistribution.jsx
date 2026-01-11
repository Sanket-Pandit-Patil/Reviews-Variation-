/**
 * RatingDistribution - Visual bar chart showing rating breakdown
 */
export default function RatingDistribution({ reviews }) {
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  const total = reviews.length;

  reviews.forEach((review) => {
    const rating = Math.round(review.rating);
    if (rating >= 1 && rating <= 5) {
      distribution[rating]++;
    }
  });

  const getPercentage = (count) => (total > 0 ? (count / total) * 100 : 0);

  return (
    <div className="rating-distribution">
      <h4 className="rating-distribution__title">Rating Distribution</h4>
      <div className="rating-distribution__bars">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = distribution[rating];
          const percentage = getPercentage(count);
          return (
            <div key={rating} className="rating-distribution__bar">
              <span className="rating-distribution__label">{rating}★</span>
              <div className="rating-distribution__track">
                <div
                  className="rating-distribution__fill"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="rating-distribution__count">{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

