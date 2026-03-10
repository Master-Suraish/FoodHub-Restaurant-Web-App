import { Request, Response } from "express";
import adminModel from "./admin.model";
import { updateUserZodSchema } from "../users/users.validation";
import { hashing } from "../../utils/brycpt";
import { UserTypes } from "../../@types/user.type";

export async function updateAdmin(
  req: Request<{ adminId: string }, {}, UserTypes>,
  res: Response,
) {
  try {
    const { success, data, error } = updateUserZodSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        success: false,
        message: error.issues[0].message,
      });
    }

    if (data.password) {
      data.password = await hashing(data.password);
    }

    const updatedUser = await adminModel.findByIdAndUpdate(
      req.params.adminId,
      data,
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      message: "Admin updated successfully by admin",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error" + error,
    });
  }
}
