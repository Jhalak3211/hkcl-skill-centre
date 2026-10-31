/**
 * Rate Limiting Middleware for Sensitive Admin Authentication
 * Enforces sliding-window rate limits by client IP and login identifier.
 * Protects against brute-force password guessing.
 */

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;            // Max attempts within window

// In-memory record store: key -> { count: number, resetTime: number }
const attemptsStore = new Map();

/**
 * Clean up expired records periodically
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of attemptsStore.entries()) {
    if (now > record.resetTime) {
      attemptsStore.delete(key);
    }
  }
}, 5 * 60 * 1000).unref?.();

/**
 * Rate limiting middleware for Admin login
 */
export function adminLoginRateLimiter(req, res, next) {
  // Allow test suites to bypass if explicitly requested in test environment
  if (process.env.NODE_ENV === 'test' && req.headers['x-bypass-rate-limit'] === 'true') {
    return next();
  }

  const clientIp =
    req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  const identifier = (req.body?.identifier || '').toString().trim().toLowerCase();
  const key = `admin_login:${clientIp}:${identifier || 'anonymous'}`;

  const now = Date.now();
  let record = attemptsStore.get(key);

  if (!record || now > record.resetTime) {
    record = { count: 0, resetTime: now + WINDOW_MS };
    attemptsStore.set(key, record);
  }

  if (record.count >= MAX_ATTEMPTS) {
    const retryAfterSec = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
    res.setHeader('Retry-After', retryAfterSec);
    return res.status(429).json({
      success: false,
      code: 'RATE_LIMIT_EXCEEDED',
      error: `Too many login attempts. For security reasons, please wait ${Math.ceil(
        retryAfterSec / 60
      )} minute(s) before trying again.`,
      retryAfter: retryAfterSec,
    });
  }

  // Increment attempts counter
  record.count += 1;

  // Function to reset rate limit on successful authentication
  res.on('finish', () => {
    if (res.statusCode === 200) {
      attemptsStore.delete(key);
    }
  });

  next();
}

/**
 * Utility to clear rate limits (useful for testing)
 */
export function clearRateLimits() {
  attemptsStore.clear();
}
