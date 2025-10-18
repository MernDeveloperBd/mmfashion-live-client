import { useLocation } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useState, useMemo, useEffect } from "react";
import Stripe from "../components/Stripe/Stripe";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../Api/api"; // path নিশ্চিত করুন

const Payment = () => {
  const loc = useLocation();
  const { price = 0, items = 0, orderId = "" } = loc.state ?? {};
  const [paymentMethod, setPaymentMethod] = useState("stripe");

  const { token } = useSelector((state) => state.auth) || {};

  // BKash states
  const [bkashNumber, setBkashNumber] = useState("01979123009");
  const [bkashForm, setBkashForm] = useState({ sender: "", trxId: "" });
  const [bkashLoading, setBkashLoading] = useState(false);
  const [bkashSubmitted, setBkashSubmitted] = useState(false);

  useEffect(() => {
    // fetch bkash merchant number (optional)
    const fetchConfig = async () => {
      try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const { data } = await api.get("/payment/bkash/config", config);
        if (data?.merchantNumber) setBkashNumber(data.merchantNumber);
      } catch (e) {
        // fallback রাখুন
      }
    };
    fetchConfig();
  }, [token]);

  const methods = useMemo(
    () => [
      { id: "stripe", label: "Stripe", src: "/payment/stripe.png" },
      { id: "bkash", label: "Bkash", src: "/payment/bkash.png" },
      { id: "nogot", label: "Nogot", src: "/payment/nogot.png" },
      { id: "roket", label: "Roket", src: "/payment/roket.png" },
    ],
    []
  );

  const disabledContinue =
    paymentMethod !== "stripe" || !orderId || !price || price <= 0 || bkashLoading;

  const handleBkashSubmit = async (e) => {
    e.preventDefault();
    if (!orderId) return toast.error("Missing order id");
    if (!price || price <= 0) return toast.error("Invalid amount");

    const sender = bkashForm.sender.trim();
    const trxId = bkashForm.trxId.trim();

    // basic validation (BD mobile: 01XXXXXXXXX)
    if (!/^01[0-9]{9}$/.test(sender)) return toast.error("Enter a valid Bkash number");
    if (trxId.length < 6) return toast.error("Enter a valid transaction id");

    try {
      setBkashLoading(true);
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const payload = {
        orderId,
        amount: price,
        senderNumber: sender,
        trxId,
      };
      const { data } = await api.post("/payment/bkash/submit", payload, config);
      toast.success(data?.message || "Submitted");
      setBkashSubmitted(true);
      setBkashForm({ sender: "", trxId: "" });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to submit";
      toast.error(msg);
    } finally {
      setBkashLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6f8]">
      <Header />

      <section className="w-[95%] mx-auto py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left: Payment area */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4">
                Select a payment method
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                {methods.map((m) => {
                  const active = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`group relative flex flex-col items-center justify-center gap-2 rounded-md border p-4 transition
                        ${
                          active
                            ? "border-indigo-500 ring-2 ring-indigo-200 bg-indigo-50"
                            : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50"
                        }`}
                    >
                      <div className="h-10 w-10 md:h-12 md:w-12 rounded bg-white grid place-items-center overflow-hidden">
                        <img
                          src={m.src}
                          alt={m.label}
                          className="h-8 w-8 md:h-10 md:w-10 object-contain"
                          loading="lazy"
                        />
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          active ? "text-slate-900" : "text-slate-700"
                        }`}
                      >
                        {m.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Method details */}
              <div className="mt-6">
                {paymentMethod === "stripe" && (
                  <div className="rounded-lg border border-slate-200 p-4 md:p-5 bg-white">
                    <Stripe orderId={orderId} price={price} />
                    <div className="text-slate-700">
                      <p className="font-semibold mb-2">Stripe</p>
                      <p className="text-sm">
                        Payment will be processed securely via Stripe.
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === "bkash" && (
                  <div className="rounded-lg border border-slate-200 p-4 md:p-5 bg-white space-y-4">
                    <p className="font-semibold text-slate-800">Bkash</p>

                    <div className="rounded-md bg-pink-50 border border-pink-200 p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Send money to</span>
                        <strong className="text-pink-700 font-mono">
                          {bkashNumber}
                        </strong>
                      </div>
                      <p className="mt-1 text-slate-600">
                        Please send exactly TK {price} and paste the TrxID below.
                      </p>
                    </div>

                    <form onSubmit={handleBkashSubmit} className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm text-slate-600">Sender Bkash Number</label>
                          <input
                            type="tel"
                            value={bkashForm.sender}
                            onChange={(e) =>
                              setBkashForm((s) => ({ ...s, sender: e.target.value }))
                            }
                            placeholder="01XXXXXXXXX"
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm text-slate-600">Transaction ID (TrxID)</label>
                          <input
                            type="text"
                            value={bkashForm.trxId}
                            onChange={(e) =>
                              setBkashForm((s) => ({ ...s, trxId: e.target.value }))
                            }
                            placeholder="e.g. 8G5A1B2CDE"
                            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-pink-200 uppercase"
                            required
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className={`px-5 py-2 rounded-md bg-pink-600 text-white font-semibold hover:bg-pink-700 transition ${
                          bkashLoading ? "opacity-70 cursor-not-allowed" : ""
                        }`}
                        disabled={bkashLoading || bkashSubmitted}
                      >
                        {bkashSubmitted ? "Submitted" : bkashLoading ? "Submitting..." : "Pay Now"}
                      </button>

                      {bkashSubmitted && (
                        <p className="text-sm text-emerald-600">
                          We received your Bkash payment info. We’ll verify it soon.
                        </p>
                      )}
                    </form>
                  </div>
                )}

                {paymentMethod === "nogot" && (
                  <div className="rounded-lg border border-slate-200 p-4 md:p-5 bg-white">
                    <p className="font-semibold text-slate-800 mb-3">Nogot</p>
                    <button className="px-5 py-2 rounded-md bg-orange-500 text-white font-semibold hover:bg-orange-600 transition">
                      Pay Now
                    </button>
                  </div>
                )}

                {paymentMethod === "roket" && (
                  <div className="rounded-lg border border-slate-200 p-4 md:p-5 bg-white">
                    <p className="font-semibold text-slate-800 mb-3">Roket</p>
                    <button className="px-5 py-2 rounded-md bg-orange-500 text-white font-semibold hover:bg-orange-600 transition">
                      Pay Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 sticky top-4">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                Order Summary
              </h3>

              <div className="space-y-3 text-slate-700">
                <div className="flex justify-between items-center">
                  <span>{items} items (shipping included)</span>
                  <span>TK {price}</span>
                </div>

                <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                  <span className="font-semibold">Total Amount</span>
                  <span className="text-lg font-bold text-orange-600">
                    TK {price}
                  </span>
                </div>
              </div>

              <div className="mt-5">
                {paymentMethod === "stripe" ? (
                  <button
                    type="button"
                    className="w-full md:w-auto px-5 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                    // আপনার Stripe ফ্লো যদি এই বাটনের সাথে দরকার হয়, এখানে হ্যান্ডলার দিন
                  >
                    Continue to pay
                  </button>
                ) : (
                  <button
                    type="button"
                    className="w-full md:w-auto px-5 py-2 rounded-md bg-slate-200 text-slate-500 font-semibold cursor-not-allowed"
                    disabled
                    title="Use the Pay Now button above"
                  >
                    {/* empty/disabled as requested */}
                  </button>
                )}
              </div>

              {orderId ? (
                <p className="mt-3 text-xs text-slate-500">
                  Order ID: <span className="font-mono">{orderId}</span>
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Payment;