import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../services/api";
import { useToast } from "../context/ToastContext";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  LayoutDashboard,
} from "lucide-react";

export default function AdminLogin({ setUserAfterLogin }) {
  const showToast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.post("/auth/admin/login", {
        email,
        password,
      });

      setUserAfterLogin(response.data.user);
      const username = response.data.user.name;
      showToast(
        `Welcome Admin ${username}, Great to see you again!`,
        "success",
      );

      navigate("/admin/foods");
    } catch (error) {
      const message = "Admin authentication failed.";
      showToast(message, "error");
      setErrors({
        api: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center py-12 px-4 font-sans relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[120px] -z-10 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-[120px] -z-10 opacity-60"></div>

      <div className="w-full max-w-[420px]">
        {/* Main Card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
          {/* Header Section */}
          <div className="px-8 pt-12 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-100 mb-6 transform transition-transform hover:scale-105 duration-300">
              <ShieldCheck size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Admin <span className="text-indigo-600">Portal</span>
            </h2>
            <p className="mt-2 text-slate-500 font-medium text-sm">
              Welcome back, Administrator.
            </p>
          </div>

          {errors.api && (
            <div className="mx-10 mb-2 p-4 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in zoom-in duration-300">
              <span className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full"></span>
              {errors.api}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-10 pb-12 space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Work Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@system.com"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all duration-200 font-medium text-slate-800 ${
                    errors.email
                      ? "border-red-200 focus:border-red-400"
                      : "border-transparent focus:border-indigo-500 focus:bg-white focus:shadow-lg focus:shadow-indigo-50"
                  }`}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Secret Key
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full pl-12 pr-4 py-4 bg-slate-50 border-2 rounded-2xl outline-none transition-all duration-200 text-slate-800 ${
                    errors.password
                      ? "border-red-200 focus:border-red-400"
                      : "border-transparent focus:border-indigo-500 focus:bg-white focus:shadow-lg focus:shadow-indigo-50"
                  }`}
                />
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative flex items-center justify-center gap-3 py-4 px-6 bg-slate-900 text-white font-bold rounded-2xl hover:bg-indigo-600 shadow-lg shadow-slate-100 hover:shadow-indigo-200 transition-all duration-300 disabled:opacity-70 group active:scale-[0.98]"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <LayoutDashboard size={18} />
                  <span>Enter Dashboard</span>
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>

            {/* Simple Navigation */}
            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-1"
              >
                goto user login
              </Link>
            </div>
          </form>
        </div>

        {/* Brand/Legal Text */}
        <p className="text-center text-slate-400 text-[10px] mt-10 font-bold uppercase tracking-[0.2em]">
          Secure Infrastructure &copy; 2026
        </p>
      </div>
    </div>
  );
}
