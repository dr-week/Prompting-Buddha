const LAYA_DEFAULT_URL = "http://127.0.0.1:8000/predict";
const TIMEOUT_MS = 150;
const MAX_CACHE_SIZE = 500;

const cache = new Map<string, any>();

/**
 * Predict decision using Laya System 1 Decision Engine.
 * Features:
 * - Sub-150ms timeout with AbortController
 * - LRU/Map in-memory cache
 * - Graceful fallback returning null on any network failure or timeout
 */
export async function predictLaya(
  text: string,
  schema: Record<string, any>
): Promise<any | null> {
  const trimmed = typeof text === "string" ? text.trim() : "";
  if (!trimmed || !schema || Object.keys(schema).length === 0) {
    return null;
  }

  const cacheKey = `${trimmed}::${JSON.stringify(schema)}`;
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey);
    // Refresh LRU order
    cache.delete(cacheKey);
    cache.set(cacheKey, cached);
    return cached;
  }

  const url = process.env.LAYA_SERVICE_URL || LAYA_DEFAULT_URL;
  const controller = new AbortController();
  const timer = setTimeout(() => {
    try {
      controller.abort();
    } catch {
      // Ignore abort errors
    }
  }, TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        state: trimmed,
        questions: schema,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    // Cache management with max size eviction
    if (cache.size >= MAX_CACHE_SIZE) {
      const oldestKey = cache.keys().next().value;
      if (oldestKey !== undefined) {
        cache.delete(oldestKey);
      }
    }
    cache.set(cacheKey, data);

    return data;
  } catch {
    // Graceful error handling: return null to prevent app crash
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Utility to clear the in-memory cache (primarily for tests).
 */
export function clearLayaCache(): void {
  cache.clear();
}

/**
 * Utility to inspect cache size (primarily for tests).
 */
export function getLayaCacheSize(): number {
  return cache.size;
}
