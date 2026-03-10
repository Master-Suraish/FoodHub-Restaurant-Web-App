import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";


export const authLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  message: {
    success: false,
    message: "Too many authentication attempts. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const publicLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const userLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 500,
  message: {
    success: false,
    message: "Too many requests from this user.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const adminLimiter: RateLimitRequestHandler = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: "Too many admin requests.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

