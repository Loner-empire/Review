// Simple in-memory rate limiter for form submissions.
// For production scale, replace with Redis (e.g. upstash/ratelimit).

const requests = new Map<string, { count: number; resetAt: number }>();

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = requests.get(identifier);

  if (!entry || now > entry.resetAt) {
    requests.set(identifier, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, remaining: options.maxRequests - 1 };
  }

  if (entry.count >= options.maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: options.maxRequests - entry.count };
}

// Clean up old entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requests.entries()) {
    if (now > value.resetAt) {
      requests.delete(key);
    }
  }
}, 60 * 1000);
