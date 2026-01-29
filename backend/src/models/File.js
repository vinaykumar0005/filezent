import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    originalName: String,
    filename: String,
    path: String,
    size: Number,
    token: String,

    // Expiry timestamp
    expiresAt: {
      type: Date,
      index: { expires: 0 }, // ⬅ TTL INDEX
    },
  },
  { timestamps: true }
);

export default mongoose.model("File", fileSchema);
