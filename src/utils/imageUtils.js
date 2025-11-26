/**
 * Image URL Utility for Production Hosting
 * Handles image URLs when backend is localhost but frontend is hosted
 */

const PUBLIC_URL = process.env.PUBLIC_URL || '';

/**
 * Get the correct image URL for any hosting environment
 * This function is idempotent - safe to call multiple times on same URL
 * @param {string} imageUrl - Image URL from backend or database
 * @returns {string} - Corrected image URL
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return `${PUBLIC_URL}/bakery-icon-logo.png`; // Default fallback image
  }

  // If it's already a working external URL (not localhost), use it directly
  if (imageUrl.startsWith('http') && !imageUrl.includes('localhost')) {
    return imageUrl;
  }

  // If it already has PUBLIC_URL prefix, return as-is (idempotent)
  if (PUBLIC_URL && imageUrl.startsWith(PUBLIC_URL)) {
    return imageUrl;
  }

  // If it's a localhost URL, extract just the filename
  // Example: "http://localhost:5000/media/Midnight-Belgian-Chocolate-Cake.png"
  // Becomes: "/Midnight-Belgian-Chocolate-Cake.png"
  if (imageUrl.includes('localhost')) {
    const filename = imageUrl.split('/').pop();
    return `${PUBLIC_URL}/${filename}`;
  }

  // If it's a relative path starting with /media/, extract filename
  // Example: "/media/Midnight-Belgian-Chocolate-Cake.png"
  // Becomes: "/Midnight-Belgian-Chocolate-Cake.png"
  if (imageUrl.includes('/media/')) {
    const filename = imageUrl.split('/media/').pop();
    return `${PUBLIC_URL}/${filename}`;
  }

  // If it already starts with /, use PUBLIC_URL prefix
  if (imageUrl.startsWith('/')) {
    return `${PUBLIC_URL}${imageUrl}`;
  }

  // Otherwise, add leading slash and PUBLIC_URL
  return `${PUBLIC_URL}/${imageUrl}`;
};

/**
 * Format product with corrected image URL
 * @param {object} product - Product object from API
 * @returns {object} - Product with fixed image URL
 */
export const formatProductImage = (product) => {
  if (!product) return product;
  
  return {
    ...product,
    image: getImageUrl(product.image),
  };
};

/**
 * Format array of products with corrected image URLs
 * @param {Array} products - Array of product objects
 * @returns {Array} - Products with fixed image URLs
 */
export const formatProductsImages = (products) => {
  if (!Array.isArray(products)) return products;
  
  return products.map(formatProductImage);
};

export default {
  getImageUrl,
  formatProductImage,
  formatProductsImages,
};

