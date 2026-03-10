import { useState, useEffect } from "react";
import { addressAPI } from "../services/api";
import { MapPin, Phone, Edit3, Trash2, Plus, X } from "lucide-react";

export default function AddressManager({ onAddressSelect, selectedAddressId }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    city: "",
    street: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [serverError, setServerError] = useState(""); // Re-added state from your catch block logic

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await addressAPI.getUserAddresses();
      setAddresses(response.data.data || []);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      if (editingId) {
        await addressAPI.updateAddress(editingId, formData);
      } else {
        await addressAPI.createAddress(formData);
      }
      resetForm();
      fetchAddresses();
    } catch (err) {
      const data = err?.response?.data;
      if (data?.error) {
        const fieldErrors = {};
        data.error.forEach((err) => {
          const fieldName = err.path[0];
          fieldErrors[fieldName] = err.message;
        });
        setErrors(fieldErrors);
        setServerError("");
      } else if (data?.message) {
        setServerError(data.message);
        setErrors({});
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (address) => {
    setEditingId(address._id);
    setFormData({
      city: address.city,
      street: address.street,
      phone: address.phone,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await addressAPI.deleteAddress(id);
        fetchAddresses();
      } catch (err) {
        console.error("Error deleting address:", err);
      }
    }
  };

  const handleSelectAddress = (address) => {
    onAddressSelect(address._id, address);
  };

  const resetForm = () => {
    setFormData({ city: "", street: "", phone: "" });
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="py-6 flex justify-center">
        <div className="w-6 h-6 border-2 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          Saved Addresses
        </h4>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
            showForm ? "text-rose-500" : "text-orange-500"
          }`}
        >
          {showForm ? (
            <>
              <X size={12} /> Cancel
            </>
          ) : (
            <>
              <Plus size={12} /> Add New
            </>
          )}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 space-y-4 animate-fadeIn"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase ml-2 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="New York"
                className="w-full bg-white border border-slate-100 px-4 py-2.5 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {errors.city && (
                <p className="text-[10px] text-rose-500 font-bold mt-1 ml-2">
                  {errors.city}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase ml-2 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="1234567890"
                className="w-full bg-white border border-slate-100 px-4 py-2.5 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
              />
              {errors.phone && (
                <p className="text-[10px] text-rose-500 font-bold mt-1 ml-2">
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[9px] font-black text-slate-400 uppercase ml-2 mb-1">
              Street Address
            </label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) =>
                setFormData({ ...formData, street: e.target.value })
              }
              placeholder="123 Foodie Street"
              className="w-full bg-white border border-slate-100 px-4 py-2.5 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-orange-500/20"
            />
            {errors.street && (
              <p className="text-[10px] text-rose-500 font-bold mt-1 ml-2">
                {errors.street}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitLoading}
            className="w-full bg-slate-900 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-slate-200 hover:bg-orange-500 transition-all disabled:opacity-50"
          >
            {submitLoading
              ? "Processing..."
              : editingId
                ? "Update Address"
                : "Save Address"}
          </button>
        </form>
      )}

      {/* Addresses List */}
      <div className="grid gap-3">
        {addresses.length === 0 ? (
          <div className="text-center py-6 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              No addresses saved
            </p>
          </div>
        ) : (
          addresses.map((address) => (
            <div
              key={address._id}
              onClick={() => handleSelectAddress(address)}
              className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedAddressId === address._id
                  ? "border-orange-500 bg-orange-50/30"
                  : "border-slate-100 bg-white hover:border-slate-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 p-2 rounded-lg ${selectedAddressId === address._id ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-400"}`}
                  >
                    <MapPin size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 leading-tight">
                      {address.street}, {address.city}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-slate-400">
                      <Phone size={10} /> {address.phone}
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(address);
                    }}
                    className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(address._id);
                    }}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
