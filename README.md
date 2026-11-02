# Megh Foods — E-Commerce & B2B Export Platform

Production-ready, custom-designed e-commerce + B2B export website and self-service admin panel for **Megh Foods** (brand of Megh Overseas Pvt. Ltd., Ahmedabad, Gujarat, India), an exporter of traditional Indian groceries: flours, millet & vrat flours, sabudana, poha, rice, fryums, snacks, makhana, jaggery, salt, chikki, laddu, and pooja kits.

---

## 1. System Architecture & Tech Stack

- **Framework:** Next.js 15+ (App Router, Server Components by default, Strict TypeScript)
- **Styling & UI:** Tailwind CSS, Radix UI (`@radix-ui/*`), `lucide-react`, `sonner` (toasts)
- **Database & Storage:** Supabase (PostgreSQL, Row Level Security, Auth, Storage bucket `product-images`)
- **Payments:** Razorpay (`razorpay` server SDK + client-side Checkout modal; International cards enabled in USD, Domestic cards/UPI in INR)
- **Email Delivery:** Resend (`resend`) with automated order confirmation, courier tracking alerts, and owner notifications
- **Client Search & State:** `fuse.js` for instant fuzz-filtered product catalog, `zustand` for persistent multi-currency cart
- **Client Image Optimization:** `browser-image-compression` (converts uploads to `.webp` before transmission)
- **Hosting & Infrastructure:** Vercel (Edge Middleware, Serverless Functions, Incremental Static Regeneration) + Supabase Cloud

---

## 2. Directory Structure

