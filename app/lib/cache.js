const cache = new Map();

/**
 * Retrieve cached data by key.
 * @param {string} key - The cache key.
 * @returns {any|null} - Cached data or null if not found or expired.
 */
export function getCache(key) {
  const cachedData = cache.get(key);
  if (cachedData && cachedData.expiry > Date.now()) {
    return cachedData.value;
  }
  return null;
}

/**
 * Store data in the cache.
 * @param {string} key - The cache key.
 * @param {any} value - Data to cache.
 * @param {number} ttl - Time-to-live in milliseconds.
 */
export function setCache(key, value, ttl) {
  const expiry = Date.now() + ttl;
  cache.set(key, { value, expiry });
}

export default cache;
