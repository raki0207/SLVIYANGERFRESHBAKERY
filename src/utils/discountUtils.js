/**
 * Calculate discount percentage based on original price and current price
 * @param {number} originalPrice - The original price of the product
 * @param {number} currentPrice - The current/discounted price of the product
 * @returns {number} - The discount percentage (rounded to nearest integer), or 0 if no discount
 */
export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || !currentPrice || originalPrice <= 0 || currentPrice <= 0) {
    return 0;
  }
  
  if (currentPrice >= originalPrice) {
    return 0;
  }
  
  const discount = ((originalPrice - currentPrice) / originalPrice) * 100;
  return Math.round(discount);
};

/**
 * Get discount for a product object
 * @param {Object} product - Product object with originalPrice and price properties
 * @returns {number} - The discount percentage
 */
export const getProductDiscount = (product) => {
  if (!product) return 0;
  
  const originalPrice = product.originalPrice || 0;
  const currentPrice = product.price || 0;
  
  return calculateDiscount(originalPrice, currentPrice);
};

/**
 * Check if a product has a discount
 * @param {Object} product - Product object with originalPrice and price properties
 * @returns {boolean} - True if product has a discount
 */
export const hasDiscount = (product) => {
  return getProductDiscount(product) > 0;
};

