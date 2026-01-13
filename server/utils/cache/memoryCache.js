/**
 * In-Memory Cache with TTL
 *
 * Simple cache implementation using Map with automatic expiration.
 * Resets on server restart.
 */

class MemoryCache {
  constructor() {
    this.cache = new Map();
    this.timers = new Map(); // Store timeout references for cleanup
  }

  /**
   * Set a value in the cache with optional TTL
   * @param {string} key - Cache key
   * @param {*} value - Value to cache
   * @param {number} ttl - Time to live in milliseconds (default: 1 hour)
   */
  set(key, value, ttl = 60 * 60 * 1000) {
    // Clear existing timer if key already exists
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
    }

    // Set the value
    this.cache.set(key, value);

    // Set expiration timer
    const timer = setTimeout(() => {
      this.delete(key);
    }, ttl);

    this.timers.set(key, timer);
  }

  /**
   * Get a value from the cache
   * @param {string} key - Cache key
   * @returns {*} Cached value or undefined if not found
   */
  get(key) {
    return this.cache.get(key);
  }

  /**
   * Check if a key exists in the cache
   * @param {string} key - Cache key
   * @returns {boolean} True if key exists
   */
  has(key) {
    return this.cache.has(key);
  }

  /**
   * Delete a value from the cache
   * @param {string} key - Cache key
   */
  delete(key) {
    // Clear timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key));
      this.timers.delete(key);
    }

    // Delete value
    this.cache.delete(key);
  }

  /**
   * Clear all values from the cache
   */
  clear() {
    // Clear all timers
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }

    this.timers.clear();
    this.cache.clear();
  }

  /**
   * Get the number of items in the cache
   * @returns {number} Cache size
   */
  size() {
    return this.cache.size;
  }
}

module.exports = MemoryCache;
