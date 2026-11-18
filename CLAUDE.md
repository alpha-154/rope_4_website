# rope-4-website

Next.js 14 (App Router) public website for Rope4: program catalog, gear store, checkout,
customer portal, contact/inquiry forms. Content comes from rope-4-admin-panel-backend's
`public/...` routes. Workspace rules: `../CLAUDE.md`.

## Commands
- Dev: `npm run dev` (port 3000; customer login at /customer/login, see `../README.md`)
- Type-check: `npx tsc --noEmit` · Lint: `npm run lint`
- Build: `npm run build` (only with the dev server stopped: both use `.next`)
- No test suite: verify with tsc, lint and the browser preview (desktop and mobile width).

## Layout
- `app/`: `page.tsx` (home), `programs/` + `programs/[slug]`, `store/` + `store/[slug]`,
  `checkout/` + `checkout/success`, `customer/` (login, register, profile, orders), `contact/`,
  `sitemap.ts`, `robots.ts`, `layout.tsx` (metadata, providers, header/footer).
- `components/shared/`: header (mega-menu, mobile drawer), footer, cart-drawer, inquiry-dialog,
  floating-widgets. `components/ui/`: flat shadcn primitives (`@/components/ui/button`).
- `lib/axios.ts`: `publicApiClient` (adds `x-organization-id` and the `customerToken` Bearer).
- `lib/cart-context.tsx` (cart state), `lib/customer-auth-context.tsx` (`useCustomerAuth()`).

## Conventions
- Only call `public/...` backend routes. Never call staff `admin` routes from the website.
- Pages are client components that fetch with `publicApiClient`. Several pages (home, programs,
  store) hold hardcoded `DEFAULT_*` arrays used when the API is empty or down: when you change a
  data shape, update those fallbacks too, or ask whether to remove them.
- SEO matters here: keep page metadata, OpenGraph, JSON-LD (TouristTrip/Product) and the sitemap
  in step with routes and content fields.
- Forms keep state in `useState` and submit to `public/forms/<slug>/submit` (slugs are form
  definitions created in the admin panel's Forms page).
- Visual style: the Rope4 forest-green theme (Tailwind tokens in `tailwind.config.ts` /
  `app/globals.css`), framer-motion for motion, lucide-react icons. Reuse existing sections and
  components before adding new ones; check mobile layout for every UI change.
- Style: Prettier with double quotes (`.prettierrc`).
