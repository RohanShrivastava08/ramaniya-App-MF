# 📖 Ramaniya — Complete Project Explanation
> Written for a beginner learning modern full-stack web development.
> Every file, every technology, and every concept explained in plain English.

---

## 🗂️ What is Ramaniya?

**Ramaniya** is a **Mutual Fund Investment Platform** similar to Groww.in or Zerodha Coin.

Users can:
- Create an account and log in securely
- Complete a simulated KYC (Know Your Customer) verification
- Browse real Indian mutual funds with live pricing
- Invest using a simulated payment gateway (mock Razorpay)
- Track their personal portfolio on a dashboard
- Read financial news

It is **full-stack** — the frontend (what you see), backend (server logic), and database (data storage) all live in **one single project folder**. That is the power of Nuxt 4.

---

## 🏗️ Tech Stack — Every Technology Used

| Technology | Version | Category | Purpose |
|---|---|---|---|
| **Nuxt 4** | 4.4.2 | Framework | Combines frontend + backend in one project |
| **Vue 3** | 3.5.31 | UI Library | Builds all interactive components and pages |
| **TypeScript** | 6.0 | Language | Adds type safety — catches errors before you run code |
| **Tailwind CSS** | 3 | Styling | Utility-first CSS — style by adding class names to HTML |
| **Prisma** | 5.22 | Database ORM | Type-safe way to talk to PostgreSQL from TypeScript |
| **PostgreSQL 16** | via Docker | Database | Stores users, passwords, investments permanently |
| **Docker** | latest | Container | Runs PostgreSQL on your Mac without installing it globally |
| **BCrypt** | 3.0 | Security | Hashes passwords — makes them unreadable even if DB is leaked |
| **H3 Sessions** | built-in | Auth | Nuxt's session system — encrypted cookies for login state |
| **ApexCharts** | 5.10 | Charts | Draws historical NAV price graphs |
| **pnpm** | 10.33 | Package Manager | Installs and manages all libraries (faster than npm) |
| **mfapi.in** | public | External API | Free source of real Indian mutual fund NAV data |

---

## 📁 Current Project File Structure

Every file that exists in the project right now:

```
ramaniya-App-MF/
│
├── .env                              ← Secret passwords and keys (never share this)
├── .gitignore                        ← Files Git should not track
├── README.md                         ← Quick start guide
├── explanation.md                    ← This file
├── nuxt.config.ts                    ← Nuxt master settings
├── tailwind.config.js                ← Custom colours and fonts
├── tsconfig.json                     ← TypeScript compiler settings
├── package.json                      ← All libraries + scripts listed here
├── docker-compose.yml                ← Defines PostgreSQL and Redis containers
│
├── prisma/
│   └── schema.prisma                 ← Database table definitions
│
├── public/                           ← Files served directly (no processing)
│   ├── favicon.ico                   ← The browser tab icon
│   ├── hero.png                      ← Hero section image
│   └── robots.txt                    ← Search engine instructions
│
├── server/                           ← BACKEND — runs on server only, never in browser
│   ├── utils/
│   │   └── prisma.ts                 ← Shared database connection
│   └── api/
│       ├── auth/
│       │   ├── register.post.ts      ← POST /api/auth/register
│       │   ├── login.post.ts         ← POST /api/auth/login
│       │   ├── me.get.ts             ← GET  /api/auth/me
│       │   └── logout.post.ts        ← POST /api/auth/logout
│       └── transactions/
│           ├── index.get.ts          ← GET    /api/transactions
│           ├── index.post.ts         ← POST   /api/transactions
│           └── [id].delete.ts        ← DELETE /api/transactions/:id
│
└── app/                              ← FRONTEND — runs in the browser
    ├── app.vue                       ← Root entry point
    ├── assets/css/
    │   └── main.css                  ← Global styles + Tailwind setup
    ├── composables/
    │   ├── useUser.ts                ← Global "who is logged in" state
    │   └── useAuthModal.ts           ← Global modal open/close toggle
    ├── layouts/
    │   └── default.vue               ← Navbar + Footer wrapper for all pages
    ├── pages/
    │   ├── index.vue                 ← /  (Landing Page)
    │   ├── onboarding.vue            ← /onboarding  (KYC)
    │   ├── dashboard.vue             ← /dashboard  (Portfolio)
    │   ├── funds.vue                 ← /funds  (Browse Funds)
    │   ├── news.vue                  ← /news  (News Feed)
    │   └── invest/
    │       └── [id].vue              ← /invest/:id  (Fund Detail + Invest)
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.vue
    │   │   ├── Footer.vue
    │   │   └── Section.vue
    │   ├── sections/                 ← Landing page sections
    │   │   ├── Hero.vue
    │   │   ├── Features.vue
    │   │   ├── HowItWorks.vue
    │   │   ├── FundCategories.vue
    │   │   ├── AppPreview.vue
    │   │   ├── Trust.vue
    │   │   └── CTASection.vue
    │   └── ui/                       ← Reusable building blocks
    │       ├── Button.vue
    │       ├── Card.vue
    │       ├── AuthModal.vue
    │       └── MockRazorpay.vue
    ├── lib/
    │   ├── mockData.ts               ← 17 hardcoded sample funds
    │   └── liveData.ts               ← Live fund data from mfapi.in
    └── utils/
        └── cn.ts                     ← Tailwind class merge helper
```

