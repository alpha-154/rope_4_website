import Link from "next/link";
import { Mountain, Mail, Phone, MapPin, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";

export function Footer() {
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
              Outdoor education, mountaineering skills, and worldwide adventure treks.
              Learn, share, and experience wilderness with certified expedition guides.
            </p>
            <div className="flex items-center gap-3 pt-2">
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
            </div>
          </div>

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
                <span>+880 1700-000000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>contact@rope4.org</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-emerald-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/50">
          <p>© {new Date().getFullYear()} Rope4 Outdoor Education. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/faqs" className="hover:underline">Privacy Policy</Link>
            <Link href="/faqs" className="hover:underline">Terms of Service</Link>
            <Link href="/faqs" className="hover:underline">Cancellation Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

