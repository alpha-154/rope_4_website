"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { publicApiClient } from "@/lib/axios";
import { toast } from "sonner";
import { Compass, Loader2, Send } from "lucide-react";

interface InquiryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultProgramTitle?: string;
}

export function InquiryDialog({
  open,
  onOpenChange,
  defaultProgramTitle = "",
}: InquiryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    trekInterest: defaultProgramTitle,
    travelersCount: "2",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Please provide your name and email");
      return;
    }

    setIsSubmitting(true);
    try {
      await publicApiClient.post("/public/forms/trek-inquiry/submit", {
        data: {
          fullName: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          destinationTrek: formData.trekInterest || "Custom Expedition",
          travelersCount: formData.travelersCount,
          travelerNotes: formData.message.trim(),
        },
      });

      toast.success(
        "Inquiry received! Our expedition team will contact you shortly."
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        trekInterest: "",
        travelersCount: "2",
        message: "",
      });
      onOpenChange(false);
    } catch {
      // Try fallback to contact-us form if trek-inquiry slug not registered
      try {
        await publicApiClient.post("/public/forms/contact-us/submit", {
          data: {
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: `Trek Inquiry: ${formData.trekInterest || "General"}`,
            message: `Phone: ${formData.phone} | Travelers: ${formData.travelersCount} | Note: ${formData.message}`,
          },
        });
        toast.success(
          "Inquiry sent successfully! We will get in touch with you shortly."
        );
        onOpenChange(false);
      } catch (err: any) {
        toast.error(
          err.response?.data?.message ||
            "Unable to submit inquiry at this moment. Please try calling our hotline."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-1">
            <Compass className="h-4 w-4" />
            <span>Expedition Consultation</span>
          </div>
          <DialogTitle className="text-xl">Plan Your Next Adventure</DialogTitle>
          <DialogDescription className="text-xs">
            Connect with our certified mountaineering guides for custom trek itineraries, group discounts, and departure slots.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Your Full Name *
            </label>
            <Input
              required
              placeholder="e.g. Mohiuddin Mahi"
              value={formData.name}
              onChange={(e) =>
                setFormData((p) => ({ ...p, name: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Email Address *
              </label>
              <Input
                type="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Phone / WhatsApp *
              </label>
              <Input
                required
                placeholder="+880 1700-000000"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, phone: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Trek / Course Interested In
              </label>
              <Input
                placeholder="e.g. Keokradong, Everest Base Camp..."
                value={formData.trekInterest}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, trekInterest: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">
                Travelers
              </label>
              <Input
                type="number"
                min="1"
                value={formData.travelersCount}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, travelersCount: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">
              Questions or Preferred Dates
            </label>
            <Textarea
              rows={3}
              placeholder="Tell us about your fitness level, target month, or any questions..."
              value={formData.message}
              onChange={(e) =>
                setFormData((p) => ({ ...p, message: e.target.value }))
              }
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="gap-1.5"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span>Send Inquiry</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