---

## 🔍 Technology → File Mapping
> **This section answers: "Where exactly is each technology used, and why?"**

---

### 🐳 Docker

**What it is:** Docker runs software inside isolated "containers" — think of them as mini computers inside your Mac. You do not install PostgreSQL directly on your Mac. Instead Docker runs it in a sealed box.

**Why use it?** Without Docker, every developer on a project needs to manually install and configure PostgreSQL. With Docker, one file defines everything — one command starts it, one command stops it.

**Exactly where it is used:**

| File | How Docker is involved |
|---|---|
| `docker-compose.yml` | **Defines** both containers: PostgreSQL (port 5432) and Redis (port 6379). This is the only Docker config file. |
| `.env` | The `DATABASE_URL` points to the PostgreSQL container: `postgresql://ramaniya_user:ramaniya_password@localhost:5432/ramaniya_db` |
| `server/utils/prisma.ts` | Prisma reads `DATABASE_URL` from `.env` and connects to the PostgreSQL container |

**What runs inside Docker right now:**
```
Docker Container: ramaniya-postgres  →  PostgreSQL 16  →  stores your User and Transaction tables
Docker Container: ramaniya-redis     →  Redis 7         →  cache (reserved for future features)
```

**Commands you need:**
```bash
docker compose up -d      # Start both containers
docker compose down       # Stop both containers
docker ps                 # Check which containers are running
```

> **Key fact:** If Docker is stopped, the app cannot save or verify users. Always keep it running during development.

---

### 🗄️ PostgreSQL

**What it is:** A powerful, professional database — like an extremely capable Excel spreadsheet that stores millions of rows, handles multiple users at once, and never loses data.

**Why use it?** The previous version of this project (now deleted) used a plain JavaScript array to store users — meaning all data was lost every time the server restarted. PostgreSQL stores data permanently on disk.

**Where it is used:**

| File | Role |
|---|---|
| `docker-compose.yml` | Defines the database: name `ramaniya_db`, user `ramaniya_user`, password `ramaniya_password` |
| `.env` | `DATABASE_URL` is the connection string Prisma uses |
| `prisma/schema.prisma` | Defines the table structure (User, Session, Transaction) |
| `server/utils/prisma.ts` | Opens and maintains the connection to PostgreSQL |
| All `server/api/**/*.ts` | Every API file reads/writes to PostgreSQL via Prisma |

**What is stored in PostgreSQL:**
```
Database: ramaniya_db
  ├── Table: User         → id, email, passwordHash, name, kycStatus, createdAt
  ├── Table: Session      → id, userId, token, expiresAt
  └── Table: Transaction  → id, userId, fundId, amount, type, status, createdAt
```

> **How to see it visually:**  Run `pnpm prisma studio` → opens at http://localhost:5555

---

### 🔷 Prisma

**What it is:** Prisma is an ORM (Object-Relational Mapper). Instead of writing raw SQL queries like `SELECT * FROM "User" WHERE email = 'x'`, you write readable TypeScript like `prisma.user.findUnique({ where: { email: 'x' } })`. Prisma converts that TypeScript into the correct SQL automatically.

**Why use it?** It gives you full TypeScript type safety on database queries — if you make a typo in a column name, TypeScript catches it before you even run the code.

**Exactly where it is used:**

