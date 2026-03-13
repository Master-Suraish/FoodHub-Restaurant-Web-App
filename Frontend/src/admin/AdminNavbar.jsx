import { useState } from "react";
import {Link} from "react-router-dom"
import {
  Menu,
  X,
  LogOut,
  Users,
  ShoppingBag,
  Utensils,
  UserCircle,
  MessageSquare,
} from "lucide-react";

export default function AdminNavbar({ user, handleLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Orders", icon: <ShoppingBag size={18} />, href: "/admin/orders" },
    { name: "Users", icon: <Users size={18} />, href: "/admin/users" },
    { name: "Inventory", icon: <Utensils size={18} />, href: "/admin/foods" },

    {
      name: "Inbox",
      icon: <MessageSquare size={18} />,
      href: "/admin/contacts",
    },
  ];

  return (
    <nav className="bg-[#0f172a] border-b border-slate-800 sticky top-0 z-50 shadow-xl">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10">
        <div className="flex justify-between items-center h-20">
          {/* LEFT: LOGO */}
          <div className="flex items-center flex-1">
            <h1 className="text-xl font-black text-white tracking-tighter italic leading-none">
              Admin<span className="text-orange-500 not-italic">Panel.</span>
            </h1>
          </div>

          {/* CENTER: DESKTOP LINKS */}
          <div className="hidden md:flex items-center justify-center gap-10 flex-[2]">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all flex items-center gap-2 group"
              >
                <span className="text-slate-500 group-hover:text-orange-500 transition-colors">
                  {link.icon}
                </span>
                {link.name}
              </Link>
            ))}
          </div>

          {/* RIGHT: ADMIN NAME + LOGOUT */}
          <div className="hidden md:flex items-center justify-end gap-6 flex-1">
            {/* Admin Name Section */}
            {user?.name && (
              <div className="flex items-center gap-3 pr-6 border-r border-slate-700">
                <div className="text-right">
                  <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none mb-1">
                    Administrator
                  </p>
                  <p className="text-sm font-black text-white leading-none">
                    {user.name}
                  </p>
                </div>
                <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 border border-slate-700">
                  <UserCircle size={20} />
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-500/10 hover:bg-rose-600 text-rose-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-rose-500/20 group"
            >
              <LogOut
                size={14}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Logout
            </button>
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg transition-all"
            >
              {isOpen ? (
                <X size={24} className="text-white" />
              ) : (
                <Menu size={24} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-6 bg-[#0f172a] border-t border-slate-800 space-y-2">
          {user?.name && (
            <div className="px-4 py-4 mb-2 bg-slate-900/50 rounded-2xl flex items-center gap-3 border border-slate-800">
              <UserCircle size={20} className="text-slate-500" />
              <div>
                <p className="text-[9px] text-slate-500 font-bold uppercase">
                  Logged in as
                </p>
                <p className="text-sm font-black text-white">{user.name}</p>
              </div>
            </div>
          )}
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-slate-900/50 text-slate-300 font-bold text-sm hover:bg-orange-500 hover:text-white transition-all"
            >
              <span className="text-orange-500 group-hover:text-white">
                {link.icon}
              </span>
              {link.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-rose-500/10 text-rose-500 font-bold text-sm border border-rose-500/20"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
