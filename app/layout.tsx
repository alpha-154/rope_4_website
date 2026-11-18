import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { FloatingWidgets } from "@/components/shared/floating-widgets";
import { CartDrawer } from "@/components/shared/cart-drawer";
import { ReactQueryProvider } from "@/lib/react-query";
import { CartProvider } from "@/lib/cart-context";
import { CustomerAuthProvider } from "@/lib/customer-auth-context";
import { Toaster } from "sonner";
import { Montserrat } from "next/font/google";
import { IntroVideo, INTRO_GATE_SCRIPT } from "@/components/shared/intro-video";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rope4.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rope4 | Outdoor Education, Treks & Expeditions Worldwide",
    template: "%s | Rope4 Outdoor Education",
  },
  description:
    "Rope4 Outdoor Education offers certified mountaineering programs, youth survival camps, family treks, and alpine adventure gear. Learn, Share, and Explore with certified guides.",
  keywords: [
    "Mountaineering Bangladesh",
    "Everest Base Camp Trek",
    "Annapurna Circuit",
    "Bandarban Trekking",
    "Keokradong Summit",
    "Youth Wilderness Summer Camp",
    "Rope4 Outdoor Education",
    "Adventure Gear Store",
    "Rock Climbing Courses",
  ],
  authors: [{ name: "Rope4 Outdoor Education", url: siteUrl }],
  creator: "Rope4",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "Rope4 | Outdoor Education, Treks & Expeditions Worldwide",
    description:
      "Certified mountaineering courses, high-altitude Himalayan expeditions, youth wilderness survival camps, and mountain-grade gear.",
    siteName: "Rope4 Outdoor Education",
    images: [
      {
        url: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200&auto=format&fit=crop",
        width: 1200,
        height: 630,
        alt: "Rope4 High Altitude Expedition",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rope4 | Outdoor Education & Mountain Expeditions",
    description:
      "Join certified mountaineers on high-altitude expeditions, youth survival camps, and professional climbing courses.",
    images: [
      "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200&auto=format&fit=crop",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the gate script may add data-intro before React hydrates
    <html lang="en" className={montserrat.variable} suppressHydrationWarning>
      <head>
        {/* Runs before first paint: decides whether the intro plays so the page never flashes first */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_GATE_SCRIPT }} />
      </head>
      <body className="min-h-screen flex flex-col bg-background font-sans text-foreground">
        {/* Server-rendered cover, visible only while html[data-intro="pending"] */}
        <div className="intro-cover" aria-hidden="true" />
        <ReactQueryProvider>
          <CustomerAuthProvider>
            <CartProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <FloatingWidgets />
              <CartDrawer />
              <Toaster richColors position="top-right" />
              <IntroVideo />
            </CartProvider>
          </CustomerAuthProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