| File | What Prisma does there |
|---|---|
| `prisma/schema.prisma` | **Blueprint** — defines all three tables (User, Session, Transaction) and their columns |
| `server/utils/prisma.ts` | **Creates the connection** — one `PrismaClient` instance shared across all API routes |
| `server/api/auth/register.post.ts` | `prisma.user.findUnique()` — checks if email already exists; `prisma.user.create()` — saves new user |
| `server/api/auth/login.post.ts` | `prisma.user.findUnique()` — finds user by email to verify password |
| `server/api/transactions/index.post.ts` | `prisma.transaction.create()` — saves a new investment |
| `server/api/transactions/index.get.ts` | `prisma.transaction.findMany()` — fetches all investments for the logged-in user |
| `server/api/transactions/[id].delete.ts` | `prisma.transaction.findUnique()` + `prisma.transaction.delete()` — validates ownership then deletes |

**Key commands:**
```bash
pnpm prisma generate     # Generates TypeScript types from schema (run after schema changes)
pnpm prisma db push      # Creates/updates actual tables in PostgreSQL to match schema
pnpm prisma studio       # Opens visual database browser at http://localhost:5555
```

**How the singleton pattern works in `server/utils/prisma.ts`:**
```typescript
// globalThis is a Node.js global object that persists between hot-reloads
export const prisma = globalThis.__prisma ?? new PrismaClient()

// In dev mode, save it to globalThis so next hot-reload reuses it
// Without this, every file save would create a new DB connection
if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma
}
```

> **Nitro auto-import:** Because `prisma.ts` is in `server/utils/`, Nuxt automatically makes the `prisma` variable available in ALL `server/api/` files. No import statement needed!

---

### 🔐 BCrypt

**What it is:** A one-way hashing algorithm specifically designed for passwords. "One-way" means you can turn a password INTO a hash, but you can NEVER turn the hash back into the original password.

**Why use it?** If your database is ever hacked, the attacker sees `$2b$10$l8d.dyO...` instead of `Ramaniya@123`. BCrypt is intentionally slow (takes ~100ms) to make brute-force attacks impractical.

**Exactly where it is used:**

| File | What BCrypt does there |
|---|---|
| `server/api/auth/register.post.ts` | `bcrypt.genSalt(10)` + `bcrypt.hash(password, salt)` — converts the plain password to a hash before saving to PostgreSQL |
| `server/api/auth/login.post.ts` | `bcrypt.compare(submittedPassword, storedHash)` — verifies login without ever knowing the real password |

**What is stored in your database right now:**
```
Real password:   Ramaniya@123
Stored in DB:    $2b$10$l8d.dyOai6iQwSrhb4KWjeCgI82XnC0kywLQOv0R3YVDT4iIK88g.
```
The stored hash cannot be reversed. BCrypt re-hashes the submitted password and compares the results instead.

---

### 🍪 H3 Sessions (Nuxt's Session System)

**What it is:** H3 is Nuxt's underlying HTTP server library. Its `useSession()` function creates encrypted session cookies — a way for the server to remember "who is logged in" between requests.

**Why use it?** HTTP is stateless — every request to the server is independent. Sessions solve this: after login, the server gives the browser an encrypted cookie. The browser sends this cookie with every future request, and the server reads it to know who you are.

**Exactly where it is used:**

| File | What sessions do there |
|---|---|
| `server/api/auth/register.post.ts` | `session.update({ userId, name, email })` — creates session after successful registration |
| `server/api/auth/login.post.ts` | `session.update({ userId, name, email })` — creates session after successful login |
| `server/api/auth/me.get.ts` | `session.data.userId` — reads the session to check if someone is logged in |
| `server/api/auth/logout.post.ts` | `session.clear()` — destroys the session (logs the user out) |
| `server/api/transactions/index.post.ts` | `session.data.userId` — gets current user's ID to link transactions |
| `server/api/transactions/index.get.ts` | `session.data.userId` — only fetches THIS user's transactions |
| `server/api/transactions/[id].delete.ts` | `session.data.userId` — verifies the user owns the transaction before deleting |
| `nuxt.config.ts` | `runtimeConfig.session.password` — the encryption key (SESSION_SECRET from `.env`) |
| `.env` | `SESSION_SECRET` — the 32+ character secret used to encrypt/decrypt cookies |

**How it works step by step:**
```
1. User logs in → server creates session → browser receives encrypted cookie
2. Browser stores cookie automatically (httpOnly = JS cannot read it = secure)
3. Next page load → browser sends cookie → server decrypts it → reads userId
4. Server fetches data for that userId → returns personalised response
5. User logs out → session.clear() → cookie deleted → user is forgotten
```

---

### 📊 ApexCharts (vue3-apexcharts)

**What it is:** A JavaScript charting library that draws interactive graphs, lines, bars, and pie charts in the browser.

