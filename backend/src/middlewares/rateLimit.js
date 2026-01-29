import rateLimit from "express-rate-limit";

export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // max 10 requests per 15 min
  message: {
    message: "Too many OTP requests. Try later.",
  },
});
