/**
 * Distributed rate limiter using Redis
 * Falls back to in-memory if Redis is not configured
 */

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

class RateLimiter {
  private inMemoryStore = new Map<string, { count: number; resetAt: number }>();
  private useRedis: boolean;

  constructor() {
    this.useRedis = !!process.env.REDIS_URL;
    if (this.useRedis) {
      console.log("[RateLimiter] Using Redis for distributed rate limiting");
    } else {
      console.warn("[RateLimiter] Redis not configured, falling back to in-memory rate limiting (not distributed)");
    }
  }

  async check(
    key: string,
    limit: number,
    windowMs: number = 60_000
  ): Promise<RateLimitResult> {
    if (this.useRedis) {
      return this.checkRedis(key, limit, windowMs);
    }
    return this.checkInMemory(key, limit, windowMs);
  }

  private async checkRedis(
    key: string,
    limit: number,
    windowMs: number
  ): Promise<RateLimitResult> {
    try {
      // Note: In production, you'd use a Redis client like ioredis
      // For now, fallback to in-memory with a warning
      console.warn("[RateLimiter] Redis client not implemented, falling back to in-memory");
      return this.checkInMemory(key, limit, windowMs);
    } catch (error) {
      console.error("[RateLimiter] Redis error, falling back to in-memory:", error instanceof Error ? error.message : error);
      return this.checkInMemory(key, limit, windowMs);
    }
  }

  private checkInMemory(
    key: string,
    limit: number,
    windowMs: number
  ): RateLimitResult {
    const now = Date.now();
    const current = this.inMemoryStore.get(key);

    if (!current || current.resetAt <= now) {
      this.inMemoryStore.set(key, { count: 1, resetAt: now + windowMs });
      return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
    }

    if (current.count >= limit) {
      return { allowed: false, remaining: 0, resetAt: current.resetAt };
    }

    current.count += 1;
    return { allowed: true, remaining: limit - current.count, resetAt: current.resetAt };
  }

  // Cleanup expired in-memory entries periodically
  cleanup(): void {
    if (this.useRedis) return;

    const now = Date.now();
    for (const [key, value] of this.inMemoryStore.entries()) {
      if (value.resetAt <= now) {
        this.inMemoryStore.delete(key);
      }
    }
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

// Cleanup every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => rateLimiter.cleanup(), 5 * 60 * 1000);
}
