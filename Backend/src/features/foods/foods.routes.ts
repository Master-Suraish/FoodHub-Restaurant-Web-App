import { Router } from "express";
import {
  addFood,
  getAllFoods,
  getFoodById,
  updateFoodById,
  deleteFoodById,
} from "./foods.controller";
import { checkJWT } from "../../middlewares/auth.middleware";
import { checkRoles } from "../../middlewares/role.middleware";

const router = Router();

router.post("/add", checkJWT, checkRoles("admin"), addFood);
router.get("/", getAllFoods);
router.get("/:id", getFoodById);
router.patch("/update/:id", checkJWT, checkRoles("admin"), updateFoodById);
router.delete("/delete/:id", checkJWT, checkRoles("admin"), deleteFoodById);

export default router;
