import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* --- 1. HERO SECTION  --- */}
      <section className="py-16 text-center border-b border-slate-50">
        <div className="container-custom px-6">
          <span className="text-orange-500 font-bold uppercase tracking-wider text-xs bg-orange-50 px-3 py-1 rounded-full">
            Our Story
          </span>
          <h1 className="text-4xl md:text-5xl font-black mt-4 mb-4 tracking-tight">
            About <span className="text-orange-500">FoodHub.</span>
          </h1>
          <p className="max-w-xl mx-auto text-base md:text-lg text-slate-500 font-medium">
            We bring the city's most delicious flavors straight to your
            doorstep, fresh and full of soul.
          </p>
        </div>
      </section>

      {/* --- 2. OUR JOURNEY --- */}
      <section className="py-12">
        <div className="container-custom px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-black italic">How we started</h2>
              <p className="text-slate-600 leading-relaxed">
                FoodHub was founded in 2023. What started as a small idea has
                grown into a platform serving thousands of satisfied customers.
                We partner with local chefs to ensure every meal is worth
                remembering.
              </p>
              <div className="h-1 w-12 bg-orange-500 rounded-full"></div>
            </div>

            <div className="bg-slate-50 rounded-3xl p-8 text-center border border-slate-100">
              <h3 className="text-4xl font-black text-slate-900 mb-1">50K+</h3>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                Happy Customers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. MISSION & VISION --- */}
      <section className="py-12 bg-slate-50 rounded-[2rem] mx-4">
        <div className="container-custom px-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-xl font-black mb-2">Our Mission</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                To deliver the finest quality food with exceptional service,
                making dining convenient for everyone.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-3xl mb-3">🚀</div>
              <h3 className="text-xl font-black mb-2">Our Vision</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                To become the leading food delivery platform globally, known for
                reliability and quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. TEAM SECTION --- */}
      <section className="py-10 md:py-12">
        <div className="container-custom px-4 md:px-6 text-center">
          <h2 className="text-xl md:text-2xl font-black mb-8 md:mb-10 italic">
            Meet the Team
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {[
              { name: "John Doe", role: "CEO", e: "👨‍💼" },
              { name: "Sarah Smith", role: "Ops", e: "👩‍💼" },
              { name: "Mike Johnson", role: "Tech", e: "👨‍💻" },
              { name: "Emma Wilson", role: "Support", e: "🎧" },
            ].map((member, i) => (
              <div
                key={i}
                className="p-6 md:p-8 lg:p-10 bg-white border rounded-2xl shadow-xl"
              >
                <div className="text-5xl md:text-6xl mb-3 md:mb-4">
                  {member.e}
                </div>
                <h4 className="font-bold text-slate-900 text-sm md:text-base">
                  {member.name}
                </h4>
                <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-wider">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 5. VALUES --- */}
      <section className="py-10 md:py-12 bg-white border-t border-slate-50">
        <div className="container-custom px-4 md:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { t: "Quality", i: "❤️" },
              { t: "Trust", i: "🤝" },
              { t: "Innovation", i: "🌱" },
            ].map((v, i) => (
              <div
                key={i}
                className="text-center p-5 md:p-6 border border-slate-50 rounded-xl"
              >
                <div className="text-5xl md:text-6xl lg:text-7xl mb-3 md:mb-4">
                  {v.i}
                </div>
                <h4 className="font-black text-sm md:text-base">{v.t}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 6. CTA SECTION --- */}
      <section className="py-12">
        <div className="container-custom px-6">
          <div className="bg-orange-500 rounded-3xl p-10 text-center text-white shadow-lg">
            <h2 className="text-3xl font-black mb-6">Ready to eat?</h2>
            <button
              className="bg-white text-orange-600 px-8 py-3 rounded-xl font-black text-md hover:shadow-md transition-all"
              onClick={() => navigate("/")}
            >
              Order Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
