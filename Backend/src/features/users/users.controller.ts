import { Request, Response } from "express";
import userModel from "./users.model";
import { updateUserZodSchema } from "./users.validation";
import { hashing } from "../../utils/brycpt";
import { UserTypes } from "../../@types/user.type";
import usersModel from "./users.model";

export async function getAllUsers(req: Request, res: Response) {
  try {
    const userList = await usersModel.find();

    res.status(200).json({
      success: true,
      message: "All users data fetched successfully!",
      data: userList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error" + error,
    });
  }
}

export async function getUser(
  req: Request<{ userId: string }, {}, UserTypes>,
  res: Response,
) {
  try {
    const { userId } = req.params;

    const user = await usersModel.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User founded successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error" + error,
    });
  }
}

export async function updateUser(
  req: Request<{ userId: string }, {}, UserTypes>,
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

    const updatedUser = await userModel.findByIdAndUpdate(
      req.params.userId,
      data,
      { new: true, runValidators: true },
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully by admin",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error" + error,
    });
  }
}

export async function HardDeleteUser(
  req: Request<{ userId: string }>,
  res: Response,
) {
  try {
    const { userId } = req.params;

    const deletedUser = await userModel.findOneAndDelete({ _id: userId });

    if (!deletedUser) {
      res.status(404).json({
        success: false,
        message: "Sorry, This ID name user not found in database.",
      });
    }
    res.status(200).json({
      message: "User hard deleted successfully by admin",
      data: deletedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error" + error,
    });
  }
}
