/**
 * Utility functions for handling review images
 */

// Available images from public/assets folder
export const AVAILABLE_IMAGES = [
  "/assets/maska-chatpata.jpg",
  "/assets/Butter.jpg",
  "/assets/maska.jpg",
];

/**
 * Get a random image from available assets
 * Useful for fallbacks or when generating demo data
 */
export function getRandomImage() {
  return AVAILABLE_IMAGES[Math.floor(Math.random() * AVAILABLE_IMAGES.length)];
}

/**
 * Get default fallback image
 */
export function getDefaultImage() {
  return "/assets/maska-chatpata.jpg";
}

/**
 * Check if an image path is valid (exists in our assets)
 */
export function isValidImagePath(path) {
  if (!path) return false;
  return AVAILABLE_IMAGES.includes(path) || path.startsWith("data:image");
}

