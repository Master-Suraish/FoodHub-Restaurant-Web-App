import {  Response, NextFunction } from "express";
import { jwtCampare } from "../utils/jwt";
import { AuthRequest } from "../@types/auth.request";

export function checkJWT(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    // const token = req.headers.authorization?.split(" ")[1];
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Token missing",
      });
    }
    const decoded = jwtCampare(token);

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Access token expired or invalid" + error,
    });
  }
}
