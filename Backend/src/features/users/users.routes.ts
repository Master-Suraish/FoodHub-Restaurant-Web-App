import { Router } from "express";
import { getAllUsers, updateUser, HardDeleteUser } from "./users.controller";


const route = Router();

route.put("/update/:userId", updateUser);

route.get("/", getAllUsers);
route.delete("/delete/:userId", HardDeleteUser);

export default route;
