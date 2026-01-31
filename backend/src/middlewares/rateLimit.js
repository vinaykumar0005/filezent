import rateLimit from "express-rate-limit";

export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  standardHeaders: true,
  legacyHeaders: false,

  skip: (req) => {
    // Allow preflight requests
    return req.method === "OPTIONS";
  },

  message: {
    message: "Too many OTP attempts. Try again later.",
  },
});
