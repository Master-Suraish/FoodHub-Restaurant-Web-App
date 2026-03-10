import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { userAPI } from "../services/api";
import { useToast } from "../context/ToastContext";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const showToast = useToast();

  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage("Invalid verification link.");
        return;
      }

      try {
        const res = await userAPI.verifyEmail(token);
        setStatus("success");

        showToast("Email verified! Redirecting to login...", "success");

        setTimeout(() => {
          navigate("/login");
        }, 4000);
      } catch (err) {
        setStatus("error");
        setErrorMessage(err.response?.data?.message || "Verification failed");
        showToast("Verification failed. Link may be expired.", "error");
      }
    };

    verify();
  }, [token, navigate, showToast]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4">
      {/* Brand Logo at top */}
      <div className="mb-8 text-3xl font-black tracking-tighter text-slate-900">
        Food<span className="text-orange-500">Hub</span>
      </div>

      <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(15,23,42,0.08)] border border-slate-100 w-full max-w-md text-center">
        {/* LOADING STATE */}
        {status === "loading" && (
          <div className="flex flex-col items-center">
            <Loader2 className="text-orange-500 animate-spin mb-4" size={48} />
            <h2 className="text-xl font-bold text-slate-900">
              Verifying Account
            </h2>
            <p className="text-slate-500 mt-2">Please wait a moment...</p>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === "success" && (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="text-emerald-500" size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Email Verified!
            </h2>
            <p className="text-slate-500 mt-3 font-medium">
              Your account is now active. Goto login page.
            </p>
            <div className="mt-8 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 animate-[progress_3s_linear]" />
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {status === "error" && (
          <div className="animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="text-rose-500" size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Oops!
            </h2>
            <p className="text-rose-600 mt-2 font-bold">{errorMessage}</p>
            <p className="text-slate-500 mt-4 text-sm">
              This link may be expired or already used. Please try signing up
              again.
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="mt-8 w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
            >
              Back to Signup
            </button>
          </div>
        )}
      </div>

      <p className="mt-8 text-slate-400 text-sm font-medium">
        © {new Date().getFullYear()} FoodHub Inc.
      </p>
    </div>
  );
};

export default VerifyEmailPage;
