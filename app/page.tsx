"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Compass,
  Clock,
  ChevronRight,
  ChevronLeft,
  Heart,
  ArrowRight,
  Search,
  Calendar,
  Sparkles,
  MapPin,
} from "lucide-react";
import { publicApiClient } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InquiryDialog } from "@/components/shared/inquiry-dialog";
import { CategorySlider, CategorySliderSkeleton } from "@/components/shared/category-slider";
import { usePublicCategories } from "@/lib/site-data";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { HighlightsSection } from "@/components/home/highlights-section";
import { ReviewsSection } from "@/components/home/reviews-section";
import { NewsSection } from "@/components/home/news-section";
import { FaqSection } from "@/components/home/faq-section";
import { SectionError } from "@/components/home/section-error";
import { toast } from "sonner";

// --- HERO SLIDES DATA ---
const HERO_SLIDES = [
  {
    id: 1,
    tagline: "🌲 Wilderness Safety & Alpine Certified",
    title: "Discover Wilderness.\nMaster Real Adventure.",
    subtitle:
      "Certified outdoor courses, high-altitude expeditions, and survival camps guided by seasoned mountaineers. Build confidence, resilience, and respect for nature.",
    ctaPrimary: "Explore All Programs",
    ctaPrimaryLink: "/programs",
    ctaSecondary: "Gear Store",
    ctaSecondaryLink: "/store",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop",
  },
  {
    id: 2,
    tagline: "🏔️ High-Altitude Himalayan Summits",
    title: "Step Onto The Roof\nof The World.",
    subtitle:
      "Join our Himalayan mountaineering batches with certified NIM chief instructors. Complete acclimatization schedules, medical safety, and technical gear provided.",
    ctaPrimary: "View Himalayan Treks",
    ctaPrimaryLink: "/programs?category=Premium+Trip",
    ctaSecondary: "Plan Custom Trek",
    ctaSecondaryLink: "#inquiry",
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1920&auto=format&fit=crop",
  },
  {
    id: 3,
    tagline: "🏕️ Youth & Family Nature Education",
    title: "Youth Survival Camps &\nFamily Exploration.",
    subtitle:
      "Empower kids and teens with real-world wilderness survival skills, fire-craft, knotting mastery, and environmental stewardship in scenic forest sanctuaries.",
    ctaPrimary: "Explore Youth Camps",
    ctaPrimaryLink: "/programs?category=Summer+Camp",
    ctaSecondary: "Wilderness Safety Code",
    ctaSecondaryLink: "/safety",
    image:
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1920&auto=format&fit=crop",
  },
];

