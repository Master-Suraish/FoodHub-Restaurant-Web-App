import { Request, Response } from "express";
import * as foodService from "./foods.service";
import { foodParam, foodSchema } from "./foods.validation";
import foodsModel from "./foods.model";

export const addFood = async (req: Request, res: Response) => {
  const { success, error, data } = foodSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      success: false,
      error: error.issues,
    });
  }

  try {
    const food = await foodService.createFood(data);

    return res.status(200).json({
      success: true,
      message: "Food added successfully",
      data: food,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "internal server error " + err.message,
    });
  }
};

export const getAllFoods = async (req: Request, res: Response) => {
  try {
    const {
      page = 1,
      limit = 6,
      selectedCategory = "all",
      searchFood = "",
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const filter: any = {
      deletedAt: null,
      name: { $regex: searchFood, $options: "i" },
    };

    if (selectedCategory !== "all") {
      filter.category = selectedCategory;
    }

    const total = await foodsModel.countDocuments(filter);

    const foods = await foodsModel
      .find(filter)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Foods fetched successfully",
      data: foods,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "internal server error " + err.message,
    });
  }
};

export const getFoodById = async (req: Request, res: Response) => {
  const parsed = foodParam.safeParse(req.params);

  if (!parsed.success) {
    return res.status(404).json({
      success: false,
      error: parsed.error.issues[0].message,
    });
  }

  try {
    const food = await foodService.getFoodById(parsed.data.id);

    if (food?.deletedAt != null) {
      return res.status(404).json({
        message: "Food has deleted",
      });
    }

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Food fetched successfully",
      data: food,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "internal server error " + err.message,
    });
  }
};

export const updateFoodById = async (req: Request, res: Response) => {
  const id = foodParam.safeParse(req.params);
  const body = foodSchema.partial().safeParse(req.body);

  if (!id.success) {
    return res.status(400).json({
      success: false,
      error: id.error.issues[0].message,
    });
  }

  if (!body.success) {
    return res.status(400).json({
      success: false,
      error: body.error.issues[0].message,
    });
  }

  try {
    const food = await foodService.updateFoodById(id.data.id, body.data);

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    if (food?.deletedAt != null) {
      return res.status(404).json({
        message: "Food has deleted",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Food updated successfully",
      data: food,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error " + err.message,
    });
  }
};

export const deleteFoodById = async (req: Request, res: Response) => {
  const parsed = foodParam.safeParse(req.params);

  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0].message,
    });
  }

  try {
    const food = await foodService.softDeleteFoodById(parsed.data.id);

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    return res.json({
      success: true,
      message: "Food deleted softly",
      data: food,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error " + err.message,
    });
  }
};
