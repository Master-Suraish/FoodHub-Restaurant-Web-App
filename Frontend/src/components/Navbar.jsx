import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  ShoppingCart,
  LogOut,
  User as UserIcon,
  House,
  Info,
  CircleUser,
  LayoutDashboard,
  ClipboardList,
} from "lucide-react";

export default function Navbar({ cartCount, user, handleLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-[100] bg-white border-b-2 border-slate-100 px-4 md:px-8 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* LOGO */}
        <div className="flex items-center gap-10">
          <Link
            to="/"
            onClick={closeMenu}
            className="text-3xl font-black tracking-tighter text-slate-900 italic"
          >
            Food<span className="text-orange-600">Hub.</span>
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-[0.15em] text-slate-500">
            <Link
              to="/"
              className="hover:text-orange-600 transition-colors flex items-center gap-1.5"
            >
              <House size={18} /> Home
            </Link>
            <Link
              to="/about"
              className="hover:text-orange-600 transition-colors flex items-center gap-1.5"
            >
              <Info size={18} /> About
            </Link>
            <Link
              to="/contact"
              className="hover:text-orange-600 transition-colors flex items-center gap-1.5"
            >
              <CircleUser size={18} /> Contact
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 flex items-center gap-2"
              >
                <LayoutDashboard size={14} /> Admin
              </Link>
            )}

            {user && (
              <Link
                to="/order"
                className="hover:text-orange-600 transition-colors flex items-center gap-1.5"
              >
                <ClipboardList size={18} /> Orders
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-3 md:gap-6">
          {user && (
            <Link
              to="/cart"
              onClick={closeMenu}
              className="relative p-3 bg-slate-900 text-white rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-slate-200"
            >
              <ShoppingCart size={20} strokeWidth={2.5} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white font-black text-xs w-6 h-6 flex items-center justify-center rounded-full border-2 border-white animate-bounce">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* AUTH BUTTONS  */}
          <div className="hidden md:flex items-center gap-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-xs font-black uppercase tracking-widest text-slate-600 px-4 py-2 hover:text-orange-600"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="text-xs font-black uppercase tracking-widest bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-orange-600 transition-all shadow-xl shadow-slate-200"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-4 pl-4 border-l-2 border-slate-100">
                <div className="text-right">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Operator
                  </p>
                  <p className="text-sm font-black text-slate-900">
                    {user.name}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-3 text-rose-600 bg-rose-50 rounded-2xl hover:bg-rose-600 hover:text-white transition-all border border-rose-100"
                >
                  <LogOut size={20} strokeWidth={2.5} />
                </button>
              </div>
            )}
          </div>

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-3 bg-slate-100 text-slate-900 rounded-2xl hover:bg-slate-200 transition-all"
          >
            {isOpen ? (
              <X size={24} strokeWidth={3} />
            ) : (
              <Menu size={24} strokeWidth={3} />
            )}
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b-4 border-orange-500 shadow-2xl animate-in slide-in-from-top duration-300 z-40">
          <div className="flex flex-col p-6 gap-4">
            {user && (
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl mb-2">
                <div className="w-11 h-11 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-slate-400 font-bold uppercase">
                    Operator
                  </p>
                  <p className="text-sm font-bold text-slate-900 ">
                    {user.name}
                  </p>
                </div>
              </div>
            )}

            <Link
              to="/"
              onClick={closeMenu}
              className="text-md font-black text-slate-900 hover:text-orange-600 py-2 flex items-center justify-between"
            >
              HOME <ChevronRight size={20} />
            </Link>
            <Link
              to="/about"
              onClick={closeMenu}
              className="text-md font-black text-slate-900 hover:text-orange-600 py-2 flex items-center justify-between"
            >
              ABOUT <ChevronRight size={20} />
            </Link>
            <Link
              to="/contact"
              onClick={closeMenu}
              className="text-md font-black text-slate-900 hover:text-orange-600 py-2 flex items-center justify-between"
            >
              CONTACT <ChevronRight size={20} />
            </Link>

            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className="text-lg font-black text-orange-600 bg-orange-50 p-4 rounded-2xl flex items-center justify-between"
              >
                ADMIN PANEL <LayoutDashboard size={20} />
              </Link>
            )}

            {user && (
              // <Link
              //   to="/order"
              //   onClick={closeMenu}
              //   className="text-md font-black text-slate-900 py-2 flex items-center justify-between"
              // >
              //   MY ORDERS <ClipboardList size={20} />
              // </Link>
              <Link
                to="/order"
                onClick={closeMenu}
                className="text-md font-black text-slate-900 hover:text-orange-600 py-2 flex items-center justify-between"
              >
                MY ORDERS <ClipboardList size={20} />
              </Link>
            )}

            <div className="mt-4 pt-6 border-t-2 border-slate-50 flex flex-col gap-4">
              {!user ? (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="w-full py-4 text-center font-black text-slate-600 rounded-2xl bg-slate-50"
                  >
                    LOG IN
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMenu}
                    className="w-full py-4 text-center font-black text-white bg-slate-900 rounded-2xl shadow-lg"
                  >
                    SIGN UP
                  </Link>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="w-full py-4 px-6 flex items-center justify-center gap-3 font-black text-white bg-rose-600 rounded-2xl shadow-lg shadow-rose-200"
                >
                  <LogOut size={20} /> SIGN OUT
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

function ChevronRight({ size }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
