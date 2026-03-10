import { useState, useEffect } from "react";
import { foodAPI } from "../services/api";
import { useToast } from "../context/ToastContext";
import { useSearchParams } from "react-router-dom";
import ConfirmToast from "../components/ConfirmToast";

import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Image as ImageIcon,
  Star,
  Tag,
  DollarSign,
  Loader2,
} from "lucide-react";

export default function FoodForm({ setFoods }) {
  const showToast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [confirmData, setConfirmData] = useState({
    isOpen: false,
    id: null,
    name: "",
  });

  const initialPage = parseInt(searchParams.get("page")) || 1;
  const initialSearch = searchParams.get("search") || "";

  const [localFoods, setLocalFoods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialCategory = searchParams.get("category") || "all";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "popular",
    image: "",
    description: "",
    rating: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const params = {
      page: page.toString(),
      category: selectedCategory,
    };

    if (searchTerm) params.search = searchTerm;

    setSearchParams(params);
  }, [page, searchTerm, selectedCategory]);

  useEffect(() => {
    fetchFoods();
  }, [page, searchTerm, selectedCategory]);

  const fetchFoods = async () => {
    try {
      setPageLoading(true);

      const category = selectedCategory === "all" ? "all" : selectedCategory;

      const response = await foodAPI.getAllFoods(page, 8, category, searchTerm);

      const foods = response.data.data || [];

      setLocalFoods(foods);

      if (setFoods) setFoods(foods);

      if (response.data.pagination) {
        setTotalPages(response.data.pagination.pages || 1);
      }
    } catch (err) {
      console.error("Error:", err);
      showToast("Error loading foods", "error");
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "rating"
          ? value === ""
            ? ""
            : parseFloat(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await foodAPI.updateFood(editingId, formData);
        showToast(`${formData.name} food updated`, "success");
      } else {
        await foodAPI.addFood(formData);
        showToast(`${formData.name} food added to inventory`, "success");
        setPage(1);
      }
      fetchFoods();
      resetForm();
    } catch (err) {
      const data = err?.response?.data || "nothing";

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
      setLoading(false);
    }
  };

  const handleEdit = (food) => {
    setFormData({
      name: food.name,
      price: food.price,
      category: food.category,
      image: food.image,
      description: food.description,
      rating: food.rating || 0,
    });
    setEditingId(food._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = (id, name) => {
    setConfirmData({ isOpen: true, id, name });
  };

  const handleConfirmDelete = async () => {
    const { id, name } = confirmData;
    setConfirmData({ ...confirmData, isOpen: false });

    try {
      setLoading(true);
      await foodAPI.deleteFood(id);
      await fetchFoods();
      showToast(`Food ${name} has been removed.`, "success");
    } catch (err) {
      showToast("Could not delete food.", "error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "popular",
      image: "",
      description: "",
      rating: "",
    });
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-8 font-sans">
      <ConfirmToast
        isOpen={confirmData.isOpen}
        message={`This will permanently delete ${confirmData.name}. This action cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmData({ ...confirmData, isOpen: false })}
      />
      <div className="max-w-6xl mx-auto">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic">
              Menu{" "}
              <span className="text-orange-600 not-italic underline decoration-orange-200 decoration-4 underline-offset-4">
                Inventory.
              </span>
            </h1>
            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest mt-2">
              Add, edit, or remove catalog items
            </p>
          </div>
          <button
            onClick={() => (showForm ? resetForm() : setShowForm(true))}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] transition-all shadow-lg ${
              showForm
                ? "bg-white text-slate-900 border-2 border-slate-900 hover:bg-slate-900 hover:text-white"
                : "bg-orange-600 text-white shadow-orange-500/20 hover:bg-orange-700"
            }`}
          >
            {showForm ? (
              <X size={16} strokeWidth={3} />
            ) : (
              <Plus size={16} strokeWidth={3} />
            )}
            {showForm ? "Close Form" : "Add New Food"}
          </button>
        </div>

        {/* FORM SECTION */}
        {showForm && (
          <div className="bg-white rounded-[2.5rem] border-2 border-slate-200 shadow-2xl p-8 md:p-12 mb-12 animate-in slide-in-from-top-4 duration-500">
            <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight flex items-center gap-3">
              <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
              {editingId ? "Update Menu Item" : "Create New Menu Item"}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="grid md:grid-cols-3 gap-10"
            >
              <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest ml-1">
                    Item Name
                  </label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-slate-800 placeholder-slate-300"
                    placeholder="e.g. Spicy Pepperoni"
                  />
                  {errors.name && (
                    <p className="text-rose-600 text-[10px] font-black ml-1 uppercase">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest ml-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all font-bold text-slate-800"
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="text-rose-500 text-[10px] font-bold ml-2">
                      {errors.price}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest ml-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 rounded-2xl outline-none font-bold text-slate-800 focus:border-orange-500 transition-all appearance-none"
                  >
                    <option value="popular">Popular</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Sides">Sides</option>
                    <option value="Salad">Salad</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Beverage">Beverage</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest ml-1">
                    Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 rounded-2xl outline-none font-bold text-slate-800 focus:border-orange-500"
                    placeholder="5.0"
                  />
                  {errors.rating && (
                    <p className="text-rose-500 text-[10px] font-bold ml-2">
                      {errors.rating}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest ml-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 rounded-2xl outline-none font-bold text-slate-800 focus:border-orange-500 transition-all resize-none"
                    placeholder="Enter ingredients and details...(min 8 characters)"
                  />
                  {errors.description && (
                    <p className="text-rose-500 text-[10px] font-bold ml-2">
                      {errors.description}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[11px] font-black text-slate-900 uppercase tracking-widest ml-1">
                    Image URL
                  </label>
                  <input
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border-2 border-slate-100 px-5 py-4 rounded-2xl outline-none font-bold text-slate-800 focus:border-orange-500"
                    placeholder="https://image-link.com"
                  />
                  {errors.image && (
                    <p className="text-rose-500 text-[10px] font-bold ml-2">
                      {errors.image}
                    </p>
                  )}
                </div>
              </div>

              {/* LIVE PREVIEW */}
              <div className="bg-slate-950 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-2xl">
                {formData.image ? (
                  <img
                    src={formData.image}
                    className="w-full aspect-square object-cover rounded-[1.5rem] mb-6 border-4 border-slate-800 shadow-xl"
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/300?text=Invalid+Image")
                    }
                  />
                ) : (
                  <div className="w-full aspect-square bg-slate-800 rounded-[1.5rem] mb-6 flex items-center justify-center text-slate-600 border-2 border-dashed border-slate-700">
                    <ImageIcon size={48} strokeWidth={1} />
                  </div>
                )}
                <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3">
                  Live Preview
                </span>
                <h3 className="font-black text-white text-lg tracking-tight truncate w-full">
                  {formData.name || "Food Name"}
                </h3>
                <p className="text-orange-400 font-black mt-1">
                  ${formData.price || "0.00"}
                </p>
              </div>

              <div className="md:col-span-3 pt-6 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-black text-xs max-sm:px-2 uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : editingId ? (
                    "Save Changes"
                  ) : (
                    "Confirm & Add to Menu"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-10">
          {[
            { label: "All", value: "all" },
            { label: "Pizza", value: "Pizza" },
            { label: "Burger", value: "Burger" },
            { label: "Beverage", value: "Beverage" },
            { label: "Dessert", value: "Dessert" },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setSelectedCategory(cat.value);
                setPage(1);
              }}
              className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border-2 border-slate-900 transition-all
      ${
        selectedCategory === cat.value
          ? "bg-orange-500 text-white"
          : "shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] bg-white text-slate-900 hover:bg-slate-50"
      }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* CATALOG SECTION */}
        <div className="bg-white rounded-[2.5rem] border-2 border-slate-300 shadow-2xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10 pb-6 border-b border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <Tag className="text-orange-500" size={24} strokeWidth={3} />
              Menu Catalog
            </h2>
            <div className="relative w-full md:w-96">
              <Search
                className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-900"
                size={18}
                strokeWidth={3}
              />
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-100 border-2 border-slate-100 pl-14 pr-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:bg-white focus:border-orange-500 transition-all shadow-sm"
                placeholder="Search food by name..."
              />
            </div>
          </div>

          {pageLoading ? (
            <div className="py-24 flex justify-center">
              <Loader2
                className="animate-spin text-orange-500"
                size={40}
                strokeWidth={3}
              />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {localFoods.map((food) => (
                  <div
                    key={food._id}
                    className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-white border-2 border-slate-200 rounded-[2rem] hover:border-slate-900 hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative shrink-0 w-full sm:w-auto">
                      <img
                        src={food.image}
                        className="w-full h-52 sm:w-28 sm:h-28 object-contain max-sm:object-cover sm:object-cover rounded-2xl shadow-md group-hover:scale-105 transition-transform duration-500"
                      />

                      <div className="absolute top-2 left-2 sm:-top-2 sm:-left-2 bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter shadow-lg">
                        {food.category}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 w-full">
                      <h4 className="font-black text-slate-900 text-sm sm:text-base mb-1 truncate">
                        {food.name}
                      </h4>

                      <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed mb-3">
                        {food.description}
                      </p>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-slate-900 font-black text-sm">
                          <DollarSign
                            size={14}
                            className="text-orange-600"
                            strokeWidth={3}
                          />
                          {food.price.toFixed(2)}
                        </div>

                        <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg font-black text-[10px]">
                          <Star size={12} className="fill-amber-600" />
                          {food.rating || "5.0"}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto">
                      <button
                        onClick={() => handleEdit(food)}
                        className="flex-1 sm:flex-none sm:w-10 sm:h-10 flex items-center justify-center gap-2 bg-slate-100 text-slate-900 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm py-2 sm:py-0"
                      >
                        <Edit3 size={18} />
                        <span className="sm:hidden text-xs font-bold">
                          Edit
                        </span>
                      </button>

                      <button
                        onClick={() => handleDeleteClick(food._id, food.name)}
                        className="flex-1 sm:flex-none sm:w-10 sm:h-10 flex items-center justify-center gap-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm py-2 sm:py-0"
                      >
                        <Trash2 size={18} />
                        <span className="sm:hidden text-xs font-bold">
                          Delete
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* PAGINATION */}

              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center font-bold hover:bg-orange-500 hover:text-white transition-all disabled:opacity-20"
                >
                  ←
                </button>
                <div className="bg-white px-6 py-3 rounded-2xl shadow-sm font-bold border border-slate-100">
                  {page} / {totalPages}
                </div>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center font-bold hover:bg-orange-500 hover:text-white transition-all disabled:opacity-20"
                >
                  →
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
