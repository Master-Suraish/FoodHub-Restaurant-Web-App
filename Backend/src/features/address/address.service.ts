import AddressModel from "./address.model";
import { Types } from "mongoose";

export const createAddress = async (data: any) => {
  return await AddressModel.create(data);
};


export const getUserAddresses = async (userId: string) => {
  return await AddressModel.find({ 
    user: new Types.ObjectId(userId),
    deletedAt: null
  });
};

export const getAllAddresses = async () => {
  return await AddressModel.find({ deletedAt: null })
    .populate("user");
};

export const getAddressById = async (id: string) => {
  return await AddressModel.findOne({
    _id: new Types.ObjectId(id),
    deletedAt: null,
  });
};

export const updateAddress = async (id: string, data: any) => {
  return await AddressModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteAddress = async (id: string) => {
  return await AddressModel.findByIdAndUpdate(
    id,
    { deletedAt: new Date() },
    { new: true }
  );
};