import express from "express";
import { register, login, forgotPassword, resetPassword, } from "../controllers/auth.controller.js";
import {
  sendRegisterOtp,
  verifyRegisterOtp,
} from "../controllers/auth.controller.js";
import { otpLimiter } from "../middlewares/ratelimit.js";



const router = express.Router();

router.post("/register", register);
router.post("/register/send-otp", sendRegisterOtp);
router.post("/login", login);
router.post("/register/verify-otp", otpLimiter, verifyRegisterOtp);
router.post("/forgot-password", otpLimiter, forgotPassword);
router.post("/reset-password", otpLimiter, resetPassword);




export default router;
