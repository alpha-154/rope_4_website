"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Compass,
  Clock,
  MapPin,
  Heart,
  Search,
  Filter,
  X,
  SlidersHorizontal,
  ChevronRight,
  ArrowUpDown,
  Mountain,
  Calendar,
} from "lucide-react";
import { publicApiClient } from "@/lib/axios";
import { useCustomerAuth } from "@/lib/customer-auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const CATEGORIES = [
  "All",
  "Premium Trip",
  "Summer Camp",
  "Family Treks",
  "Learning Program",
];

const COUNTRIES = ["All", "Bangladesh", "Nepal", "India", "Bhutan"];

const DIFFICULTIES = ["All", "Easy", "Moderate", "Challenging", "Demanding"];

const SEASONS = ["All", "Spring", "Summer", "Autumn", "Winter", "Monsoon"];

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
    maxAltitude: "3,172 ft",
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
    maxAltitude: "800 ft",
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
    maxAltitude: "18,519 ft",
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
    maxAltitude: "17,769 ft",
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
    maxAltitude: "Sea Level",
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
    maxAltitude: "1,150 ft",
    images: [
      "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop",
    ],
  },
];

function ProgramsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSeason = searchParams.get("season") || "All";

  const [programs, setPrograms] = useState<any[]>(DEFAULT_PROGRAMS);
  const [isLoading, setIsLoading] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [country, setCountry] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [season, setSeason] = useState(initialSeason);
  const [sortOption, setSortOption] = useState("popularity");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const { isWishlisted, toggleWishlist, isAuthenticated } = useCustomerAuth();
  const [localWishlist, setLocalWishlist] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    publicApiClient
      .get("/public/programs")
      .then((res) => {
        if (isMounted && res.data?.data && res.data.data.length > 0) {
          setPrograms(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleToggleWishlist = async (id: string, title: string) => {
    if (isAuthenticated) {
      await toggleWishlist(id);
      toast.success(`Updated wishlist for ${title}`);
    } else {
      setLocalWishlist((prev) => {
        const exists = prev.includes(id);
        if (exists) {
          toast.info(`Removed ${title} from wishlist`);
          return prev.filter((it) => it !== id);
        } else {
          toast.success(`Saved ${title} to wishlist`);
          return [...prev, id];
        }
      });
    }
  };

  const checkWishlisted = (id: string) => {
    if (isAuthenticated) return isWishlisted(id);
    return localWishlist.includes(id);
  };

  const filteredPrograms = useMemo(() => {
    return programs
      .filter((p) => {
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchesTitle = p.title?.toLowerCase().includes(q);
          const matchesRegion = p.region?.toLowerCase().includes(q);
          const matchesCountry = p.country?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesRegion && !matchesCountry) return false;
        }

        if (category !== "All") {
          if (p.category?.toLowerCase() !== category.toLowerCase()) return false;
        }

        if (country !== "All") {
          if (p.country?.toLowerCase() !== country.toLowerCase()) return false;
        }

        if (difficulty !== "All") {
          if (p.difficulty?.toLowerCase() !== difficulty.toLowerCase())
            return false;
        }

        if (season !== "All") {
          if (p.season?.toLowerCase() !== season.toLowerCase()) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === "price_asc") return (a.price || 0) - (b.price || 0);
        if (sortOption === "price_desc") return (b.price || 0) - (a.price || 0);
        if (sortOption === "rating") return (b.rating || 0) - (a.rating || 0);
        return 0; // default
      });
  }, [programs, search, category, country, difficulty, season, sortOption]);

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setCountry("All");
    setDifficulty("All");
    setSeason("All");
    setSortOption("popularity");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2 border-b border-border pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase tracking-wider">
          <Compass className="h-4 w-4" />
          <span>Rope4 Expedition Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          All Programs & Departures
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
          From weekend wilderness skills camps to high-altitude Himalayan summits. All programs guided by certified mountaineering instructors.
        </p>
      </div>

      {/* Main Content Layout (Sidebar + Grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden flex items-center justify-between gap-3 bg-muted/40 p-3 rounded-xl border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>

          <span className="text-xs text-muted-foreground font-medium">
            {filteredPrograms.length} programs found
          </span>
        </div>

        {/* Sidebar Filters */}
        <aside
          className={`${
            isMobileFilterOpen ? "block" : "hidden"
          } lg:block space-y-6 bg-card border border-border p-6 rounded-2xl shadow-sm`}
        >
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-bold text-base flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <span>Filter Expeditions</span>
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs text-primary hover:underline font-semibold"
            >
              Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Experience Category
            </label>
            <div className="space-y-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    category === c
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Country Filter */}
          <div className="space-y-2.5 pt-2 border-t">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Destination Country
            </label>
            <div className="space-y-1">
              {COUNTRIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCountry(c)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    country === c
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-2.5 pt-2 border-t">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Physical Grade
            </label>
            <div className="space-y-1">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    difficulty === d
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Season Filter */}
          <div className="space-y-2.5 pt-2 border-t">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Ideal Season
            </label>
            <div className="space-y-1">
              {SEASONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setSeason(s)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    season === s
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Programs Listing Grid */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Bar & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/40 p-3 rounded-2xl border">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by trek name or mountain range..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground font-semibold hidden sm:inline">
                Sort:
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="h-10 px-3 rounded-xl border border-input bg-background text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="popularity">Popularity / Rating</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredPrograms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredPrograms.map((prog) => {
                const isSaved = checkWishlisted(prog._id);
                const thumb =
                  prog.images?.[0] ||
                  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop";

                return (
                  <div
                    key={prog._id}
                    className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    {/* Cover Image */}
                    <div className="relative h-56 bg-muted overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                        style={{ backgroundImage: `url(${thumb})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/10">
                        {prog.badge || prog.category}
                      </div>

                      <button
                        onClick={() =>
                          handleToggleWishlist(prog._id, prog.title)
                        }
                        className={`absolute top-3 right-3 h-8 w-8 rounded-full backdrop-blur flex items-center justify-center transition-colors shadow-sm ${
                          isSaved
                            ? "bg-red-50 text-red-600"
                            : "bg-white/80 hover:bg-white text-muted-foreground hover:text-red-500"
                        }`}
                        title={isSaved ? "Saved" : "Add to wishlist"}
                      >
                        <Heart
                          className={`h-4 w-4 ${isSaved ? "fill-red-600" : ""}`}
                        />
                      </button>

                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-white/95 backdrop-blur text-primary text-xs font-semibold flex items-center gap-1 shadow-sm">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>
                          {prog.region ? `${prog.region}, ` : ""}
                          {prog.country || "Bangladesh"}
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1 font-medium">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            {prog.duration || "4 Days"}
                          </span>
                          <span className="font-semibold text-emerald-800 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded text-[11px]">
                            {prog.difficulty || "Moderate"}
                          </span>
                        </div>

                        <h3 className="font-bold text-lg text-foreground leading-snug group-hover:text-primary transition-colors">
                          {prog.title}
                        </h3>

                        {prog.maxAltitude && (
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Mountain className="h-3.5 w-3.5 text-emerald-600" />
                            <span>Max Altitude: {prog.maxAltitude}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase text-muted-foreground font-semibold block">
                            Starting From
                          </span>
                          <span className="text-lg font-extrabold text-foreground">
                            {prog.price
                              ? `${prog.price.toLocaleString("en-US")} ${prog.currency || "BDT"}`
                              : "Inquire"}
                          </span>
                        </div>

                        <Button asChild size="sm" className="gap-1 font-bold">
                          <Link href={`/programs/${prog.slug || prog._id}`}>
                            <span>View Itinerary</span>
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center space-y-3 bg-muted/20 border rounded-2xl p-8">
              <Compass className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="font-bold text-lg">No programs found</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                No active departures matched your current filter combinations.
              </p>
              <Button onClick={resetFilters} variant="outline" size="sm">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-forest-800 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProgramsContent />
    </Suspense>
  );
}
