import RegisterOtp from "../models/RegisterOtp.js";

export const startRegisterOtpCleanup = () => {
  setInterval(async () => {
    try {
      await RegisterOtp.deleteMany({
        expiresAt: { $lt: Date.now() },
      });
    } catch {
      console.warn("Register OTP cleanup skipped");
    }
  }, 10 * 60 * 1000);
};
