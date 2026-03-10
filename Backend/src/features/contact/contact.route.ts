import { Router } from "express";
import {
  submitContact,
  getAllContacts,
  HardDeleteMessage,
} from "./contact.controller";

const router = Router();

router.post("/", submitContact);
router.get("/all", getAllContacts);
router.delete("/delete/:userId", HardDeleteMessage);

export default router;
