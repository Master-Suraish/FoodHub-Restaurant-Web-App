import { Document, Types } from "mongoose";

export interface AddressType extends Document {
  user: Types.ObjectId;
  city: string;
  street: string;
  phone: string;
  deletedAt: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}