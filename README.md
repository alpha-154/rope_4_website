# Rope4 Customer Website

Customer-facing Next.js website for Rope4 Outdoor Education & Adventure Platform.

## Tech Stack
- **Framework**: Next.js 14 (App Router) + TypeScript Strict
- **Theme**: Rope4 Nature Forest Green (`#1B4D3E` & `#2E7D32`) on White
- **Styling**: Tailwind CSS + Shadcn UI primitives + Lucide Icons
- **Server State**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod
- **Animations**: Framer Motion

## Getting Started

### 1. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default variables:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
NEXT_PUBLIC_ORGANIZATION_ID=default-org-id
```

### 2. Run Commands
```bash
# Install dependencies
npm install

# Start development server on port 3000
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

