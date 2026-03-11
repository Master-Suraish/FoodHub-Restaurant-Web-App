import jwt from "jsonwebtoken";
import { TokenPayload } from "../@types/token.types";

export function generateJWT(payload: any) {
  const secret = process.env.JWT_SECRET || "123";
  return jwt.sign(payload, secret, { expiresIn: "5m" });
}

export function generateRefreshToken(payload: any) {
  const secret = process.env.REFRESH_TOKEN_SECRET || "321";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export function verifyRefreshToken(token: string) {
  const secret = process.env.REFRESH_TOKEN_SECRET || "321";
  return jwt.verify(token, secret);
}
export function jwtCampare(token: string):TokenPayload {
  const secret = process.env.JWT_SECRET || "123";
  return jwt.verify(token, secret) as TokenPayload;
}

export function generateEmailToken(userId: string) {
  const secret = process.env.JWT_SECRET || "123";
  return jwt.sign({ id: userId, type: "emailVerify" }, secret, {
    expiresIn: "1d",
  });
}
