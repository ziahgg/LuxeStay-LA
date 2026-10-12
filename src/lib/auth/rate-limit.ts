import "server-only";

/**
 * Minimal fixed-window rate limiter for sign-in attempts.
 * In-memory: adequate for a single server process. For multi-instance or
 * serverless production deployments, back this with a shared store
 * (e.g. Redis) — see docs/DASHBOARD.md.
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const store = globalThis as typeof globalThis & { __lsLoginAttempts?: Map<string, { count: number; resetAt: number }> };
const attempts = (store.__lsLoginAttempts ??= new Map());

export function isRateLimited(key: string, now = Date.now()) {
  const entry = attempts.get(key);
  return !!entry && entry.resetAt > now && entry.count >= MAX_ATTEMPTS;
}

export function recordFailure(key: string, now = Date.now()) {
  const entry = attempts.get(key);
  if (!entry || entry.resetAt <= now) attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
  else entry.count += 1;
}

export function clearFailures(key: string) {
  attempts.delete(key);
}
