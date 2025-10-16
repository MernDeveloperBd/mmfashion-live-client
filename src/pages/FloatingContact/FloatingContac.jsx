import { useEffect, useRef, useState } from "react";
import { BsWhatsapp } from "react-icons/bs";
import { FaFacebookMessenger } from "react-icons/fa";
import { FiMessageSquare, FiX } from "react-icons/fi";

const FloatingContact = ({
  whatsappNumber = "8801749889595",
  messengerLink = "https://m.me/mmfashionworldonline",
  message = "হ্যালো MM Fashion World! আমি অর্ডার করতে চাই।",
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const handleEsc = (e) => e.key === "Escape" && setOpen(false);

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;

  const items = [
    {
      key: "wa",
      href: waHref,
      label: "WhatsApp",
      bg: "bg-emerald-500 hover:bg-emerald-600",
      Icon: BsWhatsapp,
    },
    {
      key: "ms",
      href: messengerLink,
      label: "Messenger",
      bg: "bg-sky-600 hover:bg-sky-700",
      Icon: FaFacebookMessenger,
    },
  ];

  return (
    <div
      ref={ref}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center"
      aria-live="polite"
    >
      {/* Decorative glow when open */}
      <div
        className={[
          "pointer-events-none absolute -inset-10 rounded-full blur-3xl transition-all duration-500",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
        style={{
          background:
            "radial-gradient(40% 40% at 70% 70%, rgba(124,58,237,.20), transparent 60%), radial-gradient(35% 35% at 30% 30%, rgba(244,63,94,.22), transparent 60%)",
        }}
      />

      {/* Expanded buttons */}
      <div
        className={[
          "mb-3 flex flex-col items-end gap-2 transition-all duration-300 origin-bottom",
          open
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none",
        ].join(" ")}
        aria-hidden={!open}
      >
        {items.map((it, idx) => (
          <a
            key={it.key}
            href={it.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
            tabIndex={open ? 0 : -1}
            style={{ transitionDelay: `${idx * 50}ms` }}
          >
            {/* Label chip */}
            <span
              className={[
                "absolute right-12 top-1/2 -translate-y-1/2",
                "max-w-0 overflow-hidden opacity-0 group-hover:max-w-[180px] group-hover:opacity-100",
                "transition-all duration-300",
              ].join(" ")}
            >
              <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-900 ring-1 ring-gray-200 shadow">
                {it.label}
              </span>
            </span>

            {/* Icon button */}
            <span
              className={[
                "flex h-11 w-11 items-center justify-center rounded-full text-white shadow-xl ring-1 ring-black/5",
                "transition-transform duration-300 hover:scale-105 active:scale-95",
                it.bg,
              ].join(" ")}
            >
              <it.Icon className="h-5 w-5" />
            </span>
          </a>
        ))}
      </div>

      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-label={open ? "Close contact options" : "Open contact options"}
        className={[
          "relative flex h-10 w-10 items-center justify-center rounded-full text-white shadow-2xl ring-1 ring-black/10",
          "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2",
          open
            ? "bg-gradient-to-br from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 focus:ring-rose-300"
            : "bg-gradient-to-br from-indigo-600 to-fuchsia-600 hover:from-indigo-700 hover:to-fuchsia-700 focus:ring-indigo-300",
        ].join(" ")}
      >
        {/* Pulse when closed */}
        {!open && (
          <span className="pointer-events-none absolute inset-0 rounded-full bg-white/10 animate-ping" />
        )}
        <span className="relative z-[1]">
          {open ? (
            <FiX className="h-5 w-5" />
          ) : (
            <FiMessageSquare className="h-5 w-5" />
          )}
        </span>
      </button>
    </div>
  );
};

export default FloatingContact;