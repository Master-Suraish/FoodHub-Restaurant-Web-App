import { Router } from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  getUserOrders
} from "./orders.controller";
import { checkJWT } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", createOrder);
router.get("/all", getAllOrders);
router.get("/", getUserOrders);
router.get("/:id", getOrderById);
router.patch("/:id/status", updateOrderStatus);
router.delete("/:id", deleteOrder);

export default router;