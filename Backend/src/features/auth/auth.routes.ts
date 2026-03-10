import { Router } from "express";
import { validate } from "./../../middlewares/validate.middleware";
import { loginZodSchema } from "../users/users.validation";
import {
  loginAdmin,
  loginUser,
  registorUser,
  verifyEmail,
  logoutUser,
  getCurrentUser,
  refreshToken,
} from "./auth.controller";
import { checkJWT } from "../../middlewares/auth.middleware";
const route = Router();
import { authLimiter, adminLimiter } from "../../middlewares/rateLimiter";

route.post("/user/login", authLimiter, validate(loginZodSchema), loginUser);
route.post("/user/register", authLimiter, registorUser);
route.post("/user/logout", logoutUser);
route.post("/admin/login", adminLimiter, validate(loginZodSchema), loginAdmin);
route.post("/refresh-token", authLimiter, refreshToken);
route.get("/verify-email/:token", authLimiter, verifyEmail);
route.get("/me", checkJWT, getCurrentUser);

export default route;
