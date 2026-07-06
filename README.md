# QR Code Generator

A static QR code generator built with Next.js. Generate QR codes from URLs, add custom logos, and download in multiple formats (PNG, SVG, JPEG).

## Features

- Generate static QR codes from any URL
- Upload and overlay custom logos on QR codes
- Download in PNG, SVG, and JPEG formats
- History with search, filter, and pagination
- Dark/Light mode support
- Single-user authentication

## Tech Stack

- **Framework:** Next.js (App Router)
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Auth:** NextAuth v5
- **Storage:** Vercel Blob
- **QR Generation:** qrcode + sharp
- **Styling:** Tailwind CSS

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon free tier works)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd qr-code-generator

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database URL, NextAuth secret, and Vercel Blob token

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Start development server
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Secret for NextAuth JWT (generate with `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Your app URL (e.g., `http://localhost:3000`) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read/write token |

### Creating a User

Since there's no public signup, create a user manually:

```bash
npx prisma studio
# Open the User table and add a record with hashed password
```

Or use the seed script (create `prisma/seed.ts` if needed).

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/  # NextAuth route
│   │   ├── qr/                  # QR CRUD endpoints
│   │   └── upload/              # Logo upload endpoint
│   ├── dashboard/               # Protected pages
│   │   ├── generate/            # QR generator form
│   │   └── page.tsx             # History view
│   └── login/                   # Login page
├── components/                  # Reusable UI components
├── lib/                         # Utility functions
│   ├── auth.ts                  # NextAuth config
│   ├── blob.ts                  # Vercel Blob helper
│   ├── prisma.ts                # Prisma client
│   └── qr.ts                    # QR generation logic
└── prisma/
    └── schema.prisma            # Database schema
```

## License

MIT
