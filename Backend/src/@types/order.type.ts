import { Document } from "mongoose";

export interface orderType extends Document {
  user: object;
  items: {
    food: string;
    quantity: number;
  }[];
  totalPrice: number;
  status: "pending" | "completed" | "cancelled";
  address: object;
  deletedAt: {};
  updatedAt: Date;
}
