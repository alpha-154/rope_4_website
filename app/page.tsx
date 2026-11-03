"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  Calendar,
  Clock,
  ShieldCheck,
  Trophy,
  Users,
  Award,
  ChevronRight,
  Star,
  Heart,
  MessageCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  // State for "Plan Your Next Adventure" quick filter chips
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");
  const [activeReviewTab, setActiveReviewTab] = useState("google");
  const [activeNewsTab, setActiveNewsTab] = useState("updates");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const categories = [
    {
      title: "Premium Trips",
      tagline: "Iconic high-altitude expeditions & summits",
      count: "8 Expeditions",
      color: "from-emerald-900 to-emerald-950",
      href: "/programs?category=Premium+Trip",
    },
    {
      title: "Youth Summer Camps",
      tagline: "Wilderness survival, knotting & teamwork",
      count: "6 Camps",
      color: "from-teal-900 to-teal-950",
      href: "/programs?category=Summer+Camp",
    },
    {
      title: "Family With Kids",
      tagline: "Gentle trails, camping & nature exploration",
      count: "5 Treks",
      color: "from-green-900 to-green-950",
      href: "/programs?category=Family+Treks",
    },
    {
      title: "Learning Programs",
      tagline: "Basic & Advanced certified mountaineering courses",
      count: "4 Courses",
      color: "from-slate-900 to-emerald-950",
      href: "/programs?category=Learning+Program",
    },
  ];

  const featuredPrograms = [
    {
      id: "1",
      title: "Keokradong & Boga Lake Expedition",
      category: "Learning Program",
      country: "Bangladesh",
      region: "Bandarban",
      duration: "4 Days / 3 Nights",
      difficulty: "Moderate",
      badge: "Popular Course",
      price: "14,500 BDT",
      rating: 4.9,
      season: "Winter",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "2",
      title: "Wilderness Survival & Bushcraft Camp",
      category: "Summer Camp",
      country: "Bangladesh",
      region: "Sylhet Forest",
      duration: "3 Days / 2 Nights",
      difficulty: "Easy",
      badge: "Youth & Beginners",
      price: "8,900 BDT",
      rating: 4.8,
      season: "Autumn",
      image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: "3",
      title: "Everest Base Camp & Kala Patthar",
      category: "Premium Trip",
      country: "Nepal",
      region: "Khumbu Himalaya",
      duration: "14 Days",
      difficulty: "Challenging",
      badge: "Iconic Summit",
      price: "1,250 USD",
      rating: 5.0,
      season: "Spring",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=800&auto=format&fit=crop",
    },
  ];

  const whyChooseUsStats = [
    {
      icon: Users,
      value: "15,000+",
      label: "Educated Adventurers",
      sublabel: "Across schools, youth & mountaineering batches",
    },
    {
      icon: Trophy,
      value: "16+ Years",
      label: "Alpine Experience",
      sublabel: "NIM certified chief instructor & certified safety crew",
    },
    {
      icon: ShieldCheck,
      value: "100%",
      label: "Wilderness Safety Record",
      sublabel: "Zero critical incidents through strict SOP protocols",
    },
    {
      icon: Award,
      value: "25+ Accreditations",
      label: "Forest & Tourism Badges",
      sublabel: "Official eco-tourism partner with forest departments",
    },
  ];

  const faqs = [
    {
      question: "Are Rope4 programs beginner-friendly?",
      answer:
        "Yes! Many of our programs, including the Youth Summer Camps and Family Treks, are specifically designed for beginners with no prior mountaineering experience. Each program clearly states its fitness prerequisites.",
    },
    {
      question: "What safety measures and medical support are provided?",
      answer:
        "All expeditions are led by NIM (Nehru Institute of Mountaineering) certified instructors. We carry wilderness first-aid kits, pulse oximeters, emergency satellite/radio comms, and operate with an instructor-to-student ratio of 1:6.",
    },
    {
      question: "What gear is included and what do I need to bring?",
      answer:
        "All collective mountaineering gear (tents, ropes, harnesses, cooking gear) is provided. You will receive an essential packing checklist for personal clothing, boots, and rucksacks, which can also be purchased directly from our Gear Store.",
    },
    {
      question: "What is the cancellation and refund policy?",
      answer:
        "Cancellations made 30 days prior to departure receive a full refund minus a 5% handling fee. Cancellations between 15-29 days receive a 50% refund or can be rescheduled to a future batch.",
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center justify-center bg-emerald-950 text-white overflow-hidden">
        {/* Background Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/60 to-transparent" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold tracking-wide uppercase">
            <span>🌲 Rope4 Outdoor Education — Learn and Share</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none text-white">
            Discover Wilderness. <br className="hidden sm:inline" />
            <span className="text-emerald-400">Master Real Adventure.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-emerald-100/80 leading-relaxed">
            Certified outdoor courses, high-altitude expeditions, and survival camps
            guided by seasoned mountaineers. Build confidence, resilience, and respect for nature.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/programs"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accent text-accent-foreground font-semibold text-base hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2"
            >
              <Compass className="h-5 w-5" />
              <span>Explore All Adventures</span>
            </Link>
            <Link
              href="/store"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-base transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <span>Outdoor Gear Store</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. PROGRAM CATEGORY CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Explore By Experience
          </h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Choose the adventure format that fits your journey: certified learning, survival youth camps, or family exploration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className={`p-6 rounded-2xl bg-gradient-to-br ${cat.color} text-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group min-h-[220px]`}
            >
              <div className="space-y-2">
                <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                  {cat.count}
                </span>
                <h3 className="text-xl font-bold leading-snug group-hover:text-emerald-200 transition-colors">
                  {cat.title}
                </h3>
                <p className="text-xs text-white/70 line-clamp-2">
                  {cat.tagline}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-300 pt-4">
                <span>View Batches</span>
                <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. PLAN YOUR NEXT ADVENTURE (SEARCH & FILTER SECTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-secondary/40 border border-border rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Adventure Finder
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mt-1">
                Plan Your Next Adventure
              </h2>
            </div>
            <Link
              href="/programs"
              className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
            >
              <span>View full calendar</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Quick Filter Chips */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground mr-2">
                Season:
              </span>
              {["All", "Winter", "Spring", "Summer", "Autumn"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSelectedSeason(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedSeason === s
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-background border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground mr-2">
                Grade:
              </span>
              {["All", "Easy", "Moderate", "Challenging"].map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDifficulty(d)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    selectedDifficulty === d
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-background border border-border text-foreground hover:bg-muted"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Program Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {featuredPrograms.map((prog) => (
              <div
                key={prog.id}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col group"
              >
                {/* Image & Wishlist Button */}
                <div className="relative h-48 bg-muted overflow-hidden">
                  <div
                    className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url(${prog.image})` }}
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold">
                    {prog.badge}
                  </div>
                  <button
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 backdrop-blur hover:bg-white text-muted-foreground hover:text-red-500 flex items-center justify-center transition-colors shadow-sm"
                    title="Add to wishlist"
                  >
                    <Heart className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-3 left-3 px-2.5 py-0.5 rounded-md bg-white/90 backdrop-blur text-primary text-xs font-semibold">
                    {prog.region}, {prog.country}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {prog.duration}
                      </span>
                      <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {prog.difficulty}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-foreground leading-snug group-hover:text-primary transition-colors">
                      {prog.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase text-muted-foreground font-semibold block">
                        Per Person
                      </span>
                      <span className="text-base font-extrabold text-foreground">
                        {prog.price}
                      </span>
                    </div>
                    <Link
                      href={`/programs/${prog.id}`}
                      className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground font-semibold text-xs transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US (STAT CARDS) */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-300">
              Proven Excellence
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Why Learn & Trek With Rope4?
            </h2>
            <p className="text-sm text-emerald-100/70 max-w-xl mx-auto">
              We adhere strictly to international safety protocols and alpine training principles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUsStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="bg-emerald-900/50 border border-emerald-700/40 rounded-2xl p-6 text-center space-y-3"
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
                  <p className="text-xs text-emerald-100/60 leading-relaxed">
                    {stat.sublabel}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. REVIEWS & RATINGS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold mb-2">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>4.9 / 5.0 Average Traveler Rating</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              What Adventurers Say
            </h2>
          </div>

          {/* Review Tabs */}
          <div className="flex items-center gap-2">
            {[
              { id: "google", label: "Google Reviews" },
              { id: "videos", label: "Video Stories" },
              { id: "partners", label: "Trusted Partners" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveReviewTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  activeReviewTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              author: "Tanvir Ahmed",
              role: "Keokradong Expedition Participant",
              text: "Rope4's trainers transformed my approach to mountain trekking. The survival skills and navigation workshops were world-class.",
              rating: 5,
            },
            {
              author: "Nusrat Jahan",
              role: "Youth Summer Camp Parent",
              text: "My 12-year old son returned from the camp with unmatched confidence, outdoor awareness, and knotting mastery. Truly inspiring!",
              rating: 5,
            },
            {
              author: "Rakib Hassan",
              role: "Everest Base Camp Batch",
              text: "Impeccable acclimatization schedule and safety monitoring. Mohiuddin Mahi and the Rope4 crew are the real deal in Bangladesh mountaineering.",
              rating: 5,
            },
          ].map((rev) => (
            <div
              key={rev.author}
              className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed italic">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>
              <div className="pt-3 border-t border-border">
                <h4 className="font-semibold text-sm text-foreground">{rev.author}</h4>
                <p className="text-xs text-muted-foreground">{rev.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FREQUENTLY ASKED QUESTIONS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs uppercase tracking-wider font-semibold text-primary">
            Got Questions?
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Everything you need to know about preparing, booking, and trekking with Rope4.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={faq.question}
                className="border border-border rounded-xl bg-card overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-semibold text-sm sm:text-base flex items-center justify-between gap-4 hover:bg-muted/30 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronRight
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      isOpen ? "rotate-90 text-primary" : "text-muted-foreground"
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/50">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. FLOATING ACTION WIDGETS */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* WhatsApp / Call quick link */}
        <a
          href="https://wa.me/8801700000000"
          target="_blank"
          rel="noreferrer"
          className="h-12 w-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110"
          title="Instant WhatsApp Support"
        >
          <MessageCircle className="h-6 w-6" />
        </a>
      </div>
    </div>
  );
}
