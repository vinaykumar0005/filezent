import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    lastLogin: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);

// before admin panel update
// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true },
//   password: String,
// });

// export default mongoose.model("User", userSchema);
