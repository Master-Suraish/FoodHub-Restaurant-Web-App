import { Request, Response } from "express";
import * as addressService from "./address.service";
import {
  createAddressSchema,
  updateAddressSchema,
  addressParamSchema,
} from "./address.validation";

export const createAddress = async (req: Request, res: Response) => {
  const { success, error, data } = createAddressSchema.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      success: false,
      error: error.issues,
    });
  }

  try {
    const address = await addressService.createAddress({
      ...data,
      user: (req as any).user?._id,
    });

    return res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: address,
    });
  } catch (err: any) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error: " + err.message,
    });
  }
};

export const getAllUserAddress = async (req: Request, res: Response) => {
  try {
    const addresses = await addressService.getUserAddresses(
      (req as any).user?._id,
    );

    if (addresses.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No addresses found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Addresses fetched successfully",
      data: addresses,
    });
  } catch (err: any) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error: " + err.message,
    });
  }
};

export const getAddressById = async (req: Request, res: Response) => {
  const parsed = addressParamSchema.safeParse(req.params);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0].message,
    });
  }

  try {
    const address = await addressService.getAddressById(parsed.data.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    if (address.user.toString() !== (req as any).user?._id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Address fetched successfully",
      data: address,
    });
  } catch (err: any) {
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error: " + err.message,
    });
  }
};

export const updateAddress = async (req: Request, res: Response) => {
  const paramParsed = addressParamSchema.safeParse(req.params);
  const bodyParsed = updateAddressSchema.safeParse(req.body);

  if (!paramParsed.success || !bodyParsed.success) {
    return res.status(400).json({
      success: false,
      error:
        paramParsed.error?.issues[0].message ||
        bodyParsed.error?.issues[0].message,
    });
  }

  try {
    const address = await addressService.getAddressById(paramParsed.data.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    if (address.user.toString() !== (req as any).user?._id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const updatedAddress = await addressService.updateAddress(
      paramParsed.data.id,
      bodyParsed.data,
    );

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + err.message,
    });
  }
};

export const deleteAddress = async (req: Request, res: Response) => {
  const parsed = addressParamSchema.safeParse(req.params);

  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      error: parsed.error.issues[0].message,
    });
  }

  try {
    const address = await addressService.getAddressById(parsed.data.id);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    if (address.user.toString() !== (req as any).user?._id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const deletedAddress = await addressService.deleteAddress(parsed.data.id);

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      data: deletedAddress,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: "Internal server error: " + err.message,
    });
  }
};
