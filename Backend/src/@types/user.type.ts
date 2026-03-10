import { Document } from "mongoose";
import { Role } from "./role";

export interface UserTypes extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  experience: number;
  isVerified: Boolean;
}
