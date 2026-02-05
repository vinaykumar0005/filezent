import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  type: {
    type: String,
    enum: ["UPLOAD", "DOWNLOAD", "EMAIL"],
    required: true,
  },

  fileName: String,

  receiverEmail: String,

  ip: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Activity", activitySchema);
