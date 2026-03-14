import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { Mail, Lock, LogIn, ArrowRight } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { Eye, EyeOff } from "lucide-react";

export default function Login({ setUserAfterLogin }) {
  const showToast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await authAPI.login(email, password);

      setUserAfterLogin(response.data.user);
      const username = response.data.user.name;
      showToast(`Welcome back ${username}, Great to see you again!`, "success");

      navigate("/");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Login failed. Please check your credentials.";
      showToast(message, "error");
      setErrors({ api: message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-3xl"></div>
      </div>

      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100">
          <div className="px-8 pt-10 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white text-3xl mb-4 shadow-lg shadow-indigo-200">
              🍽️
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-500 font-medium">
              Please enter your details to sign in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-5">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-200 }`}
                />
              </div>
            </div>

            {/* Password Field */}
            {/* <div className="space-y-1">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  size="sm"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-200`}
                />
              </div>
            </div> */}

            <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock size={18} />
                    </div>

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-200`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
              </div>

            {/* Remember Me */}
            <div className="py-1">
              <label className="flex items-center group cursor-pointer">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-indigo-600 checked:border-indigo-600 transition-all duration-200 cursor-pointer"
                  />
                  <svg
                    className="absolute w-3 h-3 text-white hidden peer-checked:block pointer-events-none"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="4"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="ml-3 text-sm text-gray-600 font-medium">
                  Remember this device
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full relative flex items-center justify-center gap-2 py-4 px-6 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group shadow-lg shadow-indigo-100"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>

            {/* Link to Signup */}
            <p className="text-center text-gray-600 text-sm pt-4 font-medium">
              New here?{" "}
              <Link
                to="/signup"
                className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
              >
                Create an account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
