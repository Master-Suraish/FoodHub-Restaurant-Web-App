import mongoose, { Document, Schema, Model } from "mongoose";

export interface ICartItem {
  foodId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema: Schema<ICartItem> = new Schema({
  foodId: {
    type: Schema.Types.ObjectId,
    ref: "foods",
    required: true,
  },
  quantity: { 
    type: Number, 
    default: 1 },
});

const CartSchema: Schema<ICart> = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
  },
  { timestamps: true },
);

const Cart: Model<ICart> = mongoose.model<ICart>("Cart", CartSchema);
export default Cart;
