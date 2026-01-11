/**
 * Generate array of star states (filled, half, empty)
 */
export function getStarStates(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return {
    full: fullStars,
    half: hasHalfStar ? 1 : 0,
    empty: emptyStars,
  };
}

/**
 * Render star rating component data
 */
export function getStarRatingData(rating) {
  const states = getStarStates(rating);
  const stars = [];

  for (let i = 0; i < states.full; i++) {
    stars.push({ type: "full", index: i });
  }
  if (states.half > 0) {
    stars.push({ type: "half", index: states.full });
  }
  for (let i = 0; i < states.empty; i++) {
    stars.push({ type: "empty", index: states.full + states.half + i });
  }

  return stars;
}

