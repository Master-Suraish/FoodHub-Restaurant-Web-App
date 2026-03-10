import { Schema, model, Types } from "mongoose";

const addressSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default model("Address", addressSchema);
