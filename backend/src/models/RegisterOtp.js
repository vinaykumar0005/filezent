import mongoose from "mongoose";

const registerOtpSchema = new mongoose.Schema({
  email: String,
  otp: String,

  attempts: {
    type: Number,
    default: 0,
  },

  lockedUntil: {
    type: Date,
    default: null,
  },

  expiresAt: Date,
});

export default mongoose.model("RegisterOtp", registerOtpSchema);
