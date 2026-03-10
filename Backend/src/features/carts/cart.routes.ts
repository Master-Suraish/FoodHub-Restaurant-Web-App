import { Router } from "express";
import {
  addToCart,
  getCart,
  removeItem,
  updateCartQuantity,
  clearCart,
} from "./cart.controller";

const router = Router();

router.post("/add", addToCart);
router.get("/", getCart);
router.delete("/remove/:foodId", removeItem);
router.put("/update/:foodId", updateCartQuantity);
router.delete("/clear", clearCart);

export default router;
