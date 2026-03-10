import { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export default function Toast({ message, type = "success", onClose }) {
  const duration = 4000;

  const configs = {
    success: {
      bg: "bg-slate-900",
      border: "border-emerald-500/30",
      bar: "bg-[#10b981]",
      icon: <CheckCircle2 className="text-[#10b981]" size={20} />,
    },
    error: {
      bg: "bg-slate-900",
      border: "border-rose-500/30",
      bar: "bg-rose-500",
      icon: <AlertCircle className="text-rose-500" size={20} />,
    },
  };

  const config = configs[type] || configs.success;

  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-sm px-4 pt-6 pointer-events-none">
      <div
        className={`
        ${config.bg} ${config.border} 
        pointer-events-auto border shadow-2xl rounded-2xl overflow-hidden 
        animate-toastMain
      `}
      >
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="shrink-0">{config.icon}</div>
          <div className="flex-1">
            <p className="text-white text-sm font-bold leading-tight">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Timeline Progress Bar */}
        <div className="h-1 w-full bg-white/5">
          <div
            className={`h-full ${config.bar} animate-toastProgress`}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      </div>
    </div>
  );
}
