import { useEffect } from "react";

/**
 * ImageLightbox - Modal for viewing images in full size
 */
export default function ImageLightbox({ image, alt, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!image) return null;

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label="Image lightbox">
      <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
        <button
          className="lightbox__close"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          ×
        </button>
        <img src={image} alt={alt} className="lightbox__image" />
      </div>
    </div>
  );
}

