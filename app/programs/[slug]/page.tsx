"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Compass,
  Clock,
  MapPin,
  Mountain,
  Users,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Calendar,
  Heart,
  Share2,
  ChevronRight,
  Send,
  AlertCircle,
  Phone,
  MessageCircle,
} from "lucide-react";
import { publicApiClient } from "@/lib/axios";
import { useCustomerAuth } from "@/lib/customer-auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { InquiryDialog } from "@/components/shared/inquiry-dialog";
import { toast } from "sonner";

export default function ProgramDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [program, setProgram] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDeparture, setSelectedDeparture] = useState<any>(null);
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const { isWishlisted, toggleWishlist, isAuthenticated } = useCustomerAuth();

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    publicApiClient
      .get(`/public/programs/${slug}`)
      .then((res) => {
        if (isMounted && res.data?.data) {
          setProgram(res.data.data);
          if (res.data.data.departures?.length > 0) {
            setSelectedDeparture(res.data.data.departures[0]);
          }
        }
      })
      .catch(() => {
        // Fallback demo program if backend item not created yet
        setProgram({
          _id: "demo-prog",
          title: "Keokradong & Boga Lake Alpine Expedition",
          slug,
          category: "Learning Program",
          country: "Bangladesh",
          region: "Bandarban Hill Tracts",
          duration: "4 Days / 3 Nights",
          difficulty: "Moderate",
          maxAltitude: "3,172 ft",
          groupSize: "12 - 16 trekkers",
          price: 14500,
          currency: "BDT",
          badge: "Certified Alpine Course",
          overview:
            "A comprehensive 4-day wilderness expedition and certified mountain safety course through the Bandarban hills. You will trek through remote tribal villages, ascend to Boga Lake, and summit Mount Keokradong while receiving hands-on instruction in navigation, campcraft, rope knots, and wilderness emergency safety.",
          highlights: [
            "Summit Keokradong (3,172 ft), one of the highest peaks in Bangladesh",
            "Camp along the mysterious volcanic waters of Boga Lake",
            "Hands-on navigation with topographic maps and compass",
            "Wilderness safety, shelter building, and leave-no-trace ethics",
            "Certified diploma certificate from Rope4 Outdoor Education",
          ],
          itinerary: [
            {
              day: 1,
              title: "Dhaka to Bandarban & 4WD Transit to Ruma Bazar",
              altitude: "850 ft",
              distance: "12 km transit",
              description:
                "Meet at Dhaka departure point and travel to Bandarban. Complete military registration formalities at Ruma Bazar and take technical 4WD Chandgari up to Boga Lake. Evening orientation on wilderness ethics and team roles.",
              inclusions: "Lunch, Dinner, Alpine tent lodging",
            },
            {
              day: 2,
              title: "Boga Lake Camp to Darjeeling Para & Summit Push",
              altitude: "3,172 ft",
              distance: "14 km trek",
              description:
                "Early dawn ascent through lush bamboo groves and ridgelines. Stop at Darjeeling Para tribal settlement for hydration and gear check. Push toward Keokradong summit. Summit celebration and orientation on alpine weather patterns.",
              inclusions: "Breakfast, Trail snacks, Dinner, Summit tent camp",
            },
            {
              day: 3,
              title: "Technical Rope Rigging & Navigation Drills",
              altitude: "2,200 ft",
              distance: "8 km drills",
              description:
                "Practical field instruction: anchor systems, knotting masterclass (figure 8, clove hitch, prusik), casualty stretcher fabrication using trekking poles, and compass navigation.",
              inclusions: "All meals, Practical safety training",
            },
            {
              day: 4,
              title: "Descent to Ruma Bazar & Return Journey to Dhaka",
              altitude: "Sea Level",
              distance: "12 km descent",
              description:
                "Final pack-down following strict Leave-No-Trace principles. 4WD transit back to Bandarban town, certificate distribution banquet, and overnight transit to Dhaka.",
              inclusions: "Breakfast, Lunch, Certificate ceremony",
            },
          ],
          departures: [
            {
              startDate: "2026-11-20",
              endDate: "2026-11-24",
              seatsTotal: 16,
              seatsBooked: 9,
              status: "AVAILABLE",
            },
            {
              startDate: "2026-12-05",
              endDate: "2026-12-09",
              seatsTotal: 16,
              seatsBooked: 14,
              status: "FILLING_FAST",
            },
            {
              startDate: "2026-12-18",
              endDate: "2026-12-22",
              seatsTotal: 16,
              seatsBooked: 16,
              status: "SOLD_OUT",
            },
          ],
          inclusions: [
            "All road transportation from Dhaka to Bandarban & 4WD Chandgari transfers",
            "NIM certified mountaineering chief instructor and 1:6 safety crew",
            "Four-season alpine dome tents, foam sleeping mats, and group stoves",
            "All nutritious meals from Day 1 lunch to Day 4 lunch",
            "First aid kit, pulse oximeter, and emergency evacuation protocols",
            "Official course completion certificate and Rope4 expedition patch",
          ],
          exclusions: [
            "Personal trekking boots, daypack, and warm thermal clothing",
            "Personal medicine and travel insurance",
            "Mineral water bottles and personal snacking items",
          ],
          images: [
            "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop",
          ],
        });
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading || !program) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <Compass className="h-10 w-10 text-primary animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground font-medium">
          Loading expedition details...
        </p>
      </div>
    );
  }

  const isSaved = isWishlisted(program._id);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: program.title,
    description: program.shortDescription || program.summary,
    touristType: ["Mountaineers", "Trekkers", "Adventurers"],
    offers: {
      "@type": "Offer",
      price: program.price?.amount || 0,
      priceCurrency: program.price?.currency || "BDT",
      availability: "https://schema.org/InStock",
    },
    provider: {
      "@type": "Organization",
      name: "Rope4 Outdoor Education",
      url: "https://rope4.com",
      telephone: "+8801711767344",
    },
    itinerary: {
      "@type": "ItemList",
      numberOfItems: program.itinerary?.length || 0,
      itemListElement: (program.itinerary || []).map((day: any) => ({
        "@type": "ListItem",
        position: day.day,
        name: day.title,
        description: day.description,
      })),
    },
  };

  return (
    <div className="space-y-12 pb-24">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* 1. HERO HEADER & PHOTO GALLERY */}
      <section className="bg-emerald-950 text-white pt-8 pb-14 border-b border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-emerald-200/80">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/programs" className="hover:underline">
              Programs
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white truncate font-medium">{program.title}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="nature" className="bg-emerald-800 text-white font-bold">
                  {program.badge || program.category}
                </Badge>
                <Badge variant="outline" className="text-emerald-200 border-emerald-700">
                  {program.difficulty}
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                {program.title}
              </h1>

              <div className="flex items-center gap-2 text-sm text-emerald-100/80">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span>
                  {program.region ? `${program.region}, ` : ""}
                  {program.country || "Bangladesh"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    toggleWishlist(program._id);
                    toast.success("Updated wishlist");
                  } else {
                    toast.info("Please sign in to save this program");
                  }
                }}
                className={`p-3 rounded-xl border backdrop-blur flex items-center justify-center transition-colors ${
                  isSaved
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                }`}
                title={isSaved ? "Saved in Wishlist" : "Save to Wishlist"}
              >
                <Heart className={`h-5 w-5 ${isSaved ? "fill-white" : ""}`} />
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: program.title,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Program link copied to clipboard");
                  }
                }}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
                title="Share trek"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="md:col-span-2 rounded-2xl overflow-hidden h-[340px] sm:h-[420px] bg-muted relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={program.images?.[0]}
                alt={program.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              <div className="rounded-2xl overflow-hidden h-[160px] sm:h-[200px] bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={program.images?.[1] || program.images?.[0]}
                  alt={`${program.title} 2`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden h-[160px] sm:h-[200px] bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={program.images?.[2] || program.images?.[0]}
                  alt={`${program.title} 3`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Quick Facts Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-emerald-900/60 border border-emerald-800 text-xs">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-emerald-200/70 block">Duration</span>
                <strong className="text-white text-sm">{program.duration}</strong>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mountain className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-emerald-200/70 block">Max Altitude</span>
                <strong className="text-white text-sm">
                  {program.maxAltitude || "3,200 ft"}
                </strong>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-emerald-200/70 block">Batch Size</span>
                <strong className="text-white text-sm">
                  {program.groupSize || "12 - 16 pax"}
                </strong>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-emerald-200/70 block">Safety Protocol</span>
                <strong className="text-white text-sm">1:6 Guide Ratio</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BODY CONTENT + STICKY SIDEBAR LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Left Column (Tabs & Content) */}
        <div className="lg:col-span-2 space-y-10">
          {/* Sticky Anchor Navigation Bar */}
          <div className="sticky top-20 z-30 bg-background/95 backdrop-blur border-b border-border py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {[
              { id: "overview", label: "Overview" },
              { id: "itinerary", label: "Day-by-Day Itinerary" },
              { id: "departures", label: "Departure Dates" },
              { id: "inclusions", label: "Inclusions" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  const el = document.getElementById(tab.id);
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Section: Overview */}
          <div id="overview" className="space-y-6 scroll-mt-36">
            <h2 className="text-2xl font-bold tracking-tight">Expedition Overview</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {program.overview}
            </p>

            {/* Highlights List */}
            {program.highlights && program.highlights.length > 0 && (
              <div className="bg-muted/40 p-6 rounded-2xl border space-y-3">
                <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">
                  Course Highlights
                </h3>
                <div className="space-y-2">
                  {program.highlights.map((h: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-foreground/85">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section: Itinerary Accordion */}
          <div id="itinerary" className="space-y-6 scroll-mt-36">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Day-by-Day Itinerary</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Detailed field schedule, daily trekking distance, altitude ascent, and camping spots.
              </p>
            </div>

            <Accordion type="single" collapsible defaultValue="day-1" className="space-y-3">
              {(program.itinerary || []).map((day: any, idx: number) => (
                <AccordionItem
                  key={idx}
                  value={`day-${day.day || idx + 1}`}
                  className="border rounded-2xl px-5 bg-card shadow-sm"
                >
                  <AccordionTrigger className="hover:no-underline py-4 text-left">
                    <div className="flex items-center gap-3">
                      <span className="h-8 w-8 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0">
                        D{day.day || idx + 1}
                      </span>
                      <div>
                        <div className="font-bold text-sm text-foreground">
                          {day.title}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium flex items-center gap-2 mt-0.5">
                          {day.altitude && <span>Alt: {day.altitude}</span>}
                          {day.distance && (
                            <>
                              <span>•</span>
                              <span>{day.distance}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground leading-relaxed pt-2 space-y-3 border-t">
                    <p>{day.description}</p>
                    {day.inclusions && (
                      <div className="p-2.5 bg-muted/50 rounded-lg text-foreground font-medium flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                        <span>Included: {day.inclusions}</span>
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Section: Departures & Fixed Dates */}
          <div id="departures" className="space-y-6 scroll-mt-36">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Fixed Departure Dates
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Select your batch slot to lock in reservations. Maximum 16 trekkers per departure.
              </p>
            </div>

            <div className="space-y-3">
              {(program.departures || []).map((dep: any, idx: number) => {
                const isSelected = selectedDeparture?.startDate === dep.startDate;
                const isSoldOut = dep.status === "SOLD_OUT";

                return (
                  <div
                    key={idx}
                    onClick={() => !isSoldOut && setSelectedDeparture(dep)}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary"
                        : isSoldOut
                        ? "opacity-50 cursor-not-allowed bg-muted/20"
                        : "hover:border-primary/40 bg-card"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-primary shrink-0">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-bold text-sm text-foreground">
                          {dep.startDate} to {dep.endDate}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {dep.seatsTotal - (dep.seatsBooked || 0)} slots available of{" "}
                          {dep.seatsTotal}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          dep.status === "AVAILABLE"
                            ? "nature"
                            : dep.status === "FILLING_FAST"
                            ? "amber"
                            : "destructive"
                        }
                      >
                        {dep.status?.replace("_", " ") || "Available"}
                      </Badge>
                      <Button
                        size="sm"
                        disabled={isSoldOut}
                        variant={isSelected ? "default" : "outline"}
                      >
                        {isSelected ? "Selected" : isSoldOut ? "Sold Out" : "Select Batch"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Inclusions & Exclusions */}
          <div id="inclusions" className="space-y-6 scroll-mt-36">
            <h2 className="text-2xl font-bold tracking-tight">What&apos;s Covered</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Inclusions */}
              <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-200 space-y-3">
                <h3 className="font-bold text-sm text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Package Inclusions</span>
                </h3>
                <ul className="space-y-2 text-xs text-foreground/80">
                  {(program.inclusions || []).map((inc: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-200 space-y-3">
                <h3 className="font-bold text-sm text-rose-900 flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-rose-600" />
                  <span>Not Included</span>
                </h3>
                <ul className="space-y-2 text-xs text-foreground/80">
                  {(program.exclusions || []).map((exc: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">•</span>
                      <span>{exc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Booking & Inquiry Card */}
        <aside className="sticky top-24 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xl space-y-5">
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">
                Standard Fee Per Person
              </span>
              <div className="text-3xl font-extrabold text-foreground mt-1">
                {program.price ? `${program.price.toLocaleString("en-US")} ${program.currency || "BDT"}` : "Inquire"}
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                All food, permits, mountain crew & transport included.
              </p>
            </div>

            {/* Selected Batch Preview */}
            <div className="p-3 bg-muted/50 rounded-xl border text-xs space-y-1">
              <span className="text-muted-foreground font-semibold">
                Selected Batch Departure:
              </span>
              <div className="font-bold text-foreground">
                {selectedDeparture
                  ? `${selectedDeparture.startDate} — ${selectedDeparture.endDate}`
                  : "Flexible / Custom Date"}
              </div>
            </div>

            {/* Booking Action */}
            <div className="space-y-2">
              <Button
                onClick={() => setInquiryOpen(true)}
                size="lg"
                className="w-full gap-2 font-bold shadow-md"
              >
                <Send className="h-4 w-4" />
                <span>Book / Inquire This Slot</span>
              </Button>

              <Button
                onClick={() => setInquiryOpen(true)}
                variant="outline"
                size="sm"
                className="w-full text-xs font-semibold"
              >
                Request Custom Group Dates
              </Button>
            </div>

            {/* Trust and Hotline */}
            <div className="pt-4 border-t space-y-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                <span>NIM certified instructors & medical crew</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>Expedition Hotline: +880 1700-000000</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Inquiry Dialog Modal */}
      <InquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        defaultProgramTitle={program.title}
      />
    </div>
  );
}
