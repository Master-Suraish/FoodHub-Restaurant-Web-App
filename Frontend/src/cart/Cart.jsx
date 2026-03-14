import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AddressManager from "../components/AddressManager";
import { cartAPI, orderAPI } from "../services/api";
import {
  Trash2,
  Plus,
  Minus,
  MapPin,
  CreditCard,
  ChevronLeft,
  ShoppingBag,
} from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function Cart({ foods }) {
  const showToast = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddressManager, setShowAddressManager] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedAddressDetails, setSelectedAddressDetails] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await cartAPI.getCart();
      if (data) {
        setCartItems(data.items || []);
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error(err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeFromCart = async (foodId) => {
    try {
      await cartAPI.removeFromCart(foodId);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const updateCartQuantity = async (foodId, quantity) => {
    if (quantity < 1) return;
    try {
      await cartAPI.updateCartQuantity(foodId, quantity);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      setCartItems([]);
    } catch (err) {
      console.error(err);
    }
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.foodId.price * item.quantity,
    0,
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleProceedToOrder = () => {
    if (!selectedAddressId) {
      showToast("Please select or add a delivery address first!", "error");
      return;
    }
    setShowOrderForm(true);
    setShowAddressManager(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F4F5F7]">
        <div className="w-10 h-10 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (cartItems.length === 0 && !showOrderForm) {
    return (
      <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
            <ShoppingBag size={48} className="text-slate-200" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">
            Your cart is empty.
          </h1>
          <p className="text-slate-400 text-sm mb-8">
            Time to add some flavor! Explore our menu and find your next
            favorite meal.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-8 py-3 bg-orange-500 text-white font-black rounded-2xl shadow-lg shadow-orange-200 hover:bg-slate-900 transition-all"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] py-12 px-4 md:px-8 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
            My <span className="text-orange-500 not-italic">Cart.</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
            {totalItems} Items selected
          </p>
        </div>

        {!showOrderForm ? (
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-6">
              {/* Items List */}

              <div className="bg-white shadow-lg rounded-[2.5rem] border border-slate-400 p-6 sm:p-8">
                <div className="space-y-8">
                  {cartItems.map((item) => (
                    <div
                      key={item.foodId._id}
                      className="flex flex-col sm:flex-row gap-4 sm:gap-6 pb-8 border-b border-slate-100 last:border-0 last:pb-0 group"
                    >
                      {/* Image */}
                      <div className="w-full h-52 sm:w-28 sm:h-28 flex-shrink-0 bg-slate-100 rounded-3xl overflow-hidden relative border border-slate-200">
                        <img
                          src={item.foodId.image}
                          alt={item.foodId.name}
                          className="w-full h-full object-contain sm:object-cover max-sm:object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-black text-slate-900 text-base sm:text-lg leading-tight">
                              {item.foodId.name}
                            </h3>

                            <p className="text-slate-400 text-xs mt-1 line-clamp-2 sm:line-clamp-1">
                              {item.foodId.description}
                            </p>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.foodId._id)}
                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        {/* Quantity + Price */}
                        <div className="flex items-center justify-between mt-5 sm:mt-6">
                          <div className="flex items-center bg-slate-100 rounded-2xl p-1 border border-slate-200">
                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  item.foodId._id,
                                  item.quantity - 1,
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-orange-500 transition-colors"
                            >
                              <Minus size={14} strokeWidth={3} />
                            </button>

                            <span className="w-8 text-center font-black text-slate-900 text-sm">
                              {item.quantity}
                            </span>

                            <button
                              onClick={() =>
                                updateCartQuantity(
                                  item.foodId._id,
                                  item.quantity + 1,
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-orange-500 transition-colors"
                            >
                              <Plus size={14} strokeWidth={3} />
                            </button>
                          </div>

                          <p className="font-black text-slate-900 text-base sm:text-lg">
                            ${(item.foodId.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address Card */}
              <div className="bg-white rounded-[2.5rem] border border-slate-400 p-8 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                      <MapPin size={20} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">
                      Delivery Address
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowAddressManager(!showAddressManager)}
                    className="px-4 py-1.5 bg-slate-100 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all"
                  >
                    {showAddressManager ? "Close" : "Change"}
                  </button>
                </div>

                {showAddressManager && (
                  <div className="mb-6 animate-fadeIn">
                    <AddressManager
                      onAddressSelect={(id, details) => {
                        setSelectedAddressId(id);
                        setSelectedAddressDetails(details);
                      }}
                      selectedAddressId={selectedAddressId}
                    />
                  </div>
                )}

                {selectedAddressDetails ? (
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                      Selected Address
                    </h4>
                    <div className="bg-orange-100/50 border-orange-500 rounded-2xl p-5 border flex items-center justify-between">
                      <div>
                        <p className="text-slate-900 font-black text-sm">
                          {selectedAddressDetails.street}
                        </p>
                        <p className="text-slate-500 font-bold text-[10px] uppercase mt-0.5">
                          {selectedAddressDetails.city} •{" "}
                          {selectedAddressDetails.phone}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 border-2 border-dashed border-slate-400 rounded-3xl text-center">
                    <p className="text-slate-400 text-sm font-medium italic">
                      No address selected yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary Sticky */}
            <div className="lg:col-span-4 lg:sticky lg:top-24">
              <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow shadow-slate-300">
                <h3 className="text-xl font-black mb-8 tracking-tight">
                  Summary
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-slate-400 text-sm font-bold">
                    <span>Subtotal</span>
                    <span className="text-white">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-sm font-bold">
                    <span>Delivery</span>
                    <span className="text-white">$2.99</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-sm font-bold pb-4 border-b border-slate-800">
                    <span>Tax (10%)</span>
                    <span className="text-white">
                      ${(totalPrice * 0.1).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-black uppercase tracking-tighter">
                      Total
                    </span>
                    <span className="text-3xl font-black text-orange-500 tracking-tighter">
                      ${(totalPrice + 2.99 + totalPrice * 0.1).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleProceedToOrder}
                    className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl transition-all shadow-lg shadow-orange-900/40 uppercase text-xs tracking-[0.2em]"
                  >
                    Proceed to Order
                  </button>
                  <button
                    onClick={clearCart}
                    className="w-full py-3 text-slate-500 hover:text-rose-400 font-black text-[10px] uppercase tracking-widest transition-colors"
                  >
                    Empty Cart
                  </button>
                </div>
              </div>

              <Link
                to="/"
                className="flex items-center justify-center gap-2 mt-6 text-slate-500 hover:text-orange-600 transition-colors text-xs font-black uppercase tracking-widest"
              >
                <ChevronLeft size={14} /> Back to Shopping
              </Link>
            </div>
          </div>
        ) : (
          <OrderForm
            cartItems={cartItems}
            totalPrice={totalPrice}
            totalItems={totalItems}
            selectedAddressId={selectedAddressId}
            selectedAddressDetails={selectedAddressDetails}
            onBackToCart={() => setShowOrderForm(false)}
            clearCart={clearCart}
          />
        )}
      </div>
    </div>
  );
}

// ---------- OrderForm Component ----------
function OrderForm({
  cartItems,
  totalPrice,
  totalItems,
  selectedAddressId,
  selectedAddressDetails,
  onBackToCart,
  clearCart,
}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    paymentMethod: "card",
    specialInstructions: "",
  });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        items: cartItems.map((item) => ({
          food: item.foodId._id,
          quantity: item.quantity,
        })),
        address: selectedAddressId,
        paymentMethod: formData.paymentMethod,
        specialInstructions: formData.specialInstructions,
      };
      const response = await orderAPI.createOrder(orderData);
      setOrderId(response.data.data._id);
      setOrderPlaced(true);
      clearCart();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-[3rem] p-12 text-center shadow-2xl border border-slate-100 animate-fadeIn">
        <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 border border-emerald-100">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">
          Ordered!
        </h2>
        <p className="text-slate-400 text-sm mb-10 max-w-sm mx-auto">
          Your delicious meal is being prepared. Grab your fork!
        </p>

        <div className="bg-slate-50 rounded-[2rem] p-8 text-left mb-10 border border-slate-200/60 shadow-inner">
          <div className="grid grid-cols-2 gap-y-4 text-xs font-bold">
            <span className="text-slate-400 uppercase tracking-widest">
              Order ID
            </span>
            <span className="text-slate-900 text-right font-black">
              #{orderId?.slice(-8).toUpperCase()}
            </span>
            <span className="text-slate-400 uppercase tracking-widest">
              Amount Paid
            </span>
            <span className="text-orange-500 text-right font-black text-lg">
              ${(totalPrice + 2.99 + totalPrice * 0.1).toFixed(2)}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate("/order")}
          className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 hover:bg-orange-500 transition-all uppercase text-xs tracking-widest"
        >
          Track My Order
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-[3rem] p-10 border border-slate-200 shadow-xl">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-200">
          <CreditCard size={24} />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">
          Checkout
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">
            Payment Method
          </label>
          <div className="relative group">
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-bold text-slate-900 appearance-none focus:border-orange-500 focus:bg-white outline-none cursor-pointer transition-all"
            >
              <option value="card">💳 Credit/Debit Card</option>
              <option value="wallet">💰 Digital Wallet</option>
              <option value="cash">💵 Cash on Delivery</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <Plus size={16} className="rotate-45" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">
            Cooking Instructions
          </label>
          <textarea
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleChange}
            placeholder="e.g. Please make it extra spicy or leave at the door..."
            rows={3}
            className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-bold text-slate-900 focus:border-orange-500 focus:bg-white outline-none resize-none placeholder:text-slate-300 text-sm transition-all"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button
            type="button"
            onClick={onBackToCart}
            className="flex-1 py-4 text-slate-500 hover:text-slate-900 font-black rounded-2xl border-2 border-slate-100 hover:border-slate-300 transition-all uppercase text-xs tracking-widest"
          >
            Back to Cart
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`flex-[2] py-4  text-white font-black rounded-2xl shadow-lg shadow-orange-200 hover:bg-slate-900 transition-all uppercase text-xs tracking-widest ${loading ? "bg-orange-700" : "bg-orange-500"}`}
          >
            {loading ? "Processing..." : "Confirm Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