// --- FALLBACK FEATURED PROGRAMS ---
// --- FALLBACK REVIEWS ---
// --- FALLBACK NEWS ARTICLES ---
// --- FALLBACK FAQS ---
export default function HomePage() {
  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);

  // Programs for the finder (other CMS sections load inside their own components)
  const programsQuery = useQuery<any[]>({
    queryKey: ["public", "programs", "finder"],
    queryFn: async () => {
      const res = await publicApiClient.get("/public/programs", { params: { limit: 50 } });
      return res.data?.data ?? [];
    },
  });
  const programs = useMemo(() => programsQuery.data ?? [], [programsQuery.data]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
    refetch: refetchCategories,
    isFetching: categoriesFetching,
  } = usePublicCategories();

  // Dialog State
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryProgram, setInquiryProgram] = useState("");

  // Wishlist Local State
  const [wishlist, setWishlist] = useState<string[]>([]);

  // 2. Auto-advance Hero Slider
  useEffect(() => {
    if (isSlidePaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isSlidePaused]);

  // Wishlist handler
  const handleToggleWishlist = (id: string, title: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        toast.info(`Removed ${title} from wishlist`);
        return prev.filter((item) => item !== id);
      } else {
        toast.success(`Added ${title} to wishlist`);
        return [...prev, id];
      }
    });

    // If logged in, sync with backend
    publicApiClient
      .post("/public/customer/wishlist/toggle", { itemId: id })
      .catch(() => {});
  };

  // Filtered Programs Logic
  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      // Search text match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title?.toLowerCase().includes(q);
        const matchesCountry = p.country?.toLowerCase().includes(q);
        const matchesRegion = p.region?.toLowerCase().includes(q);
        const matchesCategory = p.category?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCountry && !matchesRegion && !matchesCategory)
          return false;
      }

      // Season filter
      if (selectedSeason !== "All") {
        const seasons: string[] = Array.isArray(p.season) ? p.season : p.season ? [p.season] : [];
        if (seasons.length && !seasons.some((x) => x.toLowerCase() === selectedSeason.toLowerCase()))
          return false;
      }

      // Difficulty filter
      if (selectedDifficulty !== "All") {
        if (
          p.difficulty &&
          p.difficulty.toLowerCase() !== selectedDifficulty.toLowerCase()
        )
          return false;
      }

      // Country filter
      if (selectedCountry !== "All") {
        if (p.country && p.country.toLowerCase() !== selectedCountry.toLowerCase())
          return false;
      }

      return true;
    });
  }, [programs, searchQuery, selectedSeason, selectedDifficulty, selectedCountry]);

  const openInquiryForProgram = (programTitle: string) => {
    setInquiryProgram(programTitle);
    setInquiryOpen(true);
  };

  return (
    <div className="space-y-24 pb-24">
      {/* ========================================================
          1. HERO SLIDER SECTION
      ======================================================== */}
      <section
        onMouseEnter={() => setIsSlidePaused(true)}
        onMouseLeave={() => setIsSlidePaused(false)}
        className="relative min-h-[600px] lg:min-h-[680px] flex items-center justify-center bg-emerald-950 text-white overflow-hidden select-none"
      >
        {/* Background Images with Cross-fade Transition */}
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transform scale-105 transition-transform duration-10000"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/70 to-emerald-950/40" />
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-emerald-950/30 to-emerald-950/80" />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-400/30 text-emerald-200 text-xs font-semibold tracking-wide uppercase backdrop-blur-md shadow-sm animate-in fade-in duration-500">
            <span>{HERO_SLIDES[currentSlide].tagline}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight sm:leading-none text-white whitespace-pre-line drop-shadow-md">
            {HERO_SLIDES[currentSlide].title}
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-emerald-100/90 leading-relaxed font-normal drop-shadow">
            {HERO_SLIDES[currentSlide].subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={HERO_SLIDES[currentSlide].ctaPrimaryLink}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-accent text-accent-foreground font-bold text-base hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2.5 active:scale-95"
            >
              <Compass className="h-5 w-5" />
              <span>{HERO_SLIDES[currentSlide].ctaPrimary}</span>
            </Link>

            <button
              onClick={() => {
                if (HERO_SLIDES[currentSlide].ctaSecondaryLink === "#inquiry") {
                  setInquiryOpen(true);
                }
              }}
              className="w-full sm:w-auto"
            >
              {HERO_SLIDES[currentSlide].ctaSecondaryLink === "#inquiry" ? (
                <div className="w-full px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-base transition-all flex items-center justify-center gap-2 backdrop-blur-md active:scale-95">
                  <Sparkles className="h-5 w-5 text-emerald-400" />
                  <span>{HERO_SLIDES[currentSlide].ctaSecondary}</span>
                </div>
              ) : (
                <Link
                  href={HERO_SLIDES[currentSlide].ctaSecondaryLink}
                  className="w-full px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold text-base transition-all flex items-center justify-center gap-2 backdrop-blur-md active:scale-95"
                >
                  <span>{HERO_SLIDES[currentSlide].ctaSecondary}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </button>
          </div>
        </div>

        {/* Carousel Arrow Controls */}
        <button
          onClick={() =>
            setCurrentSlide(
              (prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length
            )
          }
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm border border-white/10 transition-colors hidden sm:flex"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)
          }
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm border border-white/10 transition-colors hidden sm:flex"
          aria-label="Next Slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Slide Indicator Dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "w-8 bg-emerald-400" : "w-2.5 bg-white/40"
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ========================================================
          2. PROGRAM CATEGORY CARDS
      ======================================================== */}
      {(categoriesLoading || categoriesError || categories.length > 0) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <Badge variant="nature" className="px-3 py-1 font-semibold uppercase">
              Curated Formats
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Explore By Experience
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
              Choose the adventure style that fits your path: high-altitude summits, certified mountain learning, or youth survival education.
            </p>
          </div>

          {categoriesLoading ? (
            <CategorySliderSkeleton />
          ) : categoriesError ? (
            <SectionError
              title="Experiences couldn't be loaded"
              onRetry={() => refetchCategories()}
              retrying={categoriesFetching}
            />
          ) : (
            <CategorySlider categories={categories} />
          )}
        </section>
      )}

      {/* ========================================================
          3. "PLAN YOUR NEXT ADVENTURE" LIVE SEARCH & FILTER
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-secondary/40 border border-border rounded-3xl p-6 sm:p-10 space-y-8 shadow-sm">
          {/* Header & Full Calendar Link */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Compass className="h-4 w-4" />
                <span>Omni-Adventure Finder</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
                Plan Your Next Adventure
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Filter by country, difficulty grade, and season to find your perfect trail.
              </p>
            </div>
            <Link
              href="/programs"
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 shrink-0"
            >
              <span>Explore all departure dates</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Search Input Box */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by peak, trek name, region (e.g. Keokradong, Everest, Sylhet)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
          </div>

          {/* Quick Filter Chips */}
          <div className="space-y-3 pt-1">
            {/* Country Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground w-20 shrink-0">
                Country:
              </span>
              {["All", "Bangladesh", "Nepal", "India", "Bhutan"].map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCountry(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCountry === c
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-background border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Season Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground w-20 shrink-0">
                Season:
              </span>
              {["All", "Winter", "Spring", "Summer", "Autumn", "Monsoon"].map(
                (s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSeason(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedSeason === s
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-background border border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {s}
                  </button>
                )
              )}
            </div>

            {/* Grade Chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground w-20 shrink-0">
                Grade:
              </span>
              {["All", "Easy", "Moderate", "Challenging", "Demanding"].map(
                (d) => (
                  <button
                    key={d}
                    onClick={() => setSelectedDifficulty(d)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      selectedDifficulty === d
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-background border border-border text-foreground hover:bg-muted"
                    }`}
                  >
                    {d}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Program Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {programsQuery.isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
                  <Skeleton className="h-52 w-full rounded-none" />
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-5 w-4/5" />
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-8 w-28" />
                    </div>
                  </div>
                </div>
              ))
            ) : programsQuery.isError ? (
              <SectionError
                className="col-span-full"
                title="Programs couldn't be loaded"
                onRetry={() => programsQuery.refetch()}
                retrying={programsQuery.isFetching}
              />
            ) : filteredPrograms.length > 0 ? (
              filteredPrograms.slice(0, 6).map((prog) => {
                const isSaved = wishlist.includes(prog._id);
                const thumb =
                  prog.heroImages?.[0] ||
                  prog.images?.[0] ||
                  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop";

                return (
                  <div
                    key={prog._id}
                    className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    {/* Image Thumbnail & Overlays */}
                    <div className="relative h-52 bg-muted overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                        style={{ backgroundImage: `url(${thumb})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10">
                        {prog.badge || prog.category}
                      </div>

                      <button
                        onClick={() => handleToggleWishlist(prog._id, prog.title)}
                        className={`absolute top-3 right-3 h-8 w-8 rounded-full backdrop-blur flex items-center justify-center transition-colors shadow-sm ${
                          isSaved
                            ? "bg-red-50 text-red-600"
                            : "bg-white/80 hover:bg-white text-muted-foreground hover:text-red-500"
                        }`}
                        title={isSaved ? "Saved in wishlist" : "Add to wishlist"}
                      >
                        <Heart
                          className={`h-4 w-4 ${isSaved ? "fill-red-600" : ""}`}
                        />
                      </button>

                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur text-primary text-xs font-semibold flex items-center gap-1 shadow-sm">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {prog.region ? `${prog.region}, ` : ""}
                          {prog.country || "Bangladesh"}
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            {typeof prog.duration === "number"
                              ? `${prog.duration} Day${prog.duration === 1 ? "" : "s"}`
                              : prog.duration || "—"}
                          </span>
                          <span className="font-semibold text-emerald-800 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded text-[11px]">
                            {prog.difficulty || "Moderate"}
                          </span>
                        </div>

                        <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                          {prog.title}
                        </h3>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase text-muted-foreground font-semibold block">
                            Starting From
                          </span>
                          <span className="text-base font-extrabold text-foreground">
                            {(() => {
                              const amount = typeof prog.price === "number" ? prog.price : prog.price?.amount;
                              const currency = prog.price?.currency || prog.currency || "BDT";
                              return amount ? `${Number(amount).toLocaleString("en-US")} ${currency}` : "Inquire";
                            })()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openInquiryForProgram(prog.title)}
                            className="px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted font-semibold text-xs transition-colors"
                          >
                            Inquire
                          </button>
                          <Link
                            href={`/programs/${prog.slug || prog._id}`}
                            className="px-3.5 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs transition-colors shadow-sm"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-12 text-center space-y-3 bg-background rounded-2xl border">
                <Compass className="h-10 w-10 text-muted-foreground mx-auto" />
                <h3 className="text-base font-semibold">
                  {programs.length === 0 ? "No programs published yet" : "No programs match the selected filters"}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Try adjusting your season, grade, or search terms to see available departures.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSeason("All");
                    setSelectedDifficulty("All");
                    setSelectedCountry("All");
                  }}
                >
                  Reset All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. HIGHLIGHT STATS (admin: Highlights, Active + Public only)
      ======================================================== */}
      <HighlightsSection />

      {/* ========================================================
          5. TESTIMONIALS SLIDER (admin: Reviews & Awards, approved only)
      ======================================================== */}
      <ReviewsSection />

      {/* ========================================================
          6. "STAY INFORMED" NEWS GRID (admin: News & Stories, published)
      ======================================================== */}
      <NewsSection />

      {/* ========================================================
          7. FAQ ACCORDION (admin: FAQ Categories, active only)
      ======================================================== */}
      <FaqSection />

      {/* ========================================================
          8. CALL TO ACTION FOOTER BANNER
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 p-8 sm:p-14 text-white text-center space-y-6 shadow-xl relative overflow-hidden border border-emerald-800">
          <div className="h-14 w-14 rounded-2xl bg-accent text-accent-foreground mx-auto flex items-center justify-center shadow-lg">
            <Compass className="h-7 w-7" />
          </div>

          <div className="space-y-2 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Step Into the Wild?
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/80 leading-relaxed">
              Speak directly with our mountaineering consultants to tailor your itinerary, assess your fitness readiness, or register for upcoming certified courses.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Button
              onClick={() => {
                setInquiryProgram("General Expedition Inquiry");
                setInquiryOpen(true);
              }}
              size="lg"
              variant="accent"
              className="w-full sm:w-auto"
            >
              <span>Connect With Expedition Leaders</span>
            </Button>
            <Link
              href="/programs"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all text-center"
            >
              Browse Full Calendar
            </Link>
          </div>
        </div>
      </section>

      {/* Inquiry Modal Dialog */}
      <InquiryDialog
        open={inquiryOpen}
        onOpenChange={setInquiryOpen}
        defaultProgramTitle={inquiryProgram}
      />
    </div>
  );
}
