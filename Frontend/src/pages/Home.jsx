import { useState, useEffect, useMemo } from "react";
import FoodCard from "../components/FoodCard";
import { foodAPI, cartAPI } from "../services/api";
import { useSearchParams } from "react-router-dom";
import { useToast } from "../context/ToastContext";

const categories = [
  { id: "Pizza", label: "Pizza", emoji: "🍕" },
  { id: "Burger", label: "Burger", emoji: "🍔" },
  { id: "Sides", label: "Sides", emoji: "🍟" },
  { id: "Salad", label: "Salad", emoji: "🥗" },
  { id: "Dessert", label: "Dessert", emoji: "🍰" },
  { id: "Beverage", label: "Beverage", emoji: "🥤" },
];

export default function Home() {
  const showToast = useToast(); // Initialize the toast function
  const [searchParams, setSearchParams] = useSearchParams();

  const initialCategory = searchParams.get("category") || "all";
  const initialPage = parseInt(searchParams.get("page")) || 1;

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setSearchParams({
      category: selectedCategory,
      page: page,
    });
  }, [selectedCategory, page]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const response = await foodAPI.getAllFoods(page, 8, selectedCategory);
        setFoods(response.data.data || []);
        setTotalPages(response.data.pagination.pages);
        setError(null);
      } catch (err) {
        setError("Failed to load foods. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchFoods();
  }, [page, selectedCategory]);

  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      const matchesSearch =
        (food.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (food.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        (food.category || "").toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [foods, searchTerm, selectedCategory]);

  const handleAddToCart = async (food) => {
    try {
      const user = localStorage.getItem("user");
      if (!user) {
        showToast("Please login to start ordering!", "error");
        return;
      }
      await cartAPI.addToCart(food._id, 1);
      showToast(`${food.name} added to cart successfully!`, "success");
    } catch (err) {
      showToast(`Failed to add to cart`, "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-slate-900">
      {/* --- HERO Section --- */}
      <section className="px-4 pt-10 pb-6">
        <div className="container-custom bg-gradient-to-br from-orange-400 to-rose-500 rounded-[2.5rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-orange-200">
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4 tracking-tight">
              Hungry? <br />
              <span className="text-yellow-300">We got you.</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 font-medium mb-8">
              The fastest delivery in the city, with the freshest ingredients.
            </p>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* --- CATEGORIES --- */}
      <section className="py-8">
        <div className="container-custom">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-8 py-3 rounded-2xl font-bold transition-all whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-slate-900 text-white shadow-xl scale-105"
                  : "bg-white text-slate-500 hover:bg-slate-100 shadow-sm"
              }`}
            >
              All ✨
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setPage(1);
                }}
                className={`px-8 py-3 rounded-2xl font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  selectedCategory === cat.id
                    ? "bg-orange-500 text-white shadow-xl scale-105"
                    : "bg-white text-slate-500 hover:bg-slate-100 shadow-sm"
                }`}
              >
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* --- FOOD GRID --- */}
      <section className="pb-20">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8 px-2">
            <h2 className="text-3xl font-black tracking-tight italic">
              {searchTerm ? "Results Found" : "Main Menu"}
            </h2>
            <div className="h-1 flex-grow mx-4 bg-slate-100 rounded-full"></div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white h-80 rounded-[2rem] animate-pulse"
                ></div>
              ))}
            </div>
          ) : filteredFoods.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredFoods.map((food) => (
                <div
                  key={food._id}
                  className="transition-transform duration-300 hover:-translate-y-2"
                >
                  <FoodCard food={food} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-[3rem] border-4 border-dashed border-slate-100">
              <span className="text-6xl">🍕</span>
              <h3 className="text-2xl font-bold mt-4">
                Nothing matches your search
              </h3>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                className="mt-4 text-orange-500 font-bold underline"
              >
                Show all food
              </button>
            </div>
          )}

          {/* --- PAGINATION --- */}
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
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section className="bg-white py-20 rounded-t-[4rem]">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { e: "🚀", t: "Fastest", d: "30 min delivery" },
              { e: "💎", t: "Quality", d: "Fresh ingredients" },
              { e: "👛", t: "Save", d: "Best prices in town" },
            ].map((f, i) => (
              <div key={i} className="group cursor-default">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  {f.e}
                </div>
                <h4 className="text-xl font-black mb-1">{f.t}</h4>
                <p className="text-slate-500">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
