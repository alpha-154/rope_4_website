"use client";

import React, { useEffect, useState } from "react";
import { MessageCircle, Phone, X, Sparkles, Compass } from "lucide-react";
import { publicApiClient } from "@/lib/axios";
import { InquiryDialog } from "./inquiry-dialog";

export function FloatingWidgets() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [activePopover, setActivePopover] = useState<any>(null);
  const [isPopoverDismissed, setIsPopoverDismissed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    publicApiClient
      .get("/public/popovers")
      .then((res) => {
        if (!isMounted) return;
        const popovers = res.data?.data || [];
        // Find first active popover targeted for home/all
        const valid = popovers.find(
          (p: any) =>
            p.isActive &&
            (!p.targetPages ||
              p.targetPages.length === 0 ||
              p.targetPages.includes("home") ||
              p.targetPages.includes("/"))
        );
        if (valid) {
          // Check delay
          const delay = (valid.delaySeconds || 2) * 1000;
          setTimeout(() => {
            if (isMounted) setActivePopover(valid);
          }, delay);
        }
      })
      .catch(() => {
        // Silent catch for popovers
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {/* Floating Bottom Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
        {/* Quick Inquiry CTA Pill */}
        <button
          onClick={() => setIsInquiryOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-xl hover:bg-primary/95 hover:scale-105 active:scale-95 transition-all border border-emerald-700/30 group"
          title="Plan your expedition"
        >
          <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:rotate-45 transition-transform">
            <Compass className="h-4 w-4" />
          </div>
          <span className="hidden sm:inline">Plan Your Trek</span>
          <span className="sm:hidden">Inquire</span>
        </button>
      </div>

      {/* Floating Bottom Left Hotline / WhatsApp */}
      <div className="fixed bottom-6 left-6 z-40 pointer-events-auto">
        <a
          href="https://wa.me/8801700000000"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-emerald-900/90 hover:bg-emerald-800 text-white text-xs font-semibold shadow-lg backdrop-blur-md border border-emerald-700/40 hover:scale-105 transition-all"
        >
          <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
            <MessageCircle className="h-3 w-3" />
          </div>
          <span className="hidden md:inline">24/7 Adventure Support</span>
        </a>
      </div>

      {/* Active Promotion Popover Modal (if CMS popovers active) */}
      {activePopover && !isPopoverDismissed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-border p-6 text-center space-y-4">
            <button
              onClick={() => setIsPopoverDismissed(true)}
              className="absolute right-3.5 top-3.5 p-1 rounded-full text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary mx-auto flex items-center justify-center">
              <Sparkles className="h-6 w-6" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground">
                {activePopover.title || "Adventure Awaits!"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
                {activePopover.content ||
                  "Early booking for high-altitude spring 2026 Himalayan expeditions is now open."}
              </p>
            </div>

            {activePopover.imageUrl && (
              <div className="rounded-xl overflow-hidden max-h-48 border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activePopover.imageUrl}
                  alt={activePopover.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => {
                  setIsPopoverDismissed(true);
                  setIsInquiryOpen(true);
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm"
              >
                {activePopover.ctaLabel || "Book Early Slot"}
              </button>
              <button
                onClick={() => setIsPopoverDismissed(true)}
                className="py-2.5 px-4 rounded-xl bg-muted text-muted-foreground font-semibold text-sm hover:bg-muted/80 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Dialog Modal */}
      <InquiryDialog
        open={isInquiryOpen}
        onOpenChange={setIsInquiryOpen}
      />
    </>
  );
}

