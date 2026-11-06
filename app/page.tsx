"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Compass,
  Clock,
  ShieldCheck,
  Trophy,
  Users,
  Award,
  ChevronRight,
  ChevronLeft,
  Star,
  Heart,
  ArrowRight,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  MapPin,
  Mountain,
  BookOpen,
  Tent,
} from "lucide-react";
import { publicApiClient } from "@/lib/axios";
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
const DEFAULT_PROGRAMS = [
  {
    _id: "p1",
    title: "Keokradong & Boga Lake Alpine Expedition",
    slug: "keokradong-boga-lake-alpine-expedition",
    category: "Learning Program",
    country: "Bangladesh",
    region: "Bandarban",
    duration: "4 Days / 3 Nights",
    difficulty: "Moderate",
    badge: "Popular Course",
    price: 14500,
    currency: "BDT",
    rating: 4.9,
    season: "Winter",
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    _id: "p2",
    title: "Wilderness Survival & Bushcraft Camp",
    slug: "wilderness-survival-bushcraft-camp",
    category: "Summer Camp",
    country: "Bangladesh",
    region: "Sylhet Rainforest",
    duration: "3 Days / 2 Nights",
    difficulty: "Easy",
    badge: "Youth & Beginners",
    price: 8900,
    currency: "BDT",
    rating: 4.8,
    season: "Autumn",
    images: [
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    _id: "p3",
    title: "Everest Base Camp & Kala Patthar High Trek",
    slug: "everest-base-camp-kala-patthar",
    category: "Premium Trip",
    country: "Nepal",
    region: "Khumbu Himalaya",
    duration: "14 Days",
    difficulty: "Challenging",
    badge: "Iconic Summit",
    price: 148000,
    currency: "BDT",
    rating: 5.0,
    season: "Spring",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    _id: "p4",
    title: "Annapurna Circuit & Thorong La Pass",
    slug: "annapurna-circuit-thorong-la",
    category: "Premium Trip",
    country: "Nepal",
    region: "Annapurna Region",
    duration: "12 Days",
    difficulty: "Demanding",
    badge: "Alpine Pass",
    price: 132000,
    currency: "BDT",
    rating: 4.9,
    season: "Autumn",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    _id: "p5",
    title: "Sunderbans Mangrove Survival & River Kayak",
    slug: "sunderbans-mangrove-survival-kayak",
    category: "Family Treks",
    country: "Bangladesh",
    region: "Khulna Delta",
    duration: "3 Days / 2 Nights",
    difficulty: "Easy",
    badge: "Family Guided",
    price: 11500,
    currency: "BDT",
    rating: 4.8,
    season: "Winter",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
    ],
  },
  {
    _id: "p6",
    title: "Basic Mountaineering & Rope Rigging Course",
    slug: "basic-mountaineering-rope-rigging-course",
    category: "Learning Program",
    country: "Bangladesh",
    region: "Sitakunda Range",
    duration: "5 Days",
    difficulty: "Moderate",
    badge: "Certified Diploma",
    price: 17500,
    currency: "BDT",
    rating: 5.0,
    season: "Winter",
    images: [
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop",
    ],
  },
];

// --- FALLBACK REVIEWS ---
const DEFAULT_REVIEWS = [
  {
    _id: "r1",
    authorName: "Mohiuddin Mahi",
    authorRole: "Expedition Leader, Keokradong Batch 12",
    rating: 5,
    source: "Google Reviews",
    content:
      "Rope4's instructors transformed our approach to wilderness safety. The survival navigation drills, campcraft, and leadership workshops were truly international standard.",
  },
  {
    _id: "r2",
    authorName: "Nusrat Jahan",
    authorRole: "Parent, Youth Summer Survival Camp",
    rating: 5,
    source: "Google Reviews",
    content:
      "My 12-year old son returned from the 3-day survival camp with incredible resilience, outdoor respect, and knotting mastery. The 1:6 instructor ratio gave complete peace of mind.",
  },
  {
    _id: "r3",
    authorName: "Kazi Tanvir Ahmed",
    authorRole: "EBC Expedition Member",
    rating: 5,
    source: "Video Stories",
    content:
      "Impeccable acclimatization schedule and pulse oximeter monitoring throughout the Khumbu trek. Rope4 is without doubt the gold standard for high-altitude trekking.",
  },
  {
    _id: "r4",
    authorName: "Dr. Farah Naz",
    authorRole: "Family Nature Trek Participant",
    rating: 5,
    source: "Google Reviews",
    content:
      "Taking our young children to Bandarban was made totally safe and stress-free by the Rope4 medical and guiding crew. Highly recommended for families!",
  },
];

