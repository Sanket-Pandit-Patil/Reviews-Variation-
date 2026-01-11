import { useEffect, useMemo, useRef, useState } from "react";
import { formatTimeAgo, formatFullDate } from "../utils/timeUtils.js";
import StarRating from "./StarRating.jsx";
import ImageLightbox from "./ImageLightbox.jsx";
import ReviewText from "./ReviewText.jsx";

export default function ReviewsFeed({
  reviews,
  mode = "list", // "list" or "media"

  // For list mode (Option C)
  initialCount = 3,
  step = 3,
  animated = false,

  // For media mode (Option B)
  pagination = false,
  pageSize = 6,

  // Optional filter
  showImageOnlyToggle = false,
  showControls = true,
  onAddReply = null
}) {
  // LIST MODE state
  const [visibleCount, setVisibleCount] = useState(initialCount);

  // MEDIA MODE state
  const [page, setPage] = useState(1);

  // Shared state
  const [imageOnly, setImageOnly] = useState(false);
  const [sortBy, setSortBy] = useState("highest"); // "newest", "highest", "lowest" - default to highest
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState(0); // 0 = all, 1-5 = specific rating
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [helpfulReviews, setHelpfulReviews] = useState(() => {
    // Load from localStorage or initialize
    try {
      const stored = localStorage.getItem("helpfulReviews");
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  });

  // For list animation
  const listWrapRef = useRef(null);
  const [maxH, setMaxH] = useState(null);

  // Save helpful reviews to localStorage
  useEffect(() => {
    localStorage.setItem("helpfulReviews", JSON.stringify(helpfulReviews));
  }, [helpfulReviews]);

  const toggleHelpful = (reviewId) => {
    setHelpfulReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const filtered = useMemo(() => {
    let result = [...reviews];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.text.toLowerCase().includes(query) ||
          r.name.toLowerCase().includes(query)
      );
    }

    // Image filter
    if (showImageOnlyToggle && imageOnly) {
      result = result.filter((r) => Boolean(r.image));
    }

    // Rating filter
    if (ratingFilter > 0) {
      result = result.filter((r) => Math.round(r.rating) === ratingFilter);
    }

    // Verified filter
    if (verifiedOnly) {
      result = result.filter((r) => r.verified);
    }

    // Sort - default to highest rating first
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "lowest":
        result.sort((a, b) => a.rating - b.rating);
        break;
      case "highest":
      default:
        result.sort((a, b) => b.rating - a.rating);
        break;
    }

    return result;
  }, [reviews, imageOnly, showImageOnlyToggle, searchQuery, ratingFilter, verifiedOnly, sortBy]);

  // If filter changes, reset pagination + list count nicely
  useEffect(() => {
    setPage(1);
    setVisibleCount(initialCount);
  }, [imageOnly, initialCount]);

  // ======= MEDIA (Pagination) =======
  const totalPages = useMemo(() => {
    if (!pagination || mode !== "media") return 1;
    return Math.max(1, Math.ceil(filtered.length / pageSize));
  }, [filtered.length, pagination, mode, pageSize]);

  // Keep page in range when data changes
  useEffect(() => {
    if (mode !== "media" || !pagination) return;
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages, mode, pagination]);

  const mediaVisible = useMemo(() => {
    if (mode !== "media") return [];
    if (!pagination) return filtered.slice(0, pageSize); // fallback
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, mode, pagination, page, pageSize]);

  // ======= LIST (Show more/less) =======
  const listVisible = useMemo(() => {
    if (mode !== "list") return [];
    return filtered.slice(0, visibleCount);
  }, [filtered, mode, visibleCount]);

  const canShowMore = mode === "list" && visibleCount < filtered.length;
  const canShowLess = mode === "list" && visibleCount > initialCount;

  // Smooth height animation for list mode when visibleCount changes
  useEffect(() => {
    if (!animated || mode !== "list") return;
    const el = listWrapRef.current;
    if (!el) return;

    // set max-height to current height first, then to new scrollHeight
    const next = el.scrollHeight;
    setMaxH(next);

    // after transition ends, set max-height to "none" so it can grow naturally
    const onEnd = () => setMaxH(null);
    el.addEventListener("transitionend", onEnd, { once: true });

    // cleanup in case
    return () => el.removeEventListener("transitionend", onEnd);
  }, [visibleCount, animated, mode, filtered.length]);

  const hasFilters = searchQuery || ratingFilter > 0 || verifiedOnly || (showImageOnlyToggle && imageOnly);

  const [expandedReplies, setExpandedReplies] = useState({});

  const toggleReplies = (reviewId) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const [replyInputOpen, setReplyInputOpen] = useState(null); // reviewId being replied to
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = (reviewId) => {
    if (!replyText.trim()) return;
    if (onAddReply) {
      onAddReply(reviewId, replyText);
      setReplyInputOpen(null);
      setReplyText("");
    }
  };

  return (
    <div className="reviews-feed">
      {showControls && (
        <div className="feed-controls">
          {/* Search */}
          <div className="feed-controls__search">
            <input
              type="text"
              className="feed-controls__input"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search reviews"
            />
          </div>

          {/* Sort */}
          <select
            className="feed-controls__select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort reviews"
          >
            <option value="newest">Newest first</option>
            <option value="highest">Highest rating</option>
            <option value="lowest">Lowest rating</option>
          </select>

          {/* Filters */}
          <div className="feed-controls__filters">
            {showImageOnlyToggle && (
              <button
                type="button"
                className={`btn btn--secondary ${imageOnly ? "is-active" : ""}`}
                onClick={() => setImageOnly((v) => !v)}
              >
                {imageOnly ? "âœ“ Images only" : "Images only"}
              </button>
            )}

            <button
              type="button"
              className={`btn btn--secondary ${verifiedOnly ? "is-active" : ""}`}
              onClick={() => setVerifiedOnly((v) => !v)}
            >
              {verifiedOnly ? "âœ“ Verified only" : "Verified only"}
            </button>

            <select
              className="feed-controls__select feed-controls__select--small"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(Number(e.target.value))}
              aria-label="Filter by rating"
            >
              <option value={0}>All ratings</option>
              <option value={5}>5 stars</option>
              <option value={4}>4 stars</option>
              <option value={3}>3 stars</option>
              <option value={2}>2 stars</option>
              <option value={1}>1 star</option>
            </select>
          </div>

          {/* Results count */}
          <div className="feed-controls__count">
            <span className="muted">
              {filtered.length} review{filtered.length !== 1 ? "s" : ""}
              {hasFilters && filtered.length !== reviews.length && (
                <span className="muted" style={{ marginLeft: 6 }}>
                  (of {reviews.length})
                </span>
              )}
            </span>
            {hasFilters && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setSearchQuery("");
                  setRatingFilter(0);
                  setVerifiedOnly(false);
                  setImageOnly(false);
                }}
                style={{ fontSize: 12, padding: "6px 10px" }}
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="empty-state">
          <p className="empty-state__text">
            {hasFilters
              ? "No reviews match your filters. Try adjusting your search or filters."
              : "No reviews yet. Be the first to write a review!"}
          </p>
        </div>
      )}

      {/* ========= MEDIA MODE (Option B) ========= */}
      {mode === "media" && (
        <>
          <div className="media-feed">
            {mediaVisible.map((r) => (
              <article key={r.id} className="ugc">
                <div className="ugc__media">
                  <img
                    src={r.image || "/assets/maska-chatpata.jpg"}
                    alt={`Review by ${r.name}`}
                    onClick={() => r.image && setLightboxImage({ src: r.image, alt: `Review image by ${r.name}` })}
                    style={{ cursor: r.image ? "pointer" : "default" }}
                  />
                  <span className="badge">
                    {r.image ? "Customer photo" : "Text review"}
                  </span>
                </div>

                <div className="ugc__body">
                  <p className="ugc__headline">
                    "{r.text.slice(0, 42)}
                    {r.text.length > 42 ? "â€¦" : ""}"
                  </p>
                  <ReviewText text={r.text} maxLength={150} />

                  <div className="ugc__meta">
                    <StarRating rating={r.rating} size="small" showNumber={true} />
                    <span className="by">
                      â€” {r.name}
                      {r.verified && <span className="verified-badge">âœ“ Verified</span>}
                    </span>
                    <span className="ugc__time" title={formatFullDate(r.createdAt)}>
                      {formatTimeAgo(r.createdAt)}
                    </span>
                  </div>


                  <div className="ugc__actions">
                    <button
                      type="button"
                      className={`btn btn--ghost btn--small ${helpfulReviews[r.id] ? "is-active" : ""}`}
                      onClick={() => toggleHelpful(r.id)}
                      aria-label={`Mark review as ${helpfulReviews[r.id] ? "not " : ""}helpful`}
                    >
                      {helpfulReviews[r.id] ? "âœ“" : ""} Helpful
                    </button>


                    {/* Reply Input Form */}
                    {replyInputOpen === r.id && (
                      <div className="reply-input">
                        <textarea
                          className="field__input field__textarea"
                          rows="2"
                          placeholder="Write a reply..."
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                        />
                        <div className="reply-actions">
                          <button className="btn btn--primary btn--small" onClick={() => handleReplySubmit(r.id)}>Post Reply</button>
                          <button className="btn btn--ghost btn--small" onClick={() => setReplyInputOpen(null)}>Cancel</button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {pagination && filtered.length > 0 && (
            <div className="pager">
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Prev
              </button>

              <span className="muted pager__info">
                Page <b>{page}</b> of <b>{totalPages}</b>
              </span>

              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* ========= LIST MODE (Option C) ========= */}
      {mode === "list" && (
        <>
          <div
            ref={listWrapRef}
            className={`comments-anim ${animated ? "is-animated" : "is-scrollable"}`}
            style={animated && maxH ? { maxHeight: `${maxH}px` } : undefined}
          >
            <div className="comments-stack">
              {listVisible.map((r) => (
                <div key={r.id} className="comment">
                  <div className="comment__top">
                    <StarRating rating={r.rating} size="small" showNumber={true} />
                    <div className="comment__meta">
                      <span className="comment__author">
                        <b>{r.name}</b>
                        {r.verified && <span className="verified-badge">âœ“ Verified</span>}
                      </span>
                      <span className="comment__time" title={formatFullDate(r.createdAt)}>
                        {formatTimeAgo(r.createdAt)}
                      </span>
                    </div>
                  </div>

                  <ReviewText text={r.text} maxLength={200} />

                  {r.image && (
                    <div className="comment-image">
                      <img
                        src={r.image}
                        alt={`Review image by ${r.name}`}
                        onClick={() => setLightboxImage({ src: r.image, alt: `Review image by ${r.name}` })}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  )}

                  {/* Threaded Replies Block */}
                  {r.replies && r.replies.length > 0 && (
                    <div className="reply-thread">
                      {/* Show first reply (or all if expanded) */}
                      {(expandedReplies[r.id] ? r.replies : r.replies.slice(0, 1)).map((reply) => (
                        <div key={reply.id} className="reply-block">
                          <div className="reply-header">
                            <span className="reply-author">{reply.author}</span>
                            {reply.author === "Maska Team" && <span className="reply-badge">Brand</span>}
                            <span className="reply-time muted" style={{ fontSize: 11, marginLeft: 'auto' }}>
                              {formatTimeAgo(reply.createdAt)}
                            </span>
                          </div>
                          <p className="reply-text">{reply.text}</p>
                        </div>
                      ))}

                      {/* Toggle Button */}
                      {r.replies.length > 1 && (
                        <button
                          className="btn-link-reply"
                          onClick={() => toggleReplies(r.id)}
                        >
                          {expandedReplies[r.id]
                            ? "Hide replies"
                            : `View ${r.replies.length - 1} more repl${r.replies.length - 1 === 1 ? 'y' : 'ies'}`}
                        </button>
                      )}
                    </div>
                  )}

                  <div className="comment__actions">
                    <button
                      type="button"
                      className={`btn btn--ghost btn--small ${helpfulReviews[r.id] ? "is-active" : ""}`}
                      onClick={() => toggleHelpful(r.id)}
                      aria-label={`Mark review as ${helpfulReviews[r.id] ? "not " : ""}helpful`}
                    >
                      {helpfulReviews[r.id] ? "âœ“" : ""} Helpful
                    </button>
                    {onAddReply && (
                      <button
                        type="button"
                        className="btn btn--ghost btn--small"
                        onClick={() => {
                          setReplyInputOpen(r.id);
                          setReplyText("");
                        }}
                      >
                        Reply
                      </button>
                    )}
                  </div>

                  {/* Reply Input Form */}
                  {replyInputOpen === r.id && (
                    <div className="reply-input">
                      <textarea
                        className="field__input field__textarea"
                        rows="2"
                        placeholder="Write a reply..."
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                      />
                      <div className="reply-actions">
                        <button className="btn btn--primary btn--small" onClick={() => handleReplySubmit(r.id)}>Post Reply</button>
                        <button className="btn btn--ghost btn--small" onClick={() => setReplyInputOpen(null)}>Cancel</button>
                      </div>
                    </div>
                  )}


                </div>
              ))}
            </div>
          </div>

          <div className="feed-actions">
            {canShowMore && (
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() =>
                  setVisibleCount((c) => Math.min(c + step, filtered.length))
                }
              >
                Show more
              </button>
            )}

            {!canShowMore && canShowLess && (
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => setVisibleCount(initialCount)}
              >
                Show less
              </button>
            )}

            {!canShowMore && !canShowLess && (
              <span className="muted">Youâ€™re all caught up.</span>
            )}
          </div>
        </>
      )}

      {/* Image Lightbox */}
      {lightboxImage && (
        <ImageLightbox
          image={lightboxImage.src}
          alt={lightboxImage.alt}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
}
