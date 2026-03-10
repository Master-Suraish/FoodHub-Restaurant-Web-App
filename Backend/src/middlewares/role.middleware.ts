import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../@types/auth.request";
import { Role } from "../@types/role";


export const checkRoles = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: insufficient role",
      });
    }

    next();
  };
};
