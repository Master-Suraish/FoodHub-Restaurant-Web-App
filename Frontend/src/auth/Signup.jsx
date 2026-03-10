import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiClient } from "../services/api";
import { useToast } from "../context/ToastContext";
import { Eye, EyeOff } from "lucide-react";

import {
  User,
  Mail,
  Phone,
  Briefcase,
  Lock,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function Signup() {
  const showToast = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    experience: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const response = await apiClient.post("/auth/user/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        experience: Number(formData.experience),
      });

      showToast("User created successfully", "success");
      setTimeout(() => {
        navigate("/login");
      }, 4000);
    } catch (error) {
      const data = error?.response?.data;

      if (data?.errors) {
        const fieldErrors = {};

        data.errors.forEach((err) => {
          const fieldName = err.path[0];
          fieldErrors[fieldName] = err.message;
        });

        setErrors(fieldErrors);
        setServerError("");
      }

      // Server error
      else if (data?.message) {
        setServerError(data.message);
        setErrors({});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-100/50 blur-3xl"></div>
      </div>

      <div className="w-full max-w-xl">
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden border border-gray-100">
          <div className="px-8 pt-10 pb-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white text-3xl mb-4 shadow-lg shadow-indigo-200">
              🍽️
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Create an account
            </h2>
            <p className="mt-2 text-gray-500 font-medium">
              Join our community of professionals today.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 pb-10 space-y-5">
            {/* Server error */}
            {serverError && (
              <div className="mt-2">
                <p className="bg-red-100 text-red-700 border border-red-300 px-3 py-2 rounded-md shadow-sm font-medium">
                  {serverError}
                </p>
              </div>
            )}

            {/* Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Full Name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-200 ${
                      errors.name
                        ? "border-red-400 focus:border-red-500 bg-red-50/30"
                        : "border-transparent focus:border-indigo-500 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-xs font-medium mt-1 ml-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email Address */}
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
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-200 ${
                      errors.email
                        ? "border-red-400 focus:border-red-500 bg-red-50/30"
                        : "border-transparent focus:border-indigo-500 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs font-medium mt-1 ml-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Experience */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Shopping Experience (Years)
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <Briefcase size={18} />
                  </div>
                  <input
                    type="tel"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. 5"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-200 ${
                      errors.experience
                        ? "border-red-400 focus:border-red-500 bg-red-50/30"
                        : "border-transparent focus:border-indigo-500 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.experience && (
                  <p className="text-red-500 text-xs font-medium mt-1 ml-1">
                    {errors.experience}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Phone Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-600 transition-colors">
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="03xxxxxxxxx"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl outline-none transition-all duration-200 ${
                      errors.phone
                        ? "border-red-400 focus:border-red-500 bg-red-50/30"
                        : "border-transparent focus:border-indigo-500 focus:bg-white"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs font-medium mt-1 ml-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password */}
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
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full pl-10 pr-10 py-3 bg-gray-50 border-2 rounded-xl outline-none ${
                        errors.password
                          ? "border-red-400 focus:border-red-500 bg-red-50/30"
                          : "border-transparent focus:border-indigo-500 focus:bg-white"
                      }`}
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
                {errors.password && (
                  <p className="text-red-500 text-xs font-medium mt-1 ml-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Confirm Password
                </label>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <ShieldCheck size={18} />
                  </div>

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full pl-10 pr-10 py-3 bg-gray-50 border-2 rounded-xl outline-none ${
                      errors.confirmPassword
                        ? "border-red-400 focus:border-red-500 bg-red-50/30"
                        : "border-transparent focus:border-indigo-500 focus:bg-white"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs font-medium mt-1 ml-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="py-2">
              <label className="flex items-center group cursor-pointer">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
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
                <span className="ml-3 text-sm text-gray-600">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    Terms
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-indigo-600 font-semibold hover:underline"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !agreeTerms}
              className="w-full relative flex items-center justify-center gap-2 py-4 px-6 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group shadow-lg shadow-indigo-100"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>

            {/* Link to Login */}
            <p className="text-center text-gray-600 text-sm pt-2 font-medium">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