// --- FALLBACK NEWS ARTICLES ---
const DEFAULT_NEWS = [
  {
    _id: "n1",
    title: "Wilderness First Aid & Frostbite Management in High Altitude",
    slug: "wilderness-first-aid-frostbite-management",
    category: "Medical & Safety",
    publishedAt: "2026-02-15",
    readTime: "6 min read",
    thumbnail:
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop",
    snippet:
      "Critical protocols for recognizing altitude sickness symptoms, administering dexamethasone, and organizing swift evacuation in alpine environments.",
  },
  {
    _id: "n2",
    title: "Essential Packing List for 2026 Spring Himalayan Treks",
    slug: "essential-packing-list-spring-himalayan-treks",
    category: "Gear Guide",
    publishedAt: "2026-03-01",
    readTime: "8 min read",
    thumbnail:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop",
    snippet:
      "A complete breakdown of layering systems, -20C down sleeping bags, carbon trekking poles, and mountaineering boots approved for Thorong La Pass.",
  },
  {
    _id: "n3",
    title: "Rope4 Certified Outdoor Education Batches Open for Youth",
    slug: "rope4-certified-outdoor-education-batches-open",
    category: "Latest Updates",
    publishedAt: "2026-03-10",
    readTime: "4 min read",
    thumbnail:
      "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=800&auto=format&fit=crop",
    snippet:
      "New summer 2026 calendar announced covering basic rock climbing, rope ascending, wilderness cookery, and leave-no-trace outdoor ethics.",
  },
];

// --- FALLBACK FAQS ---
const DEFAULT_FAQS = [
  {
    category: "General & Booking",
    question: "Are Rope4 programs beginner-friendly?",
    answer:
      "Yes! Many of our programs, including Youth Summer Camps and Family Treks, are specifically designed for beginners with no prior mountaineering experience. Each course clearly details its fitness and gear prerequisites.",
  },
  {
    category: "Safety & Medical",
    question: "What safety protocols and medical support are provided on expeditions?",
    answer:
      "All expeditions are led by NIM (Nehru Institute of Mountaineering) certified chief instructors. We carry comprehensive wilderness first-aid kits, pulse oximeters, portable hyperbaric chambers where required, emergency satellite radios, and enforce a 1:6 instructor-to-student ratio.",
  },
  {
    category: "Gear & Equipment",
    question: "What gear is provided by Rope4 and what do I need to bring?",
    answer:
      "All collective mountaineering hardware (UIAA certified 9.8mm ropes, helmets, harnesses, technical carabiners, 4-season alpine tents, and cooking stoves) is provided. Personal clothing, boots, and rucksacks can be rented or purchased directly from our official Gear Store.",
  },
  {
    category: "Fitness & Preparation",
    question: "How should I train and prepare physically for a high-altitude trek?",
    answer:
      "We recommend beginning cardiovascular workouts (brisk uphill walking, cycling, or stair climbing with a 5kg backpack) at least 6 to 8 weeks prior to departure. Our team provides an individualized training plan upon enrollment.",
  },
  {
    category: "General & Booking",
    question: "What is your cancellation and refund policy?",
    answer:
      "Cancellations made 30 days or more before departure receive a 100% refund minus a nominal 5% banking fee. Cancellations made between 15-29 days receive a 50% refund or can be transferred to a future departure date without penalty.",
  },
];

