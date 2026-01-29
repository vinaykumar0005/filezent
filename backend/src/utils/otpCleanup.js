import Otp from "../models/Otp.js";

export const startOtpCleanup = () => {
  setInterval(async () => {
    try {
      const result = await Otp.deleteMany({
        expiresAt: { $lt: Date.now() },
      });

      if (result.deletedCount > 0) {
        console.log(`🧹 OTP cleanup: ${result.deletedCount} expired records removed`);
      }
    } catch (err) {
      // ECONNRESET is a transient MongoDB Atlas issue
      if (err.code === "ECONNRESET") {
        console.warn("OTP cleanup skipped (temporary DB connection reset)");
      } else {
        console.error("OTP cleanup failed:", err.message);
      }
    }
  }, 10 * 60 * 1000); // every 10 minutes
};
