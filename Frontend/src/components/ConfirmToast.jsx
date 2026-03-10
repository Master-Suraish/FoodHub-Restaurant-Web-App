import { AlertCircle } from "lucide-react";

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex justify-center items-start pt-10 px-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md animate-fadeIn"
        onClick={onCancel}
      />

      {/* The Modal Box */}
      <div className="relative bg-slate-900 border border-slate-700 w-full max-w-sm rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden animate-toastIn">
        <div className="p-8 flex flex-col items-center text-center">
          {/* Warning Icon */}
          <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="text-rose-500" size={32} />
          </div>

          <h3 className="text-white text-xl font-black tracking-tight mb-2">
            Are you sure?
          </h3>
          <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
            {message}
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 bg-slate-800 text-slate-300 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-700 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-rose-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-rose-500 shadow-lg shadow-rose-600/20 transition-all"
            >
              Confirm
            </button>
          </div>
        </div>

        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-orange-500" />
      </div>
    </div>
  );
}
