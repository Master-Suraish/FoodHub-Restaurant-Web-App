import mongoose from "mongoose";
import { UserTypes } from "../../@types/user.type";

const userSchema = new mongoose.Schema<UserTypes>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    experience: { type: Number, required: true, min: 1, max: 50 },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export default mongoose.model<UserTypes>("Users", userSchema);
