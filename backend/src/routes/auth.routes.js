import express from "express";

import {
  register,
  login,
  forgotPassword,
  resetPassword,
  sendRegisterOtp,
  verifyRegisterOtp,
} from "../controllers/auth.controller.js";

import { otpLimiter } from "../middlewares/rateLimit.js";

const router = express.Router();

/* ============================
   REGISTER WITH OTP
============================ */

router.post("/register/send-otp", sendRegisterOtp);
router.post("/register/verify-otp", otpLimiter, verifyRegisterOtp);
router.post("/register", register);

/* ============================
   LOGIN
============================ */

router.post("/login", login);

/* ============================
   PASSWORD RESET
============================ */

router.post("/forgot-password", otpLimiter, forgotPassword);
router.post("/reset-password", otpLimiter, resetPassword);

export default router;