**Why use it?** The fund detail page needs to show a historical NAV (price) graph. ApexCharts makes this easy with just a few lines of configuration.

**Exactly where it is used:**

| File | What ApexCharts does there |
|---|---|
| `app/pages/invest/[id].vue` | Draws the historical NAV line chart for the selected fund |
| `nuxt.config.ts` | `build.transpile: ['vue3-apexcharts']` — needed so Nuxt can render it server-side |
| `package.json` | `"apexcharts"` and `"vue3-apexcharts"` listed as dependencies |

**How the chart works:**
```typescript
// The chart just needs an array of numbers (NAV values) and labels (months)
const chartSeries = [{ name: 'NAV', data: [73.1, 76.4, 74.8, 79.2, 78.5, 81.0] }]
const chartOptions = {
  chart: { type: 'line' },
  xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] }
}
// ApexCharts handles all the drawing automatically
```

---

### 🌐 mfapi.in (External Mutual Fund API)

**What it is:** A free public REST API that provides real, daily-updated NAV (Net Asset Value) data for all SEBI-registered Indian mutual funds.

**Why use it?** To show real fund data — actual prices, real historical performance — instead of made-up numbers.

**Exactly where it is used:**

| File | What mfapi.in does there |
|---|---|
| `app/lib/liveData.ts` | `fetch('https://api.mfapi.in/mf/122639')` — fetches live NAV data for 6 real funds |
| `app/lib/mockData.ts` | 17 hardcoded funds used as fallback when the API is unavailable |
| `app/pages/funds.vue` | Calls `fetchLiveFunds()` on page load → displays combined live + mock catalog |

**What a response from the API looks like:**
```json
{
  "meta": { "scheme_name": "Parag Parikh Flexi Cap Fund - Direct Plan - Growth" },
  "data": [
    { "date": "31-03-2025", "nav": "74.25" },
    { "date": "28-03-2025", "nav": "73.80" }
  ]
}
```
We take this and calculate the CAGR (annual return %) from it, build the chart data, and display it.

---

### 🎨 Tailwind CSS

**What it is:** A CSS framework where instead of writing a `.css` file, you add pre-built utility class names directly on your HTML elements.

**Why use it?** Much faster to style. Instead of writing `button { background: green; padding: 8px 16px; border-radius: 8px; }` in a CSS file, you just write `class="bg-green-600 px-4 py-2 rounded-xl"` on the element itself.

**Exactly where it is used:**

| File | Role |
|---|---|
| `tailwind.config.js` | **Defines custom colours** (`fintech-green`, `fintech-blue`) and fonts (`Inter`) that work as Tailwind class names |
| `app/assets/css/main.css` | Contains `@tailwind base/components/utilities` — these inject all Tailwind's CSS into the app |
| `nuxt.config.ts` | `modules: ['@nuxtjs/tailwindcss']` — registers Tailwind as a Nuxt module |
| `package.json` | `"@nuxtjs/tailwindcss"` listed in devDependencies |
| **Every `.vue` file** | Uses Tailwind class names in `class="..."` attributes throughout |

**Example — how Tailwind classes work:**
```html
<!-- Without Tailwind: you'd write separate CSS -->
<button class="my-button">Click</button>

<!-- With Tailwind: styling is right there on the element -->
<button class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
  Click
</button>
```

---

### ⚡ Nuxt 4 + Nitro (The Framework)

**What it is:** Nuxt is a framework built on top of Vue. The `server/` folder runs on **Nitro** — Nuxt's built-in backend server engine. This means your frontend and backend are one unified project.

**Why use it?** Eliminates the need for a separate Express/Node server. Nuxt handles both the Vue pages AND the API routes.

**Exactly where Nuxt is configured:**

| File | Role |
|---|---|
| `nuxt.config.ts` | Master config — modules, Prisma externals, session secret, transpile settings |
| `package.json` | `"nuxt": "^4.4.2"` as main dependency; scripts: `dev`, `build`, `preview` |
| `tsconfig.json` | Extends Nuxt's TypeScript config (`.nuxt/tsconfig.json`) |
| `app/app.vue` | Root Vue component — wraps the layout system |
| All `app/pages/**` | Nuxt auto-generates routes from these filenames (e.g., `funds.vue` → `/funds`) |
| All `server/api/**` | Nitro turns filenames into API endpoints (e.g., `login.post.ts` → `POST /api/auth/login`) |
| All `app/composables/**` | Nuxt auto-imports these — use `useUser()` anywhere without importing |

