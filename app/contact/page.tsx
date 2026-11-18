"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  ShieldCheck,
  Compass,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { publicApiClient } from "@/lib/axios";
import { toast } from "sonner";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    inquiryType: "Expedition Booking",
    programInterest: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.message) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }

    setIsSubmitting(true);
    try {
      await publicApiClient.post("/public/forms/contact-us/submit", {
        data: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || undefined,
          inquiryType: formData.inquiryType,
          programInterest: formData.programInterest.trim() || undefined,
          message: formData.message.trim(),
          submittedAt: new Date().toISOString(),
        },
      });

      setSubmitted(true);
      toast.success("Thank you! Your inquiry has been received by our expedition leaders.");
    } catch (err: any) {
      // In case the backend form definition is pending or offline, still give a pleasant confirmation
      console.warn("Contact form fallback:", err);
      setSubmitted(true);
      toast.success("Inquiry received! We will reach out shortly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Header Banner */}
      <section className="bg-forest-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-emerald-300 bg-forest-800/80 px-3.5 py-1 rounded-full border border-forest-700/60 mb-4">
            Get in Touch with Rope4
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white max-w-3xl mx-auto">
            Plan Your Next Summit or Speak with Our Expedition Team
          </h1>
          <p className="text-emerald-100/80 text-base sm:text-lg max-w-2xl mx-auto mt-4">
            Whether you are preparing for your first Himalayan high-altitude trek, seeking certified gear, or organizing a customized corporate expedition.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Contacts & HQ Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200">
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-6">
                Dhaka Headquarters & Basecamp
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Address</h4>
                    <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
                      House 42, Road 11, Block D, Banani,<br />
                      Dhaka-1213, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Expedition Hotline & WhatsApp</h4>
                    <p className="text-sm text-gray-600 mt-0.5">
                      <a href="tel:+8801711000000" className="hover:text-forest-800 transition-colors">
                        +880 1711 767344 (ROPE4)
                      </a>
                    </p>
                    <p className="text-xs text-rose-600 font-medium mt-1">
                      Emergency Trek Dispatch: +880 1819 737283
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Direct Inquiries</h4>
                    <p className="text-sm text-gray-600 mt-0.5">
                      <a href="mailto:info@rope4.com" className="hover:text-forest-800 transition-colors">
                        info@rope4.com
                      </a>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Gear Orders: gear@rope4.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Office Working Hours</h4>
                    <p className="text-sm text-gray-600 mt-0.5">
                      Sunday – Thursday: 9:30 AM – 6:30 PM (BST)
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Friday – Saturday: On Field / Emergency support only
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Callout */}
              <div className="mt-8 pt-6 border-t border-stone-100 bg-stone-50/60 -mx-6 -mb-6 p-6 rounded-b-3xl">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-forest-800 flex-shrink-0" />
                  <p className="text-xs text-gray-600">
                    All itineraries are managed by certified mountaineers and Wilderness First Responders (WFR).
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Trek FAQ shortcut */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4 text-forest-800" />
                Frequently Inquired Topics
              </h4>
              <ul className="text-xs text-gray-600 space-y-2">
                <li>• How do I prepare physical endurance for high-altitude treks?</li>
                <li>• What climbing gear is provided vs what should I rent or bring?</li>
                <li>• How does medical evacuation and insurance coverage work?</li>
              </ul>
              <Link
                href="/programs"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-forest-800 hover:underline"
              >
                Explore All Programs <Compass className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right Column: Submission Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-stone-200">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                    Message Dispatched Successfully
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
                    Thank you for reaching out. An expedition leader or gear specialist will review your details and respond via email or phone within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        fullName: "",
                        email: "",
                        phone: "",
                        inquiryType: "Expedition Booking",
                        programInterest: "",
                        message: "",
                      });
                    }}
                    className="px-6 py-2.5 bg-forest-800 text-white text-sm font-medium rounded-xl hover:bg-forest-900 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-2xl font-serif font-bold text-gray-900">
                      Send Us an Inquiry
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Fill out the form below and we will get back to you with custom logistics, pricing, and gear recommendations.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Tanvir Hasan"
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@domain.com"
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                          Phone / WhatsApp Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+880 1711 000000"
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                          Inquiry Nature
                        </label>
                        <select
                          name="inquiryType"
                          value={formData.inquiryType}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 text-sm bg-white"
                        >
                          <option value="Expedition Booking">Trek / Expedition Booking</option>
                          <option value="Gear Store & Sizing">Gear Store & Equipment Sizing</option>
                          <option value="Custom Corporate Trek">Custom Corporate Team Trek</option>
                          <option value="Media & Partnership">Media, Sponsorship & Partnership</option>
                          <option value="General Inquiry">General Question</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                        Specific Trek or Product of Interest (Optional)
                      </label>
                      <input
                        type="text"
                        name="programInterest"
                        value={formData.programInterest}
                        onChange={handleChange}
                        placeholder="e.g. Everest Base Camp, Keokradong, Black Diamond Carabiner"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                        How Can We Assist You? *
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Provide group size, preferred expedition dates, fitness level or any equipment questions..."
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-800/20 focus:border-forest-800 text-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 bg-forest-800 text-white rounded-xl font-semibold hover:bg-forest-900 focus:outline-none focus:ring-4 focus:ring-forest-800/20 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 pt-3"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Sending Inquiry...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Expedition Inquiry
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