export default function HomePage() {
  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSlidePaused, setIsSlidePaused] = useState(false);

  // Dynamic CMS States
  const [programs, setPrograms] = useState<any[]>(DEFAULT_PROGRAMS);
  const [reviews, setReviews] = useState<any[]>(DEFAULT_REVIEWS);
  const [news, setNews] = useState<any[]>(DEFAULT_NEWS);
  const [faqs, setFaqs] = useState<any[]>(DEFAULT_FAQS);
  const [aggregateScore, setAggregateScore] = useState<number>(4.9);
  const [totalReviewsCount, setTotalReviewsCount] = useState<number>(1280);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [selectedCountry, setSelectedCountry] = useState("All");

  // Tabs States
  const [activeReviewTab, setActiveReviewTab] = useState("all");
  const [activeFaqCategory, setActiveFaqCategory] = useState("All");

  // Dialog State
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryProgram, setInquiryProgram] = useState("");

  // Wishlist Local State
  const [wishlist, setWishlist] = useState<string[]>([]);

  // 1. Fetch Dynamic Data from Backend API
  useEffect(() => {
    let isMounted = true;

    // Fetch Programs
    publicApiClient
      .get("/public/programs")
      .then((res) => {
        if (isMounted && res.data?.data && res.data.data.length > 0) {
          setPrograms(res.data.data);
        }
      })
      .catch(() => {});

    // Fetch Reviews & Aggregate
    publicApiClient
      .get("/public/reviews")
      .then((res) => {
        if (isMounted && res.data?.data?.items && res.data.data.items.length > 0) {
          setReviews(res.data.data.items);
        }
      })
      .catch(() => {});

    publicApiClient
      .get("/public/reviews/aggregate")
      .then((res) => {
        if (isMounted && res.data?.data) {
          if (res.data.data.averageRating)
            setAggregateScore(Number(res.data.data.averageRating.toFixed(1)));
          if (res.data.data.totalReviews)
            setTotalReviewsCount(res.data.data.totalReviews);
        }
      })
      .catch(() => {});

    // Fetch News
    publicApiClient
      .get("/public/news")
      .then((res) => {
        if (isMounted && res.data?.data?.items && res.data.data.items.length > 0) {
          setNews(res.data.data.items);
        }
      })
      .catch(() => {});

    // Fetch FAQs
    publicApiClient
      .get("/public/faqs")
      .then((res) => {
        if (isMounted && res.data?.data && res.data.data.length > 0) {
          setFaqs(res.data.data);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

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
        if (p.season && p.season.toLowerCase() !== selectedSeason.toLowerCase())
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

  // Reviews filtering
  const filteredReviews = useMemo(() => {
    if (activeReviewTab === "all") return reviews;
    return reviews.filter(
      (r) =>
        r.source?.toLowerCase().includes(activeReviewTab.toLowerCase()) ||
        r.category?.toLowerCase().includes(activeReviewTab.toLowerCase())
    );
  }, [reviews, activeReviewTab]);

  // FAQ Categories
  const faqCategories = useMemo(() => {
    const cats = new Set<string>();
    cats.add("All");
    faqs.forEach((f) => {
      if (f.category) cats.add(f.category);
    });
    return Array.from(cats);
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    if (activeFaqCategory === "All") return faqs;
    return faqs.filter(
      (f) => f.category?.toLowerCase() === activeFaqCategory.toLowerCase()
    );
  }, [faqs, activeFaqCategory]);

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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Premium Trips",
              tagline: "Iconic high-altitude expeditions, technical passes & summits",
              icon: Mountain,
              count: "Himalaya & Beyond",
              gradient: "from-emerald-900 via-emerald-950 to-black",
              href: "/programs?category=Premium+Trip",
            },
            {
              title: "Youth Summer Camps",
              tagline: "Wilderness survival skills, fire-craft, knotting & teamwork",
              icon: Tent,
              count: "Ages 8 - 18",
              gradient: "from-teal-900 via-teal-950 to-emerald-950",
              href: "/programs?category=Summer+Camp",
            },
            {
              title: "Family With Kids",
              tagline: "Gentle forest trails, lake camping & nature observation",
              icon: Users,
              count: "All Ages Welcome",
              gradient: "from-green-900 via-emerald-950 to-teal-950",
              href: "/programs?category=Family+Treks",
            },
            {
              title: "Learning Programs",
              tagline: "Basic & Advanced certified mountaineering and rigging courses",
              icon: BookOpen,
              count: "Certified Diplomas",
              gradient: "from-slate-900 via-emerald-950 to-zinc-950",
              href: "/programs?category=Learning+Program",
            },
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                href={cat.href}
                className={`p-6 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between group min-h-[240px] border border-white/10`}
              >
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300 group-hover:scale-110 group-hover:bg-accent group-hover:text-accent-foreground transition-all">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-emerald-300 tracking-wider uppercase block">
                      {cat.count}
                    </span>
                    <h3 className="text-xl font-bold leading-snug group-hover:text-emerald-200 transition-colors mt-0.5">
                      {cat.title}
                    </h3>
                  </div>
                  <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                    {cat.tagline}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 pt-4 border-t border-white/10">
                  <span>View Upcoming Batches</span>
                  <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

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
            {filteredPrograms.length > 0 ? (
              filteredPrograms.slice(0, 6).map((prog) => {
                const isSaved = wishlist.includes(prog._id);
                const thumb =
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
                            {prog.duration || "4 Days"}
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
                            {prog.price ? `${prog.price.toLocaleString()} ${prog.currency || "BDT"}` : "Inquire"}
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
                  No programs match the selected filters
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
          4. "WHY CHOOSE US" STAT CARDS
      ======================================================== */}
      <section className="bg-primary text-primary-foreground py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-14">
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-300">
              Wilderness Safety & Instruction
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Why Learn & Trek With Rope4?
            </h2>
            <p className="text-sm text-emerald-100/80 max-w-xl mx-auto leading-relaxed">
              We operate under the strictest international mountaineering safety guidelines and certified experiential learning methodologies.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Trophy,
                value: "16+ Years",
                label: "Alpine Experience",
                sublabel: "Led by NIM certified chief instructors & Himalayan summitteers.",
              },
              {
                icon: Users,
                value: "15,000+",
                label: "Travelers & Students",
                sublabel: "Wilderness survival, youth school camps, and technical courses.",
              },
              {
                icon: ShieldCheck,
                value: "100%",
                label: "Wilderness Safety Record",
                sublabel: "Zero critical incidents through strict medical protocol and 1:6 ratio.",
              },
              {
                icon: Award,
                value: "25+ Accreditations",
                label: "Forest & Tourism Awards",
                sublabel: "Eco-tourism sustainability and leave-no-trace ethics certified.",
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="bg-emerald-900/60 border border-emerald-700/50 rounded-2xl p-6 text-center space-y-3 backdrop-blur-sm hover:bg-emerald-900/80 transition-colors"
                >
                  <div className="h-12 w-12 rounded-xl bg-accent text-accent-foreground mx-auto flex items-center justify-center shadow-md">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="font-semibold text-sm text-emerald-200">
                    {stat.label}
                  </div>
                  <p className="text-xs text-emerald-100/70 leading-relaxed">
                    {stat.sublabel}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. REVIEWS TABBED CAROUSEL & AGGREGATE SCORE
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              <span>
                {aggregateScore} / 5.0 Average Rating ({totalReviewsCount.toLocaleString()} Verified Trekkers)
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              What Adventurers Say
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Authentic stories and feedback from participants across our summits and youth camps.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-muted p-1 rounded-xl">
            {[
              { id: "all", label: "All Reviews" },
              { id: "google", label: "Google Reviews" },
              { id: "video", label: "Video Stories" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveReviewTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeReviewTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredReviews.slice(0, 3).map((rev) => (
            <div
              key={rev._id}
              className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-500" />
                    ))}
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {rev.source || "Google Review"}
                  </Badge>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed italic">
                  &ldquo;{rev.content}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  {rev.authorName?.slice(0, 2).toUpperCase() || "TR"}
                </div>
                <div className="truncate">
                  <div className="font-bold text-sm text-foreground truncate">
                    {rev.authorName}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {rev.authorRole || "Trekker"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          6. "STAY INFORMED" NEWS & STORIES CAROUSEL
      ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <Badge variant="nature" className="px-3 py-1 font-semibold uppercase mb-2">
              Outdoor Knowledge Base
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Stay Informed
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Field dispatches, alpine medical safety advice, and gear checklists from our guides.
            </p>
          </div>
          <Link
            href="/news"
            className="text-sm font-semibold text-primary hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Read all articles</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.slice(0, 3).map((item) => (
            <Link
              key={item._id}
              href={`/news/${item.slug || item._id}`}
              className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              <div className="relative h-48 bg-muted overflow-hidden">
                <div
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage: `url(${
                      item.thumbnail ||
                      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop"
                    })`,
                  }}
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur text-white text-[10px] font-semibold">
                  {item.category || "Expedition"}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString() : "Recent"}</span>
                    <span>•</span>
                    <span>{item.readTime || "5 min read"}</span>
                  </div>
                  <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {item.snippet}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-semibold text-primary pt-2">
                  <span>Read Full Article</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ========================================================
          7. CATEGORIZED FAQ ACCORDIONS
      ======================================================== */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <Badge variant="nature" className="px-3 py-1 font-semibold uppercase">
            Got Questions?
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Everything you need to know about preparation, medical safety, fitness prerequisites, and booking.
          </p>
        </div>

        {/* Category Filter Chips */}
        {faqCategories.length > 2 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {faqCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFaqCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeFaqCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Radix Animated Accordion */}
        <Accordion type="single" collapsible className="w-full space-y-3">
          {filteredFaqs.map((faq, idx) => (
            <AccordionItem
              key={idx}
              value={`faq-${idx}`}
              className="border border-border rounded-xl px-5 bg-card shadow-sm"
            >
              <AccordionTrigger className="text-sm sm:text-base font-semibold hover:text-primary text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-1">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

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
