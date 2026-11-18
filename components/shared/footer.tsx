"use client";

import Link from "next/link";
import { useState } from "react";
import { Mountain, Mail, Phone, MapPin, ShieldCheck } from "lucide-react";
import { useSiteSettings, useOrgProfile } from "@/lib/site-data";
import {
  SOCIAL_PLATFORMS,
  type SocialKey,
} from "@/components/shared/social-icons";

const DEFAULT_SOCIAL: Record<SocialKey, string> = {
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  youtube: "https://youtube.com",
  linkedin: "https://linkedin.com",
};

function BadgeImage({ src, label }: { src?: string; label: string }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <ShieldCheck className="h-8 w-8 text-emerald-700" aria-hidden="true" />
    );
  }
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={label}
      className="h-full w-full object-contain"
      onError={() => setBroken(true)}
    />
  );
}

export function Footer() {
  const { data: siteSettings } = useSiteSettings();
  const { data: org } = useOrgProfile();
  const settings = siteSettings?.footer;
  const header = siteSettings?.header;

  const aboutText =
    settings?.aboutText ||
    "Outdoor education, mountaineering skills, and worldwide adventure treks. Learn, share, and experience wilderness with certified expedition guides.";

  const brandName = header?.logoText || "Rope4";
  const logoUrl = header?.logoUrl;

  const contactAddress = org?.address || "Dhaka, Bangladesh";
  const contactPhone =
    org?.contactPhone || settings?.emergencyHotline || "+880 1700-000000";
  const contactEmail = org?.contactEmail || "contact@rope4.org";

  const copyright =
    settings?.copyright ||
    `© ${new Date().getFullYear()} ${brandName} Outdoor Education. All rights reserved.`;

  const columns =
    settings?.columns && settings.columns.length > 0 ? settings.columns : null;
  const badges = settings?.badges?.filter((b) => b.imageUrl || b.label) ?? [];

  // Social URLs: organization profile first, then footer settings (matched by platform name).
  const socialUrls: Partial<Record<SocialKey, string>> = {};
  for (const p of SOCIAL_PLATFORMS) {
    const fromOrg = org?.socialLinks?.[p.key];
    const fromFooter = settings?.socialLinks?.find((s) =>
      s.platform?.toLowerCase().includes(p.key)
    )?.url;
    const url = fromOrg || fromFooter;
    if (url) socialUrls[p.key] = url;
  }
  const hasAnySocial = Object.keys(socialUrls).length > 0;
  const socials = SOCIAL_PLATFORMS.filter((p) =>
    hasAnySocial ? socialUrls[p.key] : true
  ).map((p) => ({
    ...p,
    url: hasAnySocial ? socialUrls[p.key]! : DEFAULT_SOCIAL[p.key],
  }));

  return (
    <footer className="relative overflow-hidden bg-emerald-950 text-white/90">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
        src="/footer-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        onError={(e) => {
          (e.currentTarget as HTMLVideoElement).style.display = "none";
        }}
      />
      {/* Dark overlay: fades in below the blend zone so the top stays light */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0) 0rem, rgba(0,0,0,0.25) 10rem, rgba(0,0,0,0.55) 18rem, rgba(0,0,0,0.65) 100%)",
        }}
        aria-hidden="true"
      />
      {/* Top blend into the page above: eased multi-stop gradient for a seamless fade */}
      <div
        className="absolute inset-x-0 top-0 h-80 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(var(--background) / 0.97) 10%, hsl(var(--background) / 0.9) 20%, hsl(var(--background) / 0.78) 32%, hsl(var(--background) / 0.6) 45%, hsl(var(--background) / 0.4) 58%, hsl(var(--background) / 0.22) 72%, hsl(var(--background) / 0.08) 86%, hsl(var(--background) / 0) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-52 lg:pt-64 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: brand, description, social links */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-white shadow overflow-hidden">
                {logoUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={logoUrl}
                    alt={brandName}
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <Mountain className="h-5 w-5" />
                )}
              </div>
              <div>
                <span className="block text-xl font-bold tracking-tight text-white">
                  {brandName}
                </span>
                {header?.tagline && (
                  <span className="block text-[10px] uppercase tracking-wider text-emerald-100/60 font-semibold">
                    {header.tagline}
                  </span>
                )}
              </div>
            </div>
            <p className="text-sm text-emerald-50/75 max-w-sm leading-relaxed">
              {aboutText}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 pt-2">
              {socials.map(({ key, label, Icon, hover, url }) => (
                <a
                  key={key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className={`h-9 w-9 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white transition-colors ${hover}`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Right: navigation + contact, then trust badges */}
          <div className="lg:col-span-8 space-y-10">
            <div
              className="grid grid-cols-2 md:[grid-template-columns:var(--footer-cols)] gap-x-8 gap-y-10"
              style={
                {
                  // one column per link group + a wider contact column
                  "--footer-cols": `repeat(${columns?.length ?? 2}, minmax(0, 1fr)) minmax(0, 1.3fr)`,
                } as React.CSSProperties
              }
            >
              {/* Dynamic or Default Navigation Columns */}
              {columns ? (
                columns.map((col, colIdx) => (
                  <div key={colIdx} className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                      {col.title}
                    </h3>
                    <ul className="space-y-2 text-sm text-emerald-50/75">
                      {(col.links || []).map((link, linkIdx) => (
                        <li key={linkIdx}>
                          <Link
                            href={link.url || "#"}
                            target={link.openInNewTab ? "_blank" : undefined}
                            className="hover:text-white transition-colors"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <>
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                      Adventures
                    </h3>
                    <ul className="space-y-2 text-sm text-emerald-50/75">
                      <li>
                        <Link
                          href="/programs?category=Premium+Trip"
                          className="hover:text-white transition-colors"
                        >
                          Premium Trips
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/programs?category=Summer+Camp"
                          className="hover:text-white transition-colors"
                        >
                          Summer Camps
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/programs?category=Family+Treks"
                          className="hover:text-white transition-colors"
                        >
                          Family Treks
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/programs?category=Learning+Program"
                          className="hover:text-white transition-colors"
                        >
                          Learning Courses
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/programs"
                          className="hover:text-white transition-colors"
                        >
                          All Departures
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                      Company
                    </h3>
                    <ul className="space-y-2 text-sm text-emerald-50/75">
                      <li>
                        <Link
                          href="/news"
                          className="hover:text-white transition-colors"
                        >
                          Stay Informed
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/store"
                          className="hover:text-white transition-colors"
                        >
                          Outdoor Gear
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/faqs"
                          className="hover:text-white transition-colors"
                        >
                          FAQs & Guides
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/contact"
                          className="hover:text-white transition-colors"
                        >
                          Contact Us
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/customer/login"
                          className="hover:text-white transition-colors"
                        >
                          Traveler Account
                        </Link>
                      </li>
                    </ul>
                  </div>
                </>
              )}

              {/* Contact Details (organization profile) */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  Contact
                </h3>
                <div className="space-y-2.5 text-sm text-emerald-50/75">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                    <span className="whitespace-pre-line">
                      {contactAddress}
                    </span>
                  </div>
                  <a
                    href={`tel:${contactPhone.replace(/[^\d+]/g, "")}`}
                    className="flex items-center gap-2.5 hover:text-white transition-colors"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{contactPhone}</span>
                  </a>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex items-center gap-2.5 hover:text-white transition-colors [overflow-wrap:anywhere]"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{contactEmail}</span>
                  </a>
                </div>
              </div>
            </div>

            {badges.length > 0 && (
              <div className="space-y-3 pt-8 border-t border-white/10">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                  Trust &amp; Accreditation
                </h3>
                <div className="flex flex-wrap gap-3">
                  {badges.map((b, idx) => {
                    const tile = (
                      <>
                        <BadgeImage src={b.imageUrl} label={b.label} />
                        {b.label && (
                          <span
                            role="tooltip"
                            className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[200px] rounded-md bg-white px-2.5 py-1.5 text-xs font-medium text-emerald-950 shadow-lg opacity-0 translate-y-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 z-20"
                          >
                            {b.label}
                            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white" />
                          </span>
                        )}
                      </>
                    );
                    const tileClass =
                      "group relative h-16 w-16 rounded-xl bg-white/95 p-2 flex items-center justify-center shadow-md ring-1 ring-white/20 transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400";
                    return b.linkUrl ? (
                      <a
                        key={idx}
                        href={b.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={b.label}
                        className={tileClass}
                      >
                        {tile}
                      </a>
                    ) : (
                      <div
                        key={idx}
                        tabIndex={0}
                        aria-label={b.label}
                        className={tileClass}
                      >
                        {tile}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-50/60 gap-4">
          <p>{copyright}</p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
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
