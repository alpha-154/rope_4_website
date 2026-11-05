"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Mountain, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Linkedin, ShieldCheck } from "lucide-react";
import { publicApiClient } from "@/lib/axios";

export function Footer() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    publicApiClient
      .get("/public/settings/navigation")
      .then((res) => {
        if (isMounted && res.data?.data?.footer) {
          setSettings(res.data.data.footer);
        }
      })
      .catch(() => {
        // Fallback to static defaults
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const aboutText =
    settings?.aboutText ||
    "Outdoor education, mountaineering skills, and worldwide adventure treks. Learn, share, and experience wilderness with certified expedition guides.";

  const emergencyHotline = settings?.emergencyHotline || "+880 1700-000000";
  const copyright =
    settings?.copyright ||
    `© ${new Date().getFullYear()} Rope4 Outdoor Education. All rights reserved.`;

  const columns = settings?.columns && settings.columns.length > 0 ? settings.columns : null;
  const socialLinks = settings?.socialLinks && settings.socialLinks.length > 0 ? settings.socialLinks : null;
  const badges = settings?.badges && settings.badges.length > 0 ? settings.badges : null;

  return (
    <footer className="bg-emerald-950 text-white/90 border-t border-emerald-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow">
                <Mountain className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Rope4</span>
            </div>
            <p className="text-sm text-emerald-100/70 max-w-sm leading-relaxed">
              {aboutText}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks ? (
                socialLinks.map((s: any, idx: number) => (
                  <a
                    key={idx}
                    href={s.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="h-9 w-9 rounded-full bg-emerald-900/60 flex items-center justify-center hover:bg-emerald-800 transition-colors text-xs font-semibold text-white uppercase"
                    title={s.platform}
                  >
                    {s.platform?.slice(0, 2) || "SO"}
                  </a>
                ))
              ) : (
                <>
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="h-9 w-9 rounded-full bg-emerald-900/60 flex items-center justify-center hover:bg-emerald-800 transition-colors"
                  >
                    <Facebook className="h-4 w-4" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="h-9 w-9 rounded-full bg-emerald-900/60 flex items-center justify-center hover:bg-emerald-800 transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="h-9 w-9 rounded-full bg-emerald-900/60 flex items-center justify-center hover:bg-emerald-800 transition-colors"
                  >
                    <Youtube className="h-4 w-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="h-9 w-9 rounded-full bg-emerald-900/60 flex items-center justify-center hover:bg-emerald-800 transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </>
              )}
            </div>

            {/* Trust badges */}
            {badges && (
              <div className="pt-2 flex flex-wrap gap-2">
                {badges.map((b: any, idx: number) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-900/40 text-xs text-emerald-200"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    <span>{b.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Dynamic or Default Navigation Columns */}
          {columns ? (
            columns.map((col: any, colIdx: number) => (
              <div key={colIdx} className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  {col.title}
                </h3>
                <ul className="space-y-2 text-sm text-emerald-100/70">
                  {(col.links || []).map((link: any, linkIdx: number) => (
                    <li key={linkIdx}>
                      <Link href={link.url || "#"} className="hover:text-white transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <>
              {/* Program Categories */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Adventures</h3>
                <ul className="space-y-2 text-sm text-emerald-100/70">
                  <li><Link href="/programs?category=Premium+Trip" className="hover:text-white transition-colors">Premium Trips</Link></li>
                  <li><Link href="/programs?category=Summer+Camp" className="hover:text-white transition-colors">Summer Camps</Link></li>
                  <li><Link href="/programs?category=Family+Treks" className="hover:text-white transition-colors">Family Treks</Link></li>
                  <li><Link href="/programs?category=Learning+Program" className="hover:text-white transition-colors">Learning Courses</Link></li>
                  <li><Link href="/programs" className="hover:text-white transition-colors">All Departures</Link></li>
                </ul>
              </div>

              {/* Quick Links */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Company</h3>
                <ul className="space-y-2 text-sm text-emerald-100/70">
                  <li><Link href="/news" className="hover:text-white transition-colors">Stay Informed</Link></li>
                  <li><Link href="/store" className="hover:text-white transition-colors">Outdoor Gear</Link></li>
                  <li><Link href="/faqs" className="hover:text-white transition-colors">FAQs & Guides</Link></li>
                  <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                  <li><Link href="/customer/login" className="hover:text-white transition-colors">Traveler Account</Link></li>
                </ul>
              </div>
            </>
          )}

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Contact</h3>
            <div className="space-y-2.5 text-sm text-emerald-100/70">
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                <span>Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{emergencyHotline}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>contact@rope4.org</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-100/50 gap-4">
          <p>{copyright}</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/safety" className="hover:text-white transition-colors">
              Wilderness Safety Code
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
