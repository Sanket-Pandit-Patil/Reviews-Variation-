import { useMemo, useState } from "react";
import StarRating from "./StarRating.jsx";

const MIN_TEXT_LENGTH = 8;
const MAX_TEXT_LENGTH = 500;

export default function ReviewForm({ onAdd, allowImage = true }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(4);
  const [text, setText] = useState("");
  const [preview, setPreview] = useState("");
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const ratingNumber = useMemo(() => {
    return Math.min(5, Math.max(1, rating));
  }, [rating]);

  const textLength = useMemo(() => text.trim().length, [text]);
  const remainingChars = MAX_TEXT_LENGTH - textLength;

  const canSubmit = useMemo(() => {
    return name.trim().length >= 2 && textLength >= MIN_TEXT_LENGTH && ratingNumber >= 1;
  }, [name, textLength, ratingNumber]);

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    switch (field) {
      case "name":
        if (value.trim().length < 2) {
          newErrors.name = "Name must be at least 2 characters";
        } else {
          delete newErrors.name;
        }
        break;
      case "text":
        if (value.trim().length < MIN_TEXT_LENGTH) {
          newErrors.text = `Review must be at least ${MIN_TEXT_LENGTH} characters`;
        } else if (value.trim().length > MAX_TEXT_LENGTH) {
          newErrors.text = `Review must be no more than ${MAX_TEXT_LENGTH} characters`;
        } else {
          delete newErrors.text;
        }
        break;
      case "email":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;
    }
    setErrors(newErrors);
  };

  function onPickFile(e) {
    if (!allowImage) return;

    const f = e.target.files?.[0];
    if (!f) {
      setPreview("");
      return;
    }
    if (!f.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      alert("Image too large. Max 2MB for this demo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result || ""));
    reader.readAsDataURL(f);
  }

  function submit(e) {
    e.preventDefault();
    
    // Validate all fields
    validateField("name", name);
    validateField("text", text);
    if (email) validateField("email", email);

    if (!canSubmit || Object.keys(errors).length > 0) return;

    const newReview = {
      id: crypto.randomUUID(),
      name: name.trim(),
      rating: Number(ratingNumber.toFixed(1)),
      text: text.trim(),
      verified: false,
      createdAt: Date.now(),
      image: allowImage ? preview || "" : "",
      email: email.trim() || "",
      helpfulCount: 0,
    };

    onAdd(newReview);

    // Reset form
    setName("");
    setRating(4);
    setText("");
    setPreview("");
    setEmail("");
    setErrors({});
    setIsFormVisible(false);
    
    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }

  if (!isFormVisible) {
    return (
      <div className="review-form-toggle">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setIsFormVisible(true)}
          aria-label="Open review form"
        >
          Write Review
        </button>
        {showSuccess && (
          <div className="success-message" role="alert" aria-live="polite">
            ✓ Review submitted successfully!
          </div>
        )}
      </div>
    );
  }

  return (
    <form className="review-form" onSubmit={submit}>
      <div className="review-form__head">
        <h3>Write a review</h3>
        <p className="muted">
          {allowImage
            ? "Text-only or add an image — both supported."
            : "Quick text review (no image upload)."}
        </p>
      </div>

      <div className="review-form__grid">
        <label className="field">
          <span className="field__label">Name *</span>
          <input
            className={`field__input ${errors.name ? "field__input--error" : ""}`}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              validateField("name", e.target.value);
            }}
            placeholder="Your name"
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <span className="field__error" id="name-error" role="alert">
              {errors.name}
            </span>
          )}
        </label>

        <label className="field">
          <span className="field__label">Rating *</span>
          <div className="field__rating">
            <StarRating
              rating={rating}
              interactive={true}
              onRatingChange={setRating}
              size="large"
            />
            <span className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              {rating} out of 5 stars
            </span>
          </div>
        </label>

        <label className="field field--full">
          <span className="field__label">
            Review * 
            <span className="field__char-count" style={{ 
              color: remainingChars < 50 ? "var(--accent2)" : "var(--muted)",
              fontWeight: remainingChars < 50 ? 600 : 400
            }}>
              {textLength}/{MAX_TEXT_LENGTH} characters
            </span>
          </span>
          <textarea
            className={`field__input field__textarea ${errors.text ? "field__input--error" : ""}`}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              validateField("text", e.target.value);
            }}
            placeholder="What did you like? Share your experience..."
            maxLength={MAX_TEXT_LENGTH}
            aria-invalid={errors.text ? "true" : "false"}
            aria-describedby={errors.text ? "text-error" : undefined}
          />
          {errors.text && (
            <span className="field__error" id="text-error" role="alert">
              {errors.text}
            </span>
          )}
          {textLength > 0 && textLength < MIN_TEXT_LENGTH && (
            <span className="field__hint">
              {MIN_TEXT_LENGTH - textLength} more character{MIN_TEXT_LENGTH - textLength !== 1 ? "s" : ""} needed
            </span>
          )}
        </label>

        <label className="field field--full">
          <span className="field__label">
            Email (optional)
            <span className="muted" style={{ fontSize: 11, marginLeft: 6 }}>
              For verification purposes only
            </span>
          </span>
          <input
            className={`field__input ${errors.email ? "field__input--error" : ""}`}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateField("email", e.target.value);
            }}
            placeholder="your.email@example.com"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <span className="field__error" id="email-error" role="alert">
              {errors.email}
            </span>
          )}
        </label>

        {/* IMAGE UPLOAD — ONLY IF ALLOWED */}
        {allowImage && (
          <label className="field field--full">
            <span className="field__label">Upload image (optional)</span>
            <input
              className="field__input"
              type="file"
              accept="image/*"
              onChange={onPickFile}
            />

            {preview && (
              <div className="image-preview">
                <img src={preview} alt="Uploaded preview" />
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => setPreview("")}
                >
                  Remove image
                </button>
              </div>
            )}
          </label>
        )}
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => {
            setIsFormVisible(false);
            setName("");
            setRating(4);
            setText("");
            setPreview("");
            setEmail("");
            setErrors({});
          }}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`btn btn--primary ${!canSubmit ? "is-disabled" : ""}`}
          disabled={!canSubmit}
        >
          Submit review
        </button>
      </div>
    </form>
  );
}
