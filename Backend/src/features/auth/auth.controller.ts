import { Request, Response } from "express";
import { loginZodSchema, userZodSchema } from "../users/users.validation";
import usersModel from "../users/users.model";
import { comparePassword, hashing } from "../../utils/brycpt";
import {
  generateJWT,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../utils/jwt";
import adminModel from "../admin/admin.model";
import { generateEmailToken, jwtCampare } from "../../utils/jwt";
import { sendEmail } from "../../utils/sendEmail";
import { AuthRequest } from "../../@types/auth.request";

export async function registorUser(req: Request, res: Response) {
  try {
    const { success, data, error } = userZodSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        success: false,
        errors: error.issues,
      });
    }

    const isFound = await usersModel.findOne({ email: data.email });
    if (isFound) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists with this email. Please use a different email.",
      });
    }

    const hashedPassword = await hashing(data.password);

    const user = new usersModel({
      name: data.name,
      email: data.email,
      experience: data.experience,
      phone: data.phone,
      password: hashedPassword,
      role: data.role,
    });

    const newUser = await user.save();

    const emailToken = generateEmailToken(newUser._id.toString());

    await sendEmail(newUser.email, emailToken);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      emailToken,
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = loginZodSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        success: false,
        message: error.issues,
      });
    }

    const user = await usersModel.findOne({ email: data.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await comparePassword(data.password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Password is miss matched",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateJWT(payload);
    const refreshToken = generateRefreshToken(payload);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "User login successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error" + error,
    });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const isProduction = process.env.NODE_ENV === "production";

    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error" + error,
    });
  }
};

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { success, data, error } = loginZodSchema.safeParse(req.body);

    if (!success) {
      return res.status(400).json({
        success: false,
        message: error.issues,
      });
    }

    const user = await adminModel.findOne({ email: data.email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isCorrect = await comparePassword(data.password, user.password);

    if (!isCorrect) {
      return res.status(400).json({
        success: false,
        message: "Password is miss matched",
      });
    }

    const payload = {
      name: user.name,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateJWT(payload);
    const refreshToken = generateRefreshToken(payload);

    const isProduction = process.env.NODE_ENV === "production";


    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite:  isProduction ? "none" : "lax",,
      maxAge: 60 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite:  isProduction ? "none" : "lax",,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Admin login successfully!",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error" + error,
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    // const { token } = req.params;
    const token = req.params.token as string;

    const decoded = jwtCampare(token);

    if (decoded.type !== "emailVerify") {
      return res.status(400).json({ message: "Invalid token type" });
    }

    const user = await usersModel.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    return res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Token expired or invalid",
    });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error" + error,
    });
  }
};
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      return res
        .status(401)
        .json({ success: false, message: "No refresh token" });

    const decoded: any = verifyRefreshToken(refreshToken);
    const payload = {
      _id: decoded._id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };
    const newAccessToken = generateJWT(payload);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.json({ success: true, message: "Access token refreshed" });

    console.log("refreshToken", newAccessToken);
  } catch (err) {
    console.log("error refreshToken", err);
    res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};
