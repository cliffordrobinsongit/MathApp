/**
 * Cache Module - Unified Interface
 *
 * Re-exports all cache-related utilities for easy importing.
 */

const MemoryCache = require('./memoryCache');
const hintCacheService = require('./hintCacheService');

module.exports = {
  MemoryCache,
  ...hintCacheService
};
