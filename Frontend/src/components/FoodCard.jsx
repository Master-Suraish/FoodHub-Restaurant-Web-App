import { useState } from "react";

export default function FoodCard({ food, onAddToCart }) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(food);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col h-full">
      {/* 1. Image Area  */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {/* Badges*/}
        <div className="absolute top-3 inset-x-3 flex justify-between items-start">
          <span className="bg-white/90 backdrop-blur-md text-slate-900 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm">
            ⭐ {food.rating || "0"}
          </span>
          <span className="bg-orange-500 text-white px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg shadow-orange-500/20">
            {food.category || "Main"}
          </span>
        </div>
      </div>

      {/* 2. Content Area  */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-md font-black text-slate-900 leading-tight line-clamp-1">
            {food.name}
          </h3>
          <span className="text-orange-500 font-black text-sm ml-2">
            ${food.price?.toFixed(2)}
          </span>
        </div>

        <p className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-2 mb-4 flex-grow">
          {food.description ||
            "Fresh ingredients, expertly prepared for your enjoyment."}
        </p>

        {/* 3. Actions */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={handleAddToCart}
            className={`flex-[2] py-2.5 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 ${
              isAdded
                ? "bg-green-500 text-white shadow-lg shadow-green-100"
                : "bg-slate-900 text-white hover:bg-orange-500 shadow-lg shadow-slate-200"
            }`}
          >
            {isAdded ? "✓ Added" : "🛒 Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
