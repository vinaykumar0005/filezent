import Activity from "../models/Activity.js";

export const logActivity = async ({
  userId,
  type,
  fileName,
  receiverEmail,
  ip,
}) => {
  try {
    await Activity.create({
      userId,
      type,
      fileName,
      receiverEmail,
      ip,
    });
  } catch (err) {
    console.error("Activity Log Error:", err.message);
  }
};
