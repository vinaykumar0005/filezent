import User from "../models/User.js";
import Otp from "../models/Otp.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createTransporter } from "../config/mail.js";
import RegisterOtp from "../models/RegisterOtp.js";
import { OTP_MAX_ATTEMPTS, OTP_LOCK_TIME } from "../config/security.js";




/* =========================
   REGISTER
========================= */
export const register = async (req, res) => {
  const exists = await User.findOne({ email: req.body.email });
  if (exists) {
    return res.status(409).json({ message: "USER_EXISTS" });
  }

  const hashed = await bcrypt.hash(req.body.password, 10);
  await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashed,
  });

  res.json({ success: true });
};

//Register otp
export const sendRegisterOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        message: "User already registered. Please login.",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await RegisterOtp.deleteMany({ email });

    await RegisterOtp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    const transporter = await createTransporter();

    await transporter.sendMail({
      from: '"Filezent" <no-reply@filezent.com>',
      to: email,
      subject: "Verify Your Filezent Account",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 10 minutes</p>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Register OTP Error:", err.message);
    res.status(500).json({ message: "OTP send failed" });
  }
};


//Verify registered Otp
export const verifyRegisterOtp = async (req, res) => {
  try {
    const { email, otp, name, password } = req.body;

    const record = await RegisterOtp.findOne({ email });

    if (!record) {
      return res.status(400).json({
        message: "OTP not found. Request again.",
      });
    }

    // Check lock
    if (record.lockedUntil && record.lockedUntil > Date.now()) {
      const mins = Math.ceil(
        (record.lockedUntil - Date.now()) / 60000
      );

      return res.status(429).json({
        message: `Too many attempts. Try again in ${mins} minutes.`,
      });
    }

    // Check expiry
    if (record.expiresAt < Date.now()) {
      await RegisterOtp.deleteOne({ email });

      return res.status(400).json({
        message: "OTP expired. Request new one.",
      });
    }

    // Wrong OTP
    if (String(record.otp) !== String(otp)) {

      record.attempts += 1;

      // Lock account
      if (record.attempts >= OTP_MAX_ATTEMPTS) {
        record.lockedUntil = new Date(
          Date.now() + OTP_LOCK_TIME
        );
      }

      await record.save();

      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // ✅ SUCCESS — RESET COUNTERS
    await RegisterOtp.deleteOne({ email });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Verify OTP Error:", err.message);
    res.status(500).json({
      message: "Verification failed",
    });
  }
};



/* =========================
   LOGIN
========================= */
export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ message: "INVALID_CREDENTIALS" });
  }

  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    return res.status(400).json({ message: "INVALID_CREDENTIALS" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({
    token,
    user: {
      name: user.name,
      email: user.email,
    },
  });
};

/* =========================
   FORGOT PASSWORD (⬅ YOUR CODE GOES HERE)
========================= */

export const forgotPassword = async (req, res) => {
  console.log("🔥 FORGOT PASSWORD API HIT");//temp
  console.log("📧 Email received:", req.body.email);//temp
  const otp = Math.floor(100000 + Math.random() * 900000).toString();//temp

  const record = await Otp.create({//temp
    email: req.body.email,//temp
    otp,//temp
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),//temp
  });//temp

  console.log("✅ OTP CREATED:", record.otp);//temp
  console.log("DB OTP:", record.otp);
  console.log("User OTP:", otp);


  // const otp = Math.floor(100000 + Math.random() * 900000).toString(); original

  await Otp.create({
    email: req.body.email,
    otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  const transporter = await createTransporter();

  await transporter.sendMail({
    from: '"Filezent" <no-reply@filezent.com>',
    to: req.body.email,
    subject: "Filezent Password Reset OTP",
    html: `<h2>Your OTP: ${otp}</h2>`,
  });

  res.json({ success: true });
};


/* =========================
   RESET PASSWORD
========================= */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const record = await Otp.findOne({
      email: cleanEmail,
      expiresAt: { $gt: Date.now() },
    });

    if (!record) {
      return res.status(400).json({
        message: "OTP expired or not found. Request again.",
      });
    }

    // Lock check
    if (record.lockedUntil && record.lockedUntil > Date.now()) {
      return res.status(429).json({
        message: "Too many attempts. Try later.",
      });
    }

    const dbOtp = record.otp.trim();
    const userOtp = String(otp).trim();

    // Compare
    if (dbOtp !== userOtp) {
      record.attempts++;

      if (record.attempts >= 5) {
        record.lockedUntil = new Date(
          Date.now() + 15 * 60 * 1000
        );
      }

      await record.save();

      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Success
    const hashed = await bcrypt.hash(newPassword, 10);

    await User.updateOne(
      { email: cleanEmail },
      { password: hashed }
    );

    // Delete all OTPs
    await Otp.deleteMany({ email: cleanEmail });

    res.json({ success: true });
  } catch (err) {
    console.error("Reset Password Error:", err.message);

    res.status(500).json({
      message: "Password reset failed",
    });
  }
};
