import { useEffect, useState } from "react";
import { orderAPI } from "../services/api";
import { Link } from "react-router-dom";
import { Package, MapPin, Phone } from "lucide-react";
import { io } from "socket.io-client";
import { useToast } from "../context/ToastContext";

export default function OrdersPage() {
  const showToast = useToast();
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusStyles = {
    completed: {
      card: "bg-emerald-50/30 border-emerald-500 ",
      header: "bg-emerald-100/50 border-emerald-200",
      badge: "bg-emerald-500 text-white",
      accent: "text-emerald-600",
    },
    pending: {
      card: "bg-amber-50/30 border-amber-500",
      header: "bg-amber-100/50 border-amber-200",
      badge: "bg-amber-500 text-white",
      accent: "text-amber-600",
    },
    preparing: {
      card: "bg-blue-50/30 border-blue-500",
      header: "bg-blue-100/50 border-blue-200",
      badge: "bg-blue-600 text-white",
      accent: "text-blue-600",
    },
    cancelled: {
      card: "bg-red-50/30 border-red-500",
      header: "bg-red-100/50 border-red-200",
      badge: "bg-red-600 text-white",
      accent: "text-red-600",
    },
    default: {
      card: "bg-slate-50 border-slate-500",
      header: "bg-slate-100 border-slate-200",
      badge: "bg-slate-500 text-white",
      accent: "text-slate-600",
    },
  };

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

  const socket = io("http://localhost:3001", {
    withCredentials: true,
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderAPI.getUserOrders();
        const ordersData = response.data.data || [];
        setOrders(ordersData);

        ordersData.forEach((order) => {
          socket.emit("join_order_room", order._id);
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    socket.on("order_status_updated", (data) => {
      // List mein se sahi order dhundo aur uska status update kardo
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === data.orderId
            ? { ...order, status: data.status, updatedAt: data.updatedAt }
            : order,
        ),
      );

      showToast(`Order status updated to ${data.status}`, "success");
    });

    return () => {
      socket.off("order_status_updated");
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
        <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">
          Fetching Orders...
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Package className="text-slate-300" size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          No orders yet.
        </h2>
        <p className="text-slate-500 text-sm mt-2 mb-8 max-w-xs">
          Hungry? Place your first order!
        </p>
        <Link
          to="/"
          className="px-8 py-3 bg-orange-500 text-white font-black rounded-xl shadow-lg shadow-orange-200 text-sm"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  const filteredOrders = orders.filter((order) =>
    statusFilter === "all" ? true : order.status === statusFilter,
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-10 px-6">
      {/* Container*/}
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter">
            My <span className="text-orange-500">Orders.</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
            Transaction History
          </p>
        </header>

        <div className="flex flex-wrap gap-2 mb-6">
          {["all", "pending", "preparing", "completed", "cancelled"].map(
            (status) => (
              <button
                key={status}
                className={`px-3 py-1 rounded-full font-bold text-xs uppercase tracking-widest
        ${statusFilter === status ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-800"}`}
                onClick={() => setStatusFilter(status)}
              >
                {status}
              </button>
            ),
          )}
        </div>

        {filteredOrders.length === 0 && (
          <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Package className="text-slate-300" size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              No orders{" "}
              {statusFilter !== "all" ? `with status "${statusFilter}"` : "yet"}
              .
            </h2>
            <p className="text-slate-500 text-sm mt-2 mb-8 max-w-xs">
              {statusFilter !== "all"
                ? "Try selecting a different status."
                : "Hungry? Place your first order!"}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredOrders.map((order) => {
            const style = statusStyles[order.status] || statusStyles.default;
            const subtotal = order.items.reduce(
              (sum, item) => sum + item.food.price * item.quantity,
              0,
            );
            const total = subtotal + 2.99 + subtotal * 0.1;

            const isAdminStatusUpdated =
              new Date(order.updatedAt).getTime() !==
              new Date(order.createdAt).getTime();

            return (
              <div
                key={order._id}
                className={`border rounded-[2rem] overflow-hidden transition-all shadow-sm flex flex-col ${style.card}`}
              >
                {/* Header */}
                <div
                  className={`px-8 py-4 gap-3 border-b flex justify-between items-center ${style.header}`}
                >
                  <div>
                    <span className="text-xs font-black text-slate-500 uppercase tracking-widest">
                      Ref ID
                    </span>
                    <p className="text-sm font-black text-slate-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  {/* <div className="flex justify-center items-center gap-2 text-xs font-bold text-slate-500"> */}
                  <div className="uppercase flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-[10px] sm:text-xs font-bold text-slate-500 text-right">
                    {isAdminStatusUpdated && (
                      <span>Updated: {formatDate(order.updatedAt)}</span>
                    )}
                    <span
                      className={`px-4 py-1.5  rounded-xl text-xs font-black text-center uppercase tracking-wider shadow-sm ${style.badge}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 grid grid-cols-1 gap-6 flex-grow">
                  {/* Items */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
                      Basket
                    </h4>
                    {order.items.map((item) => (
                      <div
                        key={item.food._id}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-white rounded-lg overflow-hidden border border-slate-100 flex-shrink-0">
                            <img
                              src={item.food.image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800 line-clamp-1">
                              {item.food.name}
                            </p>
                            <p className="text-xs font-bold text-slate-400">
                              {item.quantity} Unit(s)
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-black text-slate-900">
                          ${(item.food.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/60 border-black/60 backdrop-blur-sm rounded-2xl p-5 flex flex-col justify-between border shadow-inner">
                    <div className="space-y-1.5 pb-3 border-b border-slate-100">
                      <div className=" flex justify-between text-xs font-bold text-slate-500">
                        <span>Items Total</span>
                        <span className="text-slate-900 text-sm">
                          ${subtotal.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-slate-900">
                        <span>
                          Paid Amount
                          <span className="font-normal text-xs">
                            {" "}
                            (Inc delivery & 10% Tax fee)
                          </span>
                        </span>
                        <span className={`text-lg ${style.accent}`}>
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 space-y-1.5">
                      <div className="flex items-start gap-2 text-xs font-bold text-slate-500">
                        <MapPin size={15} className={style.accent} />
                        <span className="line-clamp-1">
                          {order.address.street}, {order.address.city}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Phone size={15} className={style.accent} />
                        <span>{order.phone || order.address.phone}</span>
                      </div>
                      <div className="uppercase flex items-center gap-2 text-xs font-bold text-slate-500">
                        <Package size={15} className={style.accent} />
                        <span>Created: {formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
