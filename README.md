# Rope4 Customer Website

Customer-facing Next.js 14 App Router portal for **Rope4 Outdoor Education**, providing adventure trek discovery, interactive itineraries, certified gear e-commerce, and traveler account portals.

---

## 🌲 Design & Tech Stack
* **Framework**: Next.js 14 (App Router) + TypeScript Strict Mode
* **Design Identity**: Rope4 Nature Forest Green (`#1B4D3E` / `hsl(153 48% 21%)`) with golden accent tokens
* **Styling**: Tailwind CSS + Shadcn UI primitives + Lucide Icons + Framer Motion
* **Cart State**: Persistent React Context (`rope4_cart_items`) with slide-out cart drawer
* **Customer Session**: JWT session management (`customerToken`) with profile and wishlist synchronization
* **SEO**: OpenGraph dynamic cards, JSON-LD schemas (`TouristTrip`, `Product`), dynamic XML sitemap, and robots.txt

---

## 🚀 Getting Started

### 1. Environment Setup
```bash
cp .env.example .env
```
Default configuration:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
NEXT_PUBLIC_ORGANIZATION_ID=default-org-id
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Run Commands
```bash
# Start dev server on port 3000
npm run dev

# Run linting
npm run lint

# Production build
npm run build
```

---

## 🌐 Routes & Workflows
* **Home (`/`)**: Hero slider, "Plan Your Next Adventure" live search bar, category cards, stats, tabbed testimonials carousel, news carousel, FAQ accordion, floating inquiry triggers.
* **Programs Catalog (`/programs`)**: Multi-faceted filter sidebar for categories, countries, difficulty, seasons, and dynamic sorting.
* **Program Details (`/programs/[slug]`)**: Hero photo gallery, sticky anchor navigation, day-by-day itinerary accordions, departure picker, inclusions/exclusions, sticky booking inquiry card.
* **Gear Store (`/store`)**: Mountain equipment catalog with category chips, price sorting, and direct add-to-cart.
* **Product Detail (`/store/[slug]`)**: Specifications table, stock availability badge, quantity picker, and "Buy Now" checkout shortcut.
* **Checkout Flow (`/checkout`)**: Pre-filled customer contact, shipping address fields, courier shipping tier, payment methods (COD, bKash, Nagad, Card), and order confirmation (`/checkout/success`).
* **Customer Portal (`/customer/*`)**:
  * `/customer/login`: Account sign-in with redirect preservation
  * `/customer/register`: Traveler account creation
  * `/customer/profile`: Personal details, saved shipping destinations manager, and wishlist
  * `/customer/orders`: Order history tracking with item breakdowns and status badges
* **Contact & Inquiries (`/contact`)**: Headquarters details, emergency hotlines, and dynamic form submissions.
* **SEO Engine**: `/sitemap.xml` and `/robots.txt`.
