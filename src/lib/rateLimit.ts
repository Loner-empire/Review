// Database-backed rate limiter for serverless/production environments
import { query } from "@/lib/db";

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

// Rate limit store table must exist - run migration if needed
const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS rate_limits (
    identifier VARCHAR(255) NOT NULL,
    count INTEGER NOT NULL DEFAULT 1,
    reset_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (identifier)
  )
`;

async function ensureRateLimitTable(): Promise<void> {
  try {
    await query(CREATE_TABLE_SQL);
  } catch (error) {
    console.error("Failed to create rate_limits table:", error);
  }
}

export async function checkRateLimit(
  identifier: string,
  maxRequests: number = 5,
  windowMs: number = 60000
): Promise<RateLimitResult> {
  await ensureRateLimitTable();
  
  const now = new Date();
  const resetTime = new Date(now.getTime() + windowMs);

  try {
    // Try to get existing entry
    const existing = await query<{ count: number; reset_time: Date }>(
      "SELECT count, reset_time FROM rate_limits WHERE identifier = $1 AND reset_time > $2",
      [identifier, now.toISOString()]
    );

    if (existing.length === 0) {
      // New window - insert record
      await query(
        "INSERT INTO rate_limits (identifier, count, reset_time) VALUES ($1, 1, $2) ON CONFLICT (identifier) DO UPDATE SET count = 1, reset_time = $2",
        [identifier, resetTime.toISOString()]
      );
      
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: resetTime.getTime(),
      };
    }

    const entry = existing[0];
    
    if (entry.count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: new Date(entry.reset_time).getTime(),
      };
    }

    // Increment counter
    await query(
      "UPDATE rate_limits SET count = count + 1 WHERE identifier = $1",
      [identifier]
    );

    return {
      allowed: true,
      remaining: maxRequests - entry.count - 1,
      resetTime: new Date(entry.reset_time).getTime(),
    };
  } catch (error) {
    // If database fails, allow request but log error
    console.error("Rate limit check failed:", error);
    return {
      allowed: true,
      remaining: maxRequests,
      resetTime: resetTime.getTime(),
    };
  }
}

// Cleanup expired entries (call periodically)
export async function cleanupRateLimits(): Promise<number> {
  try {
    const result = await query<{ count: number }>(
      "DELETE FROM rate_limits WHERE reset_time < NOW() RETURNING count"
    );
    return result.length;
  } catch (error) {
    console.error("Rate limit cleanup failed:", error);
    return 0;
  }
}
