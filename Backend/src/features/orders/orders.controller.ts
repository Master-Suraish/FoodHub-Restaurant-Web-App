import { Request, Response } from "express";
import Food from "../foods/foods.model";
import * as orderService from "./orders.service";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  orderParamSchema,
} from "./orders.validation";
import { sendOrderEmail } from "../../utils/sendEmail";
import usersModel from "../users/users.model";
import { AuthRequest } from "../../@types/auth.request";

export const createOrder = async (req: Request, res: Response) => {
  const { success, error, data } = createOrderSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      error: error.issues,
    });
  }

  try {
    let totalPrice = 0;
    for (let item of data.items) {
      const food = await Food.findById(item.food);
      if (!food) {
        return res.status(404).json({
          success: false,
          message: `Food with ID ${item.food} not found`,
        });
      }
      totalPrice += food.price * item.quantity;
    }

    const order = await orderService.createOrder({
      ...data,
      user: (req as any).user?._id,
      totalPrice,
    });

    const user = await usersModel.findById((req as any).user._id);

    if (order && user?.email) {
      await sendOrderEmail(user.email, order);
    }

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "internal server error " + err.message,
    });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  const parsed = updateOrderStatusSchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid status filter" });
  }

  const filter: any = {};

  if (parsed.data.status) {
    filter.status = parsed.data.status;
  }

  try {
    const orders = await orderService.getAllOrders(filter);

    if (orders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders available",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "internal server error " + err.message,
    });
  }
};
export const getUserOrders = async (req: AuthRequest, res: Response) => {
  const parsed = updateOrderStatusSchema.safeParse(req.query);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid status filter" });
  }

  const filter: any = { user: req.user._id };

  if (parsed.data.status) {
    filter.status = parsed.data.status;
  }

  try {
    const orders = await orderService.getAllOrders(filter);

    if (orders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders available",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "internal server error " + err.message,
    });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  const parsed = orderParamSchema.safeParse(req.params);

  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0].message,
    });
  }

  try {
    const order = await orderService.getOrderById(parsed.data.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order?.deletedAt != null) {
      return res.status(404).json({
        message: "Order has deleted",
      });
    }

    return res.json({ success: true, data: order });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "internal server error " + err.message,
    });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  const paramParse = orderParamSchema.safeParse(req.params);
  const bodyParse = updateOrderStatusSchema.safeParse(req.body);

  if (!paramParse.success || !bodyParse.success) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    const order = await orderService.updateOrderStatus(
      paramParse.data.id,
      bodyParse.data.status,
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order?.deletedAt != null) {
      return res.status(404).json({
        message: "Order has deleted",
      });
    }

    const io = req.app.get("socketio");

    const orderId = paramParse.data.id.toString();

    io.to(orderId).emit("order_status_updated", {
      orderId: orderId,
      status: bodyParse.data.status,
      updatedAt: order.updatedAt,
      message: `Your order is ${bodyParse.data.status} added!`,
    });

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "internal server error " + err.message,
    });
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  const parsed = orderParamSchema.safeParse(req.params);

  if (!parsed.success) {
    return res.status(400).json({
      error: parsed.error.issues[0].message,
    });
  }

  try {
    const order = await orderService.softDeleteOrder(parsed.data.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      message: "Order deleted softly",
      data: order,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "internal server error " + err.message,
    });
  }
};
