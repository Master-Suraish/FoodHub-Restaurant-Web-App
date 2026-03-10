import Order from "./orders.model";

export const createOrder = async (data: any) => {
  const order = await Order.create(data);
  await order.populate("items.food");
  return order;
};

type OrderFilter = {
  status?: "pending" | "preparing" | "completed" | "cancelled";
};

export const getAllOrders = async (filter: OrderFilter = {}) => {
  return Order.find({ deletedAt: null, ...filter })
    .populate("user")
    .populate("items.food")
    .populate("address")
    .sort({ createdAt: -1 });
};

export const getOrderById = (id: string) => {
  return Order.findOne({ _id: id, deletedAt: null })
    .populate("user")
    .populate("items.food")
    .populate("address");
};

export const updateOrderStatus = (id: string, status: string) => {
  return Order.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true },
  );
};

export const softDeleteOrder = (id: string) => {
  return Order.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true });
};