**File-name conventions in Nuxt:**
```
app/pages/funds.vue               → localhost:3000/funds
app/pages/invest/[id].vue         → localhost:3000/invest/anything  (dynamic)
server/api/auth/register.post.ts  → POST   http://localhost:3000/api/auth/register
server/api/auth/me.get.ts         → GET    http://localhost:3000/api/auth/me
server/api/transactions/index.get.ts   → GET    /api/transactions
server/api/transactions/[id].delete.ts → DELETE /api/transactions/:id
```

---

### 🖊️ Vue 3 (The UI Library)

**What it is:** Vue 3 is what you use to build the user interface — buttons, forms, pages, animations. It uses a reactive system: when data changes, the screen automatically updates without you manually touching the DOM.

**Exactly where Vue concepts appear:**

| Vue Concept | Where it is used | What it does |
|---|---|---|
| `ref()` | Every `.vue` file | Creates a reactive variable (changes trigger UI update) |
| `computed()` | `dashboard.vue`, `invest/[id].vue` | Auto-recalculates when its dependencies change |
| `onMounted()` | `dashboard.vue`, `funds.vue`, `default.vue` | Runs code after the component appears on screen |
| `watch()` | `AuthModal.vue` | Runs code when a specific variable changes |
| `v-if` / `v-show` | All `.vue` files | Conditionally shows/hides elements |
| `v-for` | `dashboard.vue`, `funds.vue` | Loops over arrays to render lists |
| `v-model` | `AuthModal.vue`, `invest/[id].vue` | Two-way binding between input and variable |
| `@click` / `@submit` | All `.vue` files | Listens for user events |
| `:prop` (v-bind) | All component usage | Passes data from parent to child component |
| `emit` | `AuthModal.vue`, `MockRazorpay.vue` | Child tells parent something happened |
| `<Teleport>` | `AuthModal.vue`, `MockRazorpay.vue` | Moves HTML to `<body>` so modals don't get clipped |
| `<Transition>` | `default.vue` | Adds CSS transitions to elements entering/leaving |

---

### 🔑 TypeScript

**What it is:** TypeScript is JavaScript with types. You declare what type a variable is (string, number, object with specific keys) and the editor catches mistakes before you run the code.

**Exactly where TypeScript helps in this project:**

| File | TypeScript usage |
|---|---|
| `server/utils/prisma.ts` | `prisma: PrismaClient` — typed database client |
| All `server/api/**` | `readBody<{email: string, password: string}>(event)` — typed request bodies |
| `app/composables/useUser.ts` | `useState<any>('user', ...)` — typed global state |
| `app/pages/invest/[id].vue` | Fund object type — TypeScript warns if you access a property that doesn't exist |
| `tsconfig.json` | `strict: true` — enables maximum type checking |

---

## 🔄 How a Full User Journey Works (Code Level)

```
1. Visit localhost:3000
   Code: default.vue onMounted() → useFetchUser() → GET /api/auth/me
   Server: me.get.ts reads session cookie → no session → returns 401
   Result: user = null → Navbar shows "Login" button

2. Click "Get Started" → AuthModal opens
   Code: isAuthOpen.value = true (useAuthModal composable)

3. Fill Name + Email + Password → Click "Create Account"
   Code: AuthModal.vue handleSubmit() → $fetch('POST /api/auth/register')
   Server: register.post.ts
     → prisma.user.findUnique() — checks email not taken
     → bcrypt.hash(password) — hashes the password
     → prisma.user.create() — saves to PostgreSQL
     → useSession().update({ userId }) — creates encrypted cookie
   Result: Cookie stored in browser → redirected to /onboarding

4. Complete Onboarding (PAN + Camera)
   Code: onboarding.vue → navigator.mediaDevices.getUserMedia()
   Result: localStorage 'ramaniya_kyc' = true → router.push('/dashboard')

5. Visit /funds
   Code: funds.vue onMounted() → fetchLiveFunds()
     → fetch('https://api.mfapi.in/mf/122639') ×6 funds
     → merge with MOCK_FUNDS from mockData.ts (17 funds)
   Result: 23 fund cards displayed

6. Click "Invest Now" → /invest/live1
   Code: invest/[id].vue → getFundDB() reads from localStorage cache
     → ApexCharts renders NAV history graph
     → computed() recalculates returns as user types amount/years

7. Click "Confirm & Invest" → MockRazorpay opens → simulate payment
   Code: MockRazorpay.vue → 2.5s timeout → emit('success')
   Code: invest/[id].vue handlePaymentSuccess()
     → $fetch('POST /api/transactions', { fundId, amount, type })
   Server: index.post.ts
     → useSession() verifies user is logged in
     → prisma.transaction.create() saves to PostgreSQL

8. Visit /dashboard
   Code: dashboard.vue onMounted() → $fetch('GET /api/transactions')
   Server: index.get.ts
     → useSession() gets userId from cookie
     → prisma.transaction.findMany({ where: { userId } })
   Result: Portfolio data displayed, computed() calculates returns live
```

