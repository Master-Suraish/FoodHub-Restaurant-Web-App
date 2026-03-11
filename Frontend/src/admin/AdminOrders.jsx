import { useEffect, useState } from "react";
import { orderAPI } from "../services/api";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { io } from "socket.io-client";

import {
  Package,
  User,
  MapPin,
  Phone,
  Loader2,
  DollarSign,
  ReceiptText,
} from "lucide-react";

const socket = io(import.meta.env.VITE_BACKEND_RAILWAY_URL, {
  withCredentials: true,
});

export default function AdminOrders() {
  const showToast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = searchParams.get("status") || "";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    return date.toLocaleString("en-PK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAllOrders(statusFilter);
      const ordersData = response.data.data || [];
      setOrders(ordersData);

      ordersData.forEach((order) => {
        socket.emit("join_order_room", order._id);
      });
    } catch (err) {
      showToast("Error fetching orders", "error");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingStatusId(id);
      await orderAPI.updateOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: status } : order,
        ),
      );
      showToast(`Order status updated to ${status}`, "success");
    } catch (err) {
      showToast("Failed to update status.", "error");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  useEffect(() => {
    socket.on("order_status_updated", (data) => {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === data.orderId
            ? {
                ...order,
                status: data.status,
                updatedAt: data.updatedAt,
              }
            : order,
        ),
      );
    });

    return () => {
      socket.off("order_status_updated");
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2
          className="w-12 h-12 text-orange-600 animate-spin"
          strokeWidth={3}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
              Order{" "}
              <span className="text-orange-600 not-italic underline decoration-orange-200 decoration-4 underline-offset-8">
                Terminal.
              </span>
            </h1>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em] mt-3">
              Active Management / Delivery Control
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { label: "All Orders", value: "" },
              { label: "Pending", value: "pending" },
              { label: "Preparing", value: "preparing" },
              { label: "Completed", value: "completed" },
              { label: "Cancelled", value: "cancelled" },
            ].map((status) => (
              <button
                key={status.value || "all"}
                onClick={() =>
                  setSearchParams(status.value ? { status: status.value } : {})
                }
                className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border-2 border-slate-900 transition-all
      ${
        statusFilter === status.value
          ? "bg-orange-500 text-white "
          : "shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]"
      }`}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>

        {/* ORDERS GRID */}
        {orders.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-300">
            <Package
              size={64}
              className="mx-auto mb-6 text-slate-200"
              strokeWidth={1}
            />
            <h2 className="text-2xl font-black text-slate-900 uppercase">
              System Clear.
            </h2>
            <p className="text-slate-400 font-bold mt-2">
              No active orders in this queue.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {orders.map((order) => {
              if (!order.user) return null;

              return (
                <div
                  key={order._id}
                  className="rounded-[2rem] sm:rounded-[2.5rem] border-2 border-slate-900 shadow-xl shadow-slate-200 overflow-hidden flex flex-col group transition-all hover:-translate-y-1 bg-white"
                >
                  {/* TOP BAR */}
                  <div className="bg-slate-900 p-4 sm:p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 text-white">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/20">
                        <Package
                          size={18}
                          className="text-white"
                          strokeWidth={3}
                        />
                      </div>

                      <div>
                        <h3 className="font-black text-xs sm:text-sm tracking-tighter">
                          ID: {order._id.slice(-8).toUpperCase()}
                        </h3>

                        {/* CREATED TIME */}
                        <p className="text-[9px] text-orange-400 font-black uppercase tracking-widest">
                          Created: {formatDate(order.createdAt)}
                        </p>

                        {/* UPDATED TIME */}
                        <p className="text-[9px] text-slate-300 font-black uppercase tracking-widest">
                          Updated: {formatDate(order.updatedAt)}
                        </p>
                      </div>
                    </div>

                    {/* STATUS SELECT */}
                    <div className="relative w-full sm:w-auto">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                        disabled={updatingStatusId === order._id}
                        className={`w-full sm:w-auto pl-4 pr-8 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 border-white outline-none cursor-pointer transition-all
        ${
          order.status === "pending"
            ? "bg-amber-500"
            : order.status === "preparing"
              ? "bg-blue-500"
              : order.status === "completed"
                ? "bg-emerald-500"
                : "bg-rose-500"
        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      {updatingStatusId === order._id && (
                        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center rounded-xl">
                          <Loader2 size={14} className="animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 space-y-6">
                    {/* CUSTOMER INFO */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-b-2 border-slate-50 pb-6">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1">
                          <User size={12} strokeWidth={3} /> Customer
                        </p>

                        <p className="text-sm font-black text-slate-900 truncate">
                          {order.user.name}
                        </p>

                        <p className="text-[11px] font-bold text-slate-500 truncate italic">
                          {order.user.email}
                        </p>
                      </div>

                      <div className="space-y-2 sm:border-l-2 border-slate-100 sm:pl-6">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1">
                          <MapPin size={12} strokeWidth={3} /> Destination
                        </p>

                        <p className="text-[11px] font-black text-slate-900 leading-tight">
                          {order.address.street}, {order.address.city}
                        </p>

                        <p className="text-[11px] font-bold text-orange-600 flex items-center gap-1">
                          <Phone size={10} strokeWidth={3} />
                          {order.address.phone}
                        </p>
                      </div>
                    </div>

                    {/* ITEMS */}
                    <div>
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                        <ReceiptText size={14} strokeWidth={3} /> Manifest List
                      </p>

                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {order.items.map((item) => (
                          <div
                            key={item.food._id}
                            className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100 group-hover:border-slate-200 transition-all"
                          >
                            <div className="flex items-center gap-3 sm:gap-4">
                              <span className="w-8 h-8 flex items-center justify-center bg-slate-900 text-white text-[10px] font-black rounded-lg">
                                x{item.quantity}
                              </span>

                              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                                <img
                                  src={item.food.image}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              <span className="font-black text-slate-800 text-xs tracking-tight">
                                {item.food.name}
                              </span>
                            </div>

                            <span className="font-black text-slate-900 text-xs">
                              ${(item.food.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* FOOTER */}
                    <div className="bg-slate-900 rounded-[1.5rem] p-4 sm:p-5 flex justify-between items-center text-white mt-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          Verification Status
                        </span>

                        <div
                          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[8px] font-black border ${
                            order.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-orange-500/10 text-orange-400 border-orange-500/20"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                              order.status === "completed"
                                ? "bg-emerald-400"
                                : "bg-orange-400"
                            }`}
                          />
                          SECURE TRANSACTION
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Grand Total
                        </p>

                        <div className="flex items-center justify-end text-xl sm:text-2xl font-black text-white">
                          <DollarSign
                            size={20}
                            className="text-orange-500"
                            strokeWidth={4}
                          />
                          {(
                            order.items.reduce(
                              (sum, item) =>
                                sum + item.food.price * item.quantity,
                              0,
                            ) *
                              1.1 +
                            2.99
                          ).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
