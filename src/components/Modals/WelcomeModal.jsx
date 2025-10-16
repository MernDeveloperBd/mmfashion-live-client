import { useEffect, useRef } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { AiOutlineCheckCircle } from "react-icons/ai";

const WelcomeModal = ({
  open,
  onClose,
  onResell,
  onShop
}) => {
  const primaryBtnRef = useRef(null);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Focus first action button when open (accessibility)
  useEffect(() => {
    if (open) primaryBtnRef.current?.focus();
  }, [open]);

  // Close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 "
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
      aria-describedby="welcome-modal-desc"
      onClick={(e) => {
        // overlay click to close
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-xl shadow-2xl ring-1 ring-black/5 transition-all"
        onClick={(e) => e.stopPropagation()} // prevent bubbling to overlay
      >
        {/* Top accent line */}
        <div className="absolute inset-x-0 -top-[1px] h-[3px] bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500 rounded-t-xl" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h3 id="welcome-modal-title" className="text-xl font-semibold text-slate-900">
            স্বাগতম! 👋
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 cursor-pointer"
            aria-label="Close"
          >
            <IoCloseSharp size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 text-slate-700">
          <p id="welcome-modal-desc" className="mb-3 text-[15px] leading-relaxed">
            আমাদের প্ল্যাটফর্মে আপনি দু’ভাবে উপকৃত হতে পারেন:
          </p>

          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-600">
                <AiOutlineCheckCircle size={18} />
              </span>
              <p className="text-[15.5px]">
                Reselling সুযোগ — আপনার কমিউনিটি/ক্লায়েন্টদের কাছে আমাদের পণ্য রিসেল করে আয় করতে পারবেন।
              </p>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 text-emerald-600 cursor-pointer">
                <AiOutlineCheckCircle size={18} />
              </span>
              <p className="text-[15.5px]">
                সরাসরি ক্রয় — কাস্টমাররা তাদের পছন্দমতো পণ্য এখান থেকেই অর্ডার করতে পারবেন।
              </p>
            </li>
          </ul>

          <div className="mt-5 p-3.5 bg-slate-50 rounded-md border border-slate-200 text-[14px] text-slate-600">
            আরও জানতে MM Fashion World এর সাপোরটে যোগাযোগ করুন।
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="px-6 pb-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
          <button
            ref={primaryBtnRef}
            onClick={onResell}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 cursor-pointer"
          >
            Reselling শুরু করুন
          </button>

          <button
            onClick={onShop}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 cursor-pointer"
          >
            এখনই কেনাকাটা করুন
          </button>

          
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;