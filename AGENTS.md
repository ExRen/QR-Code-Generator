# AGENTS.md — QR Code Generator

## Project Overview
Static QR code generator built with Next.js 16 (App Router), Prisma 7, NextAuth v5, Tailwind CSS v4. Single-user app — no multi-tenant, no public signup.

## Critical: Prisma 7 + Neon Setup
This project uses Prisma 7 with the **client engine** (not the old binary engine). Key gotchas:

- **Generator**: `provider = "prisma-client"` (NOT `prisma-client-js`)
- **Output**: Generated client goes to `app/generated/prisma/` (custom path)
- **Import**: Always import from `@/app/generated/prisma/client`, NOT from `@prisma/client`
- **Adapter**: Requires `@prisma/adapter-pg` — PrismaClient constructor needs `{ adapter }` option
- **No `url` in schema**: Connection URL is in `prisma.config.ts`, not `schema.prisma`
- **Type assertion needed**: `new (PrismaClient as any)({ adapter })` due to type mismatch with adapter

## Commands
```bash
npm run dev          # Dev server (port 3000)
npm run build        # Production build + type check
npm run lint         # ESLint
npm run db:seed      # Create/update admin user
npx prisma generate  # Regenerate Prisma client after schema changes
npx prisma db push   # Push schema to database
npx prisma studio    # Visual database browser
```

## Auth Architecture
- **NextAuth v5** with Credentials provider + JWT sessions (no database sessions)
- **Middleware**: Checks session cookie directly (NOT using `auth()` from lib/auth — that would import Prisma in Edge Runtime which fails)
- **Login flow**: Uses `signIn("credentials", { redirectTo: "/dashboard" })` — NOT `redirect: false` + manual redirect (cookie timing issue)
- **SessionProvider**: Required in `components/Providers.tsx` wrapping the app in `app/layout.tsx`

## Database
- **Provider**: Neon PostgreSQL
- **Connection**: `@prisma/adapter-pg` (NOT `@prisma/adapter-neon` — that had connection parsing issues)
- **Soft delete**: QrCode uses `deletedAt` timestamp, filtered in queries
- **Seed**: `prisma/seed.ts` creates admin user (admin@example.com / password123)

## File Structure
```
lib/
  prisma.ts      # Prisma client singleton (adapter-pg)
  auth.ts        # NextAuth config (Credentials, JWT)
  qr.ts          # QR generation (qrcode library)
  blob.ts        # Vercel Blob upload helper
components/
  Providers.tsx   # SessionProvider wrapper (required)
  Navbar.tsx      # Floating nav with theme toggle
  QrForm.tsx      # QR generator form + preview
  QrPreview.tsx   # Canvas-based QR preview
  HistoryCard.tsx # QR card in grid
  QrDetailModal.tsx # Detail overlay
  ThemeToggle.tsx # Dark/light mode toggle
app/
  login/page.tsx        # Login form
  dashboard/layout.tsx  # Auth guard (server component)
  dashboard/page.tsx    # History grid (client component)
  dashboard/generate/   # QR generator page
  api/auth/[...nextauth]/ # NextAuth routes
  api/qr/               # QR CRUD endpoints
  api/qr/[id]/download/ # File download endpoint
  api/upload/           # Logo upload endpoint
```

## UI System
- **Theme**: CSS variables in `globals.css` with `.dark` class toggle
- **Colors**: Slate-based (light: #F8FAFC bg, dark: #0F172A bg), green CTA (#22C55E)
- **Fonts**: Fira Sans (body) + Fira Code (mono) via Google Fonts CDN
- **Icons**: Lucide React (no emojis)
- **Responsive**: Mobile-first, breakpoints at sm/md/lg

## Build & Deploy
- **Build**: `npm run build` runs TypeScript check + ESLint + Next.js build
- **Lint warnings**: Some warnings are expected (img vs Image, useEffect deps) — errors are the blocker
- **Edge Runtime**: Middleware must NOT import Prisma — use cookie check instead
- **Deploy target**: Vercel (needs BLOB_READ_WRITE_TOKEN for file storage)

## Common Pitfalls
1. **PrismaClient constructor error**: Must pass `{ adapter }` option with PrismaPg adapter
2. **Edge Runtime errors**: Don't import Prisma in middleware or edge-configured routes
3. **Login redirect loop**: Use `redirectTo` in signIn, not `redirect: false` + manual redirect
4. **Port conflicts**: Kill old Next.js processes with `taskkill /F /PID <pid>` before starting dev
5. **Neon connection**: Use `@prisma/adapter-pg` not `@prisma/adapter-neon` (后者有连接解析问题)