---

## 🚀 How to Run the Project

```bash
# Step 1: Start Docker containers (PostgreSQL + Redis)
docker compose up -d

# Step 2: Install all libraries from package.json
pnpm install

# Step 3: Generate Prisma TypeScript client from schema
pnpm prisma generate

# Step 4: Create database tables from schema.prisma
pnpm prisma db push

# Step 5: Start the development server
pnpm run dev
```

Open **http://localhost:3000** ✅

### Other Commands

```bash
pnpm prisma studio    # Visual database browser at http://localhost:5555
docker ps             # Check Docker containers are running
docker compose down   # Stop Docker containers
pnpm run build        # Production build
```

---

## 🔒 Security Summary

| Threat | Protection | Which files |
|---|---|---|
| Password breach | BCrypt hashing | `register.post.ts`, `login.post.ts` |
| Fake session cookies | H3 encrypted cookies with SESSION_SECRET | All `server/api/**` files |
| Accessing another user's data | Server checks userId ownership | `me.get.ts`, `index.get.ts`, `[id].delete.ts` |
| Unauthenticated API calls | Returns 401 if no session | All transaction routes |
| XSS attacks | Vue auto-escapes all `{{ }}` output | All `.vue` files |
| Invalid amounts | Min ₹500, Max ₹1 crore validation | `invest/[id].vue` |
| Secrets in code | All secrets in `.env`, never hardcoded | `.env`, `nuxt.config.ts` |

---

## 📌 Quick Reference — What Does Each File Do?

| File | One-line job |
|---|---|
| `.env` | Stores secrets: DB password, session encryption key |
| `nuxt.config.ts` | Master Nuxt settings: modules, session config, Prisma + ApexCharts workarounds |
| `docker-compose.yml` | Defines PostgreSQL and Redis Docker containers |
| `tailwind.config.js` | Custom Tailwind colours (fintech-green, fintech-blue) and font |
| `prisma/schema.prisma` | Defines User, Session, Transaction database tables |
| `server/utils/prisma.ts` | One shared Prisma database connection for all API routes |
| `server/api/auth/register.post.ts` | Hash password → save user → create session |
| `server/api/auth/login.post.ts` | Verify password hash → create session |
| `server/api/auth/me.get.ts` | Read session cookie → return logged-in user |
| `server/api/auth/logout.post.ts` | Clear session cookie |
| `server/api/transactions/index.post.ts` | Save new investment to DB |
| `server/api/transactions/index.get.ts` | Fetch all investments for current user |
| `server/api/transactions/[id].delete.ts` | Verify ownership → delete investment |
| `app/composables/useUser.ts` | Global `user` state shared across all pages |
| `app/composables/useAuthModal.ts` | Global modal open/close toggle |
| `app/layouts/default.vue` | Navbar + Footer + Toast + AuthModal wrapper for every page |
| `app/pages/index.vue` | Landing page — assembles Hero, Features, etc. section components |
| `app/pages/onboarding.vue` | KYC: PAN validation + camera access |
| `app/pages/dashboard.vue` | Fetch + display portfolio; withdraw investments |
| `app/pages/funds.vue` | Fetch + display fund catalog with category filters |
| `app/pages/invest/[id].vue` | Fund detail: ApexCharts graph + SIP/Lumpsum calculator + MockRazorpay |
| `app/pages/news.vue` | Financial news from Marketaux API with mock fallback |
| `app/components/ui/AuthModal.vue` | Login + Register popup with inline error banner |
| `app/components/ui/MockRazorpay.vue` | Simulated Razorpay payment gateway UI |
| `app/lib/liveData.ts` | Fetches 6 real funds from mfapi.in + calculates CAGR |
| `app/lib/mockData.ts` | 17 hardcoded sample Indian mutual funds (fallback data) |
| `app/utils/cn.ts` | Merges Tailwind class names cleanly without conflicts |
| `public/hero.png` | Hero section image |
