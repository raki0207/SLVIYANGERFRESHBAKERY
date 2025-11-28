/**
 * Utility functions for time-based ordering restrictions
 */

/**
 * Check if the current time is within the allowed ordering hours
 * Orders are allowed from 9:00 AM to 10:00 PM
 * @returns {boolean} true if ordering is allowed, false otherwise
 */
export const isOrderingAllowed = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
  // 9:00 AM = 9 * 60 = 540 minutes
  // 10:00 PM = 22 * 60 = 1320 minutes
  const startTimeInMinutes = 9 * 60; // 9:00 AM
  const endTimeInMinutes = 22 * 60; // 10:00 PM (22:00)
  
  return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes;
};

/**
 * Get the next available ordering time
 * @returns {string} Formatted time string (e.g., "9:00 AM")
 */
export const getNextOrderingTime = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  
  const startTimeInMinutes = 9 * 60; // 9:00 AM
  const endTimeInMinutes = 22 * 60; // 10:00 PM
  
  // If before 9 AM, return 9:00 AM today
  if (currentTimeInMinutes < startTimeInMinutes) {
    return '9:00 AM';
  }
  
  // If after 10 PM, return 9:00 AM tomorrow
  if (currentTimeInMinutes >= endTimeInMinutes) {
    return '9:00 AM (tomorrow)';
  }
  
  return null; // Should not reach here if ordering is allowed
};

/**
 * Get a user-friendly message about ordering hours
 * @returns {string} Message about ordering availability
 */
export const getOrderingHoursMessage = () => {
  if (isOrderingAllowed()) {
    return 'Orders are accepted until 10:00 PM';
  }
  
  const nextTime = getNextOrderingTime();
  return `Ordering is currently closed. Orders are accepted from 9:00 AM to 10:00 PM. Next available time: ${nextTime}`;
};

/**
 * Get the ordering hours range as a formatted string
 * @returns {string} e.g., "9:00 AM - 10:00 PM"
 */
export const getOrderingHoursRange = () => {
  return '9:00 AM - 10:00 PM';
};

