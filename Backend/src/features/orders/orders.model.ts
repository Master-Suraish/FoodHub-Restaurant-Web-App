import { orderType } from "../../@types/order.type";
import { Schema, model, Types } from "mongoose";

const orderModel = new Schema<orderType>(
  {
    user: {
      type: Types.ObjectId,
      ref: "Users",
      required: true,
    },
    items: [
      {
        food: {
          type: Types.ObjectId,
          ref: "foods",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "completed", "preparing", "cancelled"],
      default: "pending",
    },

    address: {
      type: Types.ObjectId,
      ref: "Address",
      required: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default model<orderType>("Order", orderModel);
