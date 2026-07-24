const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

// In-memory: fine for a single long-running Node process (pm2/Docker), as this
// site is deployed. Would need a shared store if ever run across multiple instances.
const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(key, timestamps);
    return true;
  }

  timestamps.push(now);
  hits.set(key, timestamps);
  return false;
}