```
├── app/
│   ├── (site)/                  # Public Storefront Route Group
│   │   ├── page.tsx             # Homepage (Hero, Brand Story, Categories, Featured Products)
│   │   ├── products/            # Catalog with Fuse.js instant search & filters
│   │   ├── products/[slug]/     # Product Detail Page (PDP) with pack size switcher
│   │   ├── category/[slug]/     # Category-specific catalog view
│   │   ├── wholesale-export/    # B2B Container & Distributor Inquiry Page
│   │   ├── cart/                # Shopping Cart view
│   │   ├── checkout/            # Secure Checkout with live shipping rate calculation
│   │   ├── order/[orderNumber]/ # Guest Order Status Tracking (secured with access_token)
│   │   ├── about/               # About Us & Milling Standards
│   │   ├── contact/             # Contact Desk & Corporate Details
│   │   ├── shipping-returns/    # Shipping & Refund Policies
│   │   ├── privacy/             # Privacy Policy
│   │   └── terms/               # Terms of Service
│   ├── admin/                   # Protected Admin Portal (`/admin/*`)
│   │   ├── login/               # Owner Authentication
│   │   ├── products/            # Product Catalogue, Variant & Pricing Editor
│   │   ├── categories/          # Category Taxonomy Manager
│   │   ├── orders/              # Orders Management & Courier Tracking Dispatch
│   │   ├── inquiries/           # B2B Export Leads & CSV Export
│   │   └── shipping/            # Regional Shipping Rates & Free Shipping Thresholds
│   ├── api/
│   │   ├── checkout/create-order/ # Server-side total recalculation & Razorpay order generation
│   │   ├── checkout/verify/     # HMAC signature verification & payment capture
│   │   ├── webhooks/razorpay/   # Webhook handler for asynchronous payment & refund events
│   │   └── geo/                 # IP-based currency detection
│   ├── layout.tsx               # Root Layout with Montserrat font & Toaster
│   ├── sitemap.ts               # Dynamic XML sitemap generator
│   └── robots.ts                # Search crawler instructions
├── components/
│   ├── admin/                   # Admin UI Components (ProductForm, VariantsEditor, ImageUploader, etc.)
│   ├── catalog/                 # FilterPanel, SearchBar, SortSelect, CatalogClient
│   ├── site/                    # Header, Footer, CartDrawer, CurrencySwitcher, ProductCard, etc.)
│   └── ui/                      # Base Design System Components (shadcn/ui)
├── lib/
│   ├── config.ts                # Site configuration, contact details, order thresholds
│   ├── pricing.ts               # Multi-currency formatting, unit price calculator
│   ├── orders.ts                # Order status transition & automated email dispatch
│   ├── email.ts                 # Resend email templates (Order Confirmation, Tracking, Owner Alert)
│   ├── razorpay-client.ts       # Razorpay client checkout script loader
│   ├── seo.ts                   # Metadata generators & OpenGraph builders
│   ├── validation/product.ts    # Zod schemas for products and variants
│   └── supabase/                # Supabase SSR, public, and service-role admin clients
├── middleware.ts                # Route guard protecting `/admin/*` via Supabase Auth
└── supabase/migrations/
    └── 001_init.sql             # Full database schema, RLS, functions, and seed data
```

---

## 3. Local Development Setup

### Prerequisites
- Node.js 18.17+ or 20+
- npm or pnpm

### Step 1: Clone and Install
```bash
git clone <repository-url> megh-foods
cd megh-foods
npm install
```

### Step 2: Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Populate the required environment variables:
```ini
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase (obtain from Supabase Dashboard > Project Settings > API)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Razorpay (obtain from Razorpay Dashboard > Settings > API Keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

# Resend (obtain from resend.com/api-keys)
RESEND_API_KEY=re_...
EMAIL_FROM=orders@yourverifieddomain.com
OWNER_NOTIFY_EMAIL=owner@meghfoods.com

# WhatsApp Business number (international format with country code)
NEXT_PUBLIC_WHATSAPP_NUMBER=+919876543210
```

### Step 3: Database Migration
1. Log into your Supabase Dashboard at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase project.
3. Paste and run the entire contents of `supabase/migrations/001_init.sql`.
4. This creates all tables, triggers, Row Level Security policies, storage bucket `product-images`, and seed categories and shipping zones.

### Step 4: Create Admin Account
1. In the Supabase Dashboard, go to **Authentication > Users** and click **Add user > Create user**.
2. Enter the owner's email address and password.
3. In the **SQL Editor**, grant admin permissions to this email:
   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'your-admin-email@meghfoods.com';
   ```
4. Confirm admin status:
   ```sql
   select * from public.admin_users;
   ```

### Step 5: Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 4. Production Deployment Guide (Vercel + Supabase)

### Deploying to Vercel
1. Push your repository to GitHub / GitLab / Bitbucket.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New > Project** and import the repository.
3. In **Environment Variables**, add all keys defined in `.env.example`.
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain (e.g., `https://meghfoods.com`).
5. Deploy. Vercel automatically runs `npm run build` and provisions edge routing.

### Razorpay Webhook Configuration
1. Log into the [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Go to **Settings > Webhooks > Add New Webhook**.
3. **Webhook URL:** `https://your-domain.com/api/webhooks/razorpay`
4. **Secret:** Set a strong random secret and copy it into `RAZORPAY_WEBHOOK_SECRET` in Vercel.
5. **Active Events:**
   - `order.paid`
   - `payment.failed`
   - `refund.processed`
6. Click **Save**.

### International Payments (IEC & Currency Configuration)
- In the Razorpay Dashboard, navigate to **Settings > International Payments**.
- Submit your Megh Overseas Pvt. Ltd. **Import Export Code (IEC)**, GSTIN, and Authorized Dealer (AD) Code.
- Enable international credit/debit cards (Visa, MasterCard, Amex) and set settlement currency preferences.
- The platform automatically charges international carts in **USD** and domestic carts in **INR**.

### Resend Domain Verification
1. Log into [Resend](https://resend.com) and navigate to **Domains > Add Domain**.
2. Enter your custom domain (e.g., `meghfoods.com`).
3. Add the provided DKIM and SPF TXT records in your DNS provider (Cloudflare, GoDaddy, Namecheap).
4. Update `EMAIL_FROM` to `orders@meghfoods.com` (or your verified domain address).

---

## 5. Security & Verification

- **Client Price Isolation:** Prices submitted by the client during checkout are strictly ignored. The server re-fetches product variants directly from Supabase, computes line totals, adds the matching shipping zone fee, and creates the authoritative Razorpay order.
- **Access Token Guarding:** Guest order tracking links (`/order/MF-XXXX?t=...`) require the secret UUID access token issued at checkout time. Arbitrary order number probing is blocked with `404 Not Found`.
- **Admin Row Level Security:** The `is_admin()` PostgreSQL security-definer function verifies that `auth.uid()` belongs to `admin_users` before permitting updates to products, shipping rates, categories, or order records.

### Verification Commands
```bash
# Verify TypeScript strict type-checking
npx tsc --noEmit

# Verify ESLint rules
npm run lint

# Verify complete Next.js production build
npm run build
```

---

## 6. Owner Administration Guide

For detailed operational guidance on adding products, setting pack sizes, processing orders, entering courier tracking numbers, and reviewing B2B inquiries, please refer to:
👉 [**ADMIN_GUIDE.md**](./ADMIN_GUIDE.md)
