import { useEffect, useRef, useState, useMemo } from "react";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaWhatsapp,
  FaFacebookMessenger,
  FaCopy,
  FaDownload,
  FaSpinner,
} from "react-icons/fa";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Seo from "../../components/SEO/Seo";

export default function ContactUsPage() {
  // ====== Customize these: ======
  const companyName = "MM Fashion World";
  const contactEmail = "marifamisam@gmail.com";
  const contactPhone = "+8801749889595"; // for display
  const address = "Mohammadpur, Dhaka, Bangladesh";
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "8801749889595"; // no +, no spaces
  const messengerLink = import.meta.env.VITE_MESSENGER_LINK || "https://m.me/MMFashionWorld";
  const siteUrl =
    import.meta.env.VITE_SITE_URL || (typeof window !== "undefined" ? window.location.origin : "");

  // ====== state ======
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
    // honeypot field
    website: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ====== helpers ======
  const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s).trim());
  const isValidBDMobile = (s) => {
    const digits = String(s || "").replace(/\D/g, "");
    return (
      (digits.length === 11 && digits.startsWith("01")) ||
      (digits.length === 13 && digits.startsWith("8801"))
    );
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "নাম লিখুন";
    else if (formData.name.trim().length < 2) e.name = "সঠিক নাম লিখুন";

    if (!formData.email.trim()) e.email = "ইমেইল দিন";
    else if (!isValidEmail(formData.email)) e.email = "বৈধ ইমেইল দিন";

    if (!formData.mobile.trim()) e.mobile = "মোবাইল নম্বর দিন";
    else if (!isValidBDMobile(formData.mobile))
      e.mobile = "বাংলাদেশের মোবাইল (যেমন 01XXXXXXXXX) দিন";

    if (!formData.message.trim() || formData.message.trim().length < 8)
      e.message = "সংক্ষিপ্তভাবে পর্যাপ্ত বার্তা দিন (কমপক্ষে 8 অক্ষর)";

    if (formData.website && formData.website.trim().length > 0) {
      e.website = "spam";
    }

    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // copy email
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail);
      toast.success("ইমেইল কপি করা হয়েছে");
    } catch {
      toast.error("কপি করা যায়নি");
    }
  };

  // vCard download
  const downloadVCard = () => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${companyName}`,
      `ORG:${companyName}`,
      `TEL;WORK;VOICE:${contactPhone}`,
      `EMAIL;WORK:${contactEmail}`,
      `ADR;WORK:;;${address}`,
      "END:VCARD",
    ].join("\n");

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${companyName.replace(/\s+/g, "_")}.vcf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success("Contact vCard download start");
  };

  // Build endpoint helper
  const buildEndpoint = (baseUrl) => {
    const base = (baseUrl || "http://localhost:5000").replace(/\/+$/, "");
    const hasApi = /\/api(\/|$)/.test(base);
    return hasApi ? `${base}/contact` : `${base}/api/contact`;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const v = validate();
    if (Object.keys(v).length > 0) {
      if (v.website === "spam") {
        setSentSuccess(true);
        setFormData({ name: "", email: "", mobile: "", message: "", website: "" });
        toast.success("Message sent successfully!");
        return;
      }
      setErrors(v);
      toast.error("ফর্মে কিছু ভুল আছে — অনুগ্রহ করে ঠিক করে পাঠান");
      return;
    }

    setLoading(true);
    try {
      const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:5000").trim();
      const endpoint = buildEndpoint(apiBase);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        mobile: formData.mobile.trim(),
        message: formData.message.trim(),
        website: formData.website || "",
        source: "contact-page",
        submittedAt: new Date().toISOString(),
      };

      const resp = await axios.post(endpoint, payload, { timeout: 20000 });
      const ok =
        resp?.status >= 200 && resp?.status < 300 && resp?.data?.success !== false;
      if (ok) {
        toast.success("Message sent successfully!");
        setSentSuccess(true);
        setFormData({ name: "", email: "", mobile: "", message: "", website: "" });
      } else {
        const serverMsg = resp?.data?.message || "Server rejected the request";
        toast.error(serverMsg);
      }
    } catch (err) {
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to send message. Try again later.";
      toast.error(errMsg);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  // SEO JSON-LD (ContactPage)
  const jsonLD = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    mainEntity: {
      "@type": "Organization",
      name: companyName,
      url: siteUrl || "",
      logo: siteUrl ? `${siteUrl.replace(/\/$/, "")}/logo.png` : undefined,
      contactPoint: [
        {
          "@type": "ContactPoint",
          telephone: contactPhone,
          contactType: "customer support",
          email: contactEmail,
          areaServed: "BD",
          availableLanguage: ["Bangla", "English"],
        },
      ],
    },
  };

  // SEO meta values
  const ogImage =
    "https://res.cloudinary.com/dpd5xwjqp/image/upload/v1757668954/Misam_Marifa_Fashion_World_oo94yx.png";
  const canonicalUrl = useMemo(() => {
    const base = (siteUrl || "").replace(/\/$/, "");
    return base ? `${base}/contact-us` : "";
  }, [siteUrl]);
  const metaDesc = `${companyName} — যোগাযোগ: ফোন ${contactPhone}, ইমেইল ${contactEmail}. ঠিকানা: ${address}. ২৪–৪৮ ঘণ্টার মধ্যে রিপ্লাই।`;

  const mapQuery = encodeURIComponent(address);

  return (
    <div className="min-h-screen bg-gray-50">
      <Seo
        title="Contact Us"
        description={metaDesc}
        image={ogImage}
        canonical={canonicalUrl}
        type="website"
        schema={jsonLD}
      />

      <Header />
      <Toaster position="top-right" />

      {/* Page header */}
      <section className="bg-gradient-to-r from-emerald-50 to-sky-50 border-y border-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
            Contact Us
          </h1>
          <p className="text-slate-600 mt-2">
            কোনো প্রশ্ন, অর্ডার ইস্যু বা কাস্টম রিকোয়েস্ট থাকলে আমাদের লিখে জানান — আমরা ২৪–৪৮ ঘণ্টার মধ্যে
            উত্তর দিই।
          </p>
        </div>
      </section>

      {/* Content grid */}
      <section className="max-w-6xl mx-auto px-1 py-10">
        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT: Contact cards */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-800">{companyName}</h2>
              <p className="text-sm text-slate-600 mt-1">Address: {address}</p>

              <div className="mt-5 grid gap-3">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white border shadow-sm">
                  <FaMapMarkerAlt className="text-xl text-emerald-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-800">Office</div>
                    <div className="text-sm text-slate-600">{address}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-white border shadow-sm">
                  <FaPhone className="text-xl text-emerald-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-800">Phone</div>
                    <a
                      href={`tel:${contactPhone.replace(/\s+/g, "")}`}
                      className="text-sm text-slate-600 hover:underline"
                    >
                      {contactPhone}
                    </a>
                  </div>
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                    title="WhatsApp"
                    aria-label="WhatsApp"
                  >
                    <FaWhatsapp />
                  </a>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-white border shadow-sm">
                  <FaEnvelope className="text-xl text-emerald-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-800">Email</div>
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-sm text-slate-600 hover:underline"
                    >
                      {contactEmail}
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copyEmail}
                      className="px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-sm"
                      title="Copy email"
                    >
                      <FaCopy />
                    </button>
                    <button
                      onClick={downloadVCard}
                      className="px-3 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-sm"
                      title="Download vCard"
                    >
                      <FaDownload />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-white border shadow-sm">
                  <FaFacebookMessenger className="text-xl text-sky-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-800">Messenger</div>
                    <a
                      href={messengerLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-slate-600 hover:underline"
                    >
                      Chat on Messenger
                    </a>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 mt-4">
                সাধারণত উত্তর সময় ২৪–৪৮ ঘন্টা (ব্যবসায়িক দিন)। জরুরি প্রয়োজনে ফোন বা WhatsApp ব্যবহার করুন।
              </p>
            </div>

          </div>

          {/* RIGHT: Form / Success */}
          <div>
            {!sentSuccess ? (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4"
              >
                {/* hidden honeypot */}
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  autoComplete="off"
                  tabIndex="-1"
                  className="absolute left-[-9999px] opacity-0 h-0 w-0"
                />

                <div>
                  <label className="block text-sm font-medium text-slate-700">Your Name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className={`mt-1 w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${errors.name
                        ? "border-rose-300 focus:ring-rose-200"
                        : "border-slate-200 focus:ring-emerald-200"
                      } bg-white`}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Email</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`mt-1 w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${errors.email
                        ? "border-rose-300 focus:ring-rose-200"
                        : "border-slate-200 focus:ring-emerald-200"
                      } bg-white`}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Mobile Number</label>
                  <input
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="017XXXXXXXX"
                    className={`mt-1 w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${errors.mobile
                        ? "border-rose-300 focus:ring-rose-200"
                        : "border-slate-200 focus:ring-emerald-200"
                      } bg-white`}
                    aria-invalid={!!errors.mobile}
                  />
                  {errors.mobile && <p className="text-xs text-rose-600 mt-1">{errors.mobile}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Message</label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message..."
                    className={`mt-1 w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${errors.message
                        ? "border-rose-300 focus:ring-rose-200"
                        : "border-slate-200 focus:ring-emerald-200"
                      } bg-white resize-none`}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && <p className="text-xs text-rose-600 mt-1">{errors.message}</p>}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium disabled:opacity-60"
                    aria-label="Send message"
                  >
                    {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                    <span>{loading ? "পাঠানো হচ্ছে..." : "Send Message"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ name: "", email: "", mobile: "", message: "", website: "" });
                      setErrors({});
                    }}
                    className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200"
                  >
                    Reset
                  </button>
                </div>

                <p className="text-xs text-slate-500">
                  By sending you agree we'll process your data to reply. See our{" "}
                  <a href="/privacy-policy" className="underline">
                    Privacy Policy
                  </a>
                  .
                </p>
              </form>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
                <h3 className="text-xl font-semibold text-slate-800">ধন্যবাদ!</h3>
                <p className="text-slate-600 mt-2">
                  We have received your message — we will contact you within 24–48 hours.
                </p>

                <div className="mt-4 flex justify-center gap-3">
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2"
                  >
                    <FaWhatsapp /> WhatsApp
                  </a>
                  <a
                    href={messengerLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full bg-sky-600 hover:bg-sky-700 text-white flex items-center gap-2"
                  >
                    <FaFacebookMessenger /> Messenger
                  </a>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => {
                      setSentSuccess(false);
                      setErrors({});
                    }}
                    className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-5 border shadow-sm">
            <h4 className="font-semibold text-slate-800 mb-2">General Questions</h4>
            <div className="text-sm text-slate-600 space-y-3">
              <div>
                <p className="font-medium text-slate-800">
                  অর্ডারের স্ট্যাটাস জানতে কিভাবে?
                </p>
                <p>
                  কনফার্মেশনের ইমেইল/এসএমএসে ট্র্যাকিং থাকে। প্রয়োজনে WhatsApp/ফর্মে মেসেজ দিন।
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-800">রিটার্ন নীতি?</p>
                <p>
                  Damaged বা mismatch হলে ৭ দিনের মধ্যে রিটার্ন গ্রহণযোগ্য — ডিটেইলস পেজে দেখুন।
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-800">কাস্টম ডিজাইন?</p>
                <p>
                  বার্তায় প্রয়োজন জানালেই আমরা কাস্টম অর্ডার রিভিউ করি। কিছু আইটেমে সীমাবদ্ধতা আছে।
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border shadow-sm">
            <h4 className="font-semibold text-slate-800 mb-2">Business Hours</h4>
            <div className="text-sm text-slate-600 space-y-2">
              <p>Sat–Thu: 10:00am – 7:00pm</p>
              <p>Friday: Closed (12 PM to 3 PM)</p>
              <p className="text-xs text-slate-500">
                Note: Online queries are answered even off-hours if available.
              </p>
            </div>
          </div>
        </div>
        {/* Map */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <h4 className="font-semibold text-slate-800 mb-3">Our Location</h4>
          <div className="w-full md:h-[360px] rounded-lg overflow-hidden border">
            <iframe
              title="MM Fashion World Location"
              src={`https://www.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}