import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white mt-12 py-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Section: Branding and Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link
              to="/"
              className="text-2xl font-black tracking-tighter mb-4 block"
            >
              Food<span className="text-orange-500">Hub.</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Bringing the city's finest flavors to your doorstep. Fresh, fast,
              and always delicious.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 mb-4">
              Explore
            </h3>
            <ul className="space-y-2 text-sm font-bold text-slate-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Your Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 mb-4">
              Support
            </h3>
            <ul className="space-y-2 text-sm font-bold text-slate-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500 mb-4">
              Get In Touch
            </h3>
            <ul className="space-y-2 text-sm font-bold text-slate-300">
              <li className="flex items-center gap-2">
                <span>📞</span> (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <span>📧</span> support@foodhub.com
              </li>
              <li className="text-slate-500 font-medium text-xs mt-2">
                Open 24/7 for your cravings.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Copyright & Socials */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs font-bold">
            © {currentYear} FoodHub Inc. Built with ❤️ for foodies.
          </p>

          <div className="flex gap-4">
            {["f", "𝕏", "📷", "in"].map((social, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-sm hover:bg-orange-500 hover:text-white transition-all duration-300"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
