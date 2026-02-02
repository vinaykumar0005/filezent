import User from "../models/User.js";
import Otp from "../models/Otp.js";
import RegisterOtp from "../models/RegisterOtp.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { sendMail } from "../config/mail.js";

import {
  OTP_MAX_ATTEMPTS,
  OTP_LOCK_TIME,
} from "../config/security.js";


/* =========================
   REGISTER
========================= */
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const cleanEmail = email?.trim().toLowerCase();

    const exists = await User.findOne({ email: cleanEmail });

    if (exists) {
      return res.status(409).json({ message: "USER_EXISTS" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email: cleanEmail,
      password: hashed,
    });

    res.json({ success: true });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Register failed" });
  }
};



/* =========================
   SEND REGISTER OTP
========================= */
export const sendRegisterOtp = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "User already registered",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await RegisterOtp.deleteMany({ email });

    await RegisterOtp.create({
      email,
      otp,
      attempts: 0,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendMail({
      to: email,
      subject: "Verify Your Filezent Account",
      html: `
        <h2>Email Verification</h2>
        <h1>${otp}</h1>
        <p>Valid for 10 minutes</p>
      `,
    });

    res.json({ success: true });

  } catch (err) {
    console.error("Register OTP Error:", err);
    res.status(500).json({ message: "OTP send failed" });
  }
};



/* =========================
   VERIFY REGISTER OTP
========================= */
export const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp, name, password } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    const record = await RegisterOtp.findOne({ email: cleanEmail });

    if (!record) {
      return res.status(400).json({ message: "OTP not found" });
    }

    if (record.lockedUntil > Date.now()) {
      return res.status(429).json({
        message: "Too many attempts. Try later.",
      });
    }

    if (record.expiresAt < Date.now()) {
      await RegisterOtp.deleteOne({ email: cleanEmail });

      return res.status(400).json({
        message: "OTP expired",
      });
    }

    if (record.otp !== otp) {
      record.attempts++;

      if (record.attempts >= OTP_MAX_ATTEMPTS) {
        record.lockedUntil = new Date(
          Date.now() + OTP_LOCK_TIME
        );
      }

      await record.save();

      return res.status(400).json({ message: "Invalid OTP" });
    }

    await RegisterOtp.deleteOne({ email: cleanEmail });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: cleanEmail,
      password: hashed,
    });

    res.json({
      success: true,
      user,
    });

  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ message: "Verification failed" });
  }
};



/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({ message: "INVALID_CREDENTIALS" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "INVALID_CREDENTIALS" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
};



/* =========================
   FORGOT PASSWORD
========================= */
export const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    await Otp.deleteMany({ email });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.create({
      email,
      otp,
      attempts: 0,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await sendMail({
      to: email,
      subject: "Filezent Password Reset OTP",
      html: `<h2>Your OTP: ${otp}</h2>`,
    });

    res.json({ success: true });

  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ message: "OTP send failed" });
  }
};



/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    const record = await Otp.findOne({
      email: cleanEmail,
      expiresAt: { $gt: Date.now() },
    });

    if (!record) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (record.lockedUntil > Date.now()) {
      return res.status(429).json({ message: "Try later" });
    }

    if (record.otp !== otp) {
      record.attempts++;

      if (record.attempts >= 5) {
        record.lockedUntil = new Date(
          Date.now() + 15 * 60 * 1000
        );
      }

      await record.save();

      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { email: cleanEmail },
      { password: hashed }
    );

    await Otp.deleteMany({ email: cleanEmail });

    res.json({ success: true });

  } catch (err) {
    console.error("Reset Error:", err);
    res.status(500).json({ message: "Reset failed" });
  }
};
