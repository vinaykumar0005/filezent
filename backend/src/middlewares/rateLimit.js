import rateLimit from "express-rate-limit";

export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,

  skip: (req) => {

    return req.method === "OPTIONS";
  },

  message: {
    message: "Too many OTP attempts. Try again later.",
  },
});
