# ⚡ NovaShop — Enterprise eCommerce + Stripe Integration

A full-stack, production-ready eCommerce platform with Stripe payment integration built with **Next.js 14 App Router** and TypeScript.

![NovaShop Preview](https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&q=80)

---

## 🚀 Quick Start

### 1. Install dependencies (already done)
```bash
npm install
```

### 2. Add your Stripe API keys

Copy the example env file and fill in your keys:
```bash
cp .env.local.example .env.local
```

Get your **test** API keys from: https://dashboard.stripe.com/test/apikeys

```env
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET
```

### 3. Start the dev server
```bash
npm run dev
```

Open **http://localhost:3000** 🎉

---

## 💳 Testing Payments

Use these **Stripe test cards** in checkout:

| Card | Number | Result |
|------|--------|--------|
| ✅ Success | `4242 4242 4242 4242` | Payment succeeds |
| 🔐 3D Secure | `4000 0027 6000 3184` | 3DS authentication flow |
| ❌ Decline | `4000 0000 0000 0002` | Payment declined |
| 💳 Insufficient funds | `4000 0000 0000 9995` | Insufficient funds decline |

> Use **any future expiry date**, **any 3-digit CVC**, and **any ZIP code**.

---

## 🔗 Stripe Webhooks (Local Testing)

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli), then run:

```bash
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The CLI will print your webhook signing secret — add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`.

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Homepage (hero + catalog)
│   ├── products/[id]/page.tsx    # Product detail
│   ├── checkout/page.tsx         # Stripe checkout
│   ├── order-confirmation/page.tsx
│   ├── orders/page.tsx           # Order history
│   └── api/
│       ├── create-payment-intent/route.ts  # Payment creation
│       ├── webhooks/stripe/route.ts        # Webhook handler
│       └── products/route.ts               # Products API
├── components/
│   ├── layout/ (Navbar, CartDrawer)
│   ├── products/ (ProductCard)
│   ├── checkout/ (CheckoutForm)
│   └── ui/ (ToastContainer)
├── context/
│   ├── CartContext.tsx   # Cart state + localStorage persistence
│   └── ToastContext.tsx  # Toast notifications
├── lib/
│   ├── stripe.ts      # Stripe client + server instances
│   ├── products.ts    # Mock product catalog (12 products)
│   ├── orders.ts      # In-memory order store
│   └── validators.ts  # Zod schemas
├── types/index.ts     # Full TypeScript definitions
└── styles/
    ├── globals.css     # Design system tokens
    ├── animations.css  # Keyframe animations
    └── components.css  # Reusable component classes
```

---

## 🏗️ Enterprise Features

| Feature | Implementation |
|---------|---------------|
| **Server-side pricing** | Prices calculated on server, never trusted from client |
| **Idempotency keys** | Prevents duplicate charges on retries |
| **Webhook signature verification** | `stripe.webhooks.constructEvent()` |
| **Order state machine** | Valid status transitions enforced |
| **3DS / SCA support** | Automatic via `confirmPayment()` |
| **Type safety** | Full TypeScript throughout |
| **Input validation** | Zod schemas on all API routes |
| **Cart persistence** | localStorage with useReducer |
| **Rate-limit safe** | Idempotency key per cart hash + minute window |

---

## 🎨 UI Features

- Premium dark glassmorphism design
- Responsive mobile-first layout
- Animated product cards with hover effects
- Slide-in cart drawer
- Multi-step checkout (Shipping → Payment → Review)
- Real-time toast notifications
- Loading skeletons and spinners
- Order status badges with state machine

---

## 📦 Production Checklist

- [ ] Replace placeholder Stripe keys with live keys
- [ ] Replace in-memory order store with a real database
- [ ] Add authentication (NextAuth.js recommended)
- [ ] Configure production webhook endpoint in Stripe Dashboard
- [ ] Enable Stripe Radar for fraud detection
- [ ] Add email notifications (Resend / SendGrid)
- [ ] Set up proper inventory management
- [ ] Add product images to a CDN

---

## 📦 Production Deployment (Vercel)

The app is fully ready for deployment on [Vercel](https://vercel.com). It has been upgraded to use **Prisma ORM** for real database persistence instead of an in-memory store.

### 1. Database Setup
The codebase currently uses SQLite for easy local development. For Vercel, you need a Postgres database (like Vercel Postgres or Supabase).
1. Change the `provider` in `prisma/schema.prisma` from `"sqlite"` to `"postgresql"`.
2. Add your `DATABASE_URL` to your Vercel Environment Variables.

### 2. Stripe Configuration
1. Go to the Stripe Dashboard and get your **Live Mode** keys.
2. Add the live keys to your Vercel Environment Variables:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. After deployment, register your Vercel URL in the Stripe Webhooks Dashboard (e.g. `https://your-domain.com/api/webhooks/stripe`).
4. Add the resulting live `STRIPE_WEBHOOK_SECRET` to your Vercel Environment Variables.

### 3. Deploying
1. Push your code to GitHub/GitLab.
2. Import the project in Vercel.
3. In Vercel's Build Settings, set the Install Command to:
   `npm install && npx prisma generate && npx prisma migrate deploy`
4. Click Deploy!

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Payments**: Stripe.js + @stripe/react-stripe-js
- **Validation**: Zod
- **Styling**: Vanilla CSS with design tokens
- **State**: React Context + useReducer
- **Font**: Inter + Space Grotesk (Google Fonts)
