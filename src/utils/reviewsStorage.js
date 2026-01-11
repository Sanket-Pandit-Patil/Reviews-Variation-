const KEY = "maska_reviews_v1";

export function loadReviews(fallback) {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

export function saveReviews(reviews) {
  try {
    localStorage.setItem(KEY, JSON.stringify(reviews));
  } catch {
    // ignore
  }
}
