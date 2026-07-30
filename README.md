# ⚜️ AURA — Elite Full-Stack Portfolio, CMS & Executive Operating System

**Aura** is a bespoke, ultra-premium developer portfolio, custom Content Management System (CMS), and personal Executive Operating System built for **Refayet Hossen**. Powered by **Next.js 16 (App Router)**, **MongoDB**, **Framer Motion**, and **Telegram Bot Integration**, it combines an editorial visual aesthetic with real-time financial intelligence and automated client/issue tracking.

---

## ✨ Key Features & Architecture

### 🔮 1. Multi-Layout Editorial Engine
Aura features a dynamic layout system allowing instant customization of key page sections. Each section supports **8 luxury layout variations**:
- **Selected Works (Projects):** Asymmetric Gallery, Classic Grid, Horizontal Drag Carousel, Staggered Masonry, Large List Rows, Borderless Minimal Cards, Split Parallax, and Minimal List.
- **Technical Proficiency (Skills):** Progress Bars, Glass Cards Grid, Infinite Marquee Track, Minimalist Tag Cloud, Timeline Stages, Dual-Column Table, Circular Dials, and Modern Badges.
- **Client Reviews (Testimonials):** Columns Grid, Carousel Slider, Masonry Wall, Huge Featured Quote, Split Sticky, Chat Bubbles Mockup, Gold Citation Quotes, and Infinite Ribbon.
- **Journal (Blogs):** Split Sticky Editorial, List Rows, Cards Grid, Magazine Split, Cover Story Banner, Alternate Blocks, Horizontal Strip, and Minimalist List.

---

### 💼 2. Personal Wealth & Financial Intelligence Engine (`Personal Wallet`)
A 100% dynamic, MongoDB-synced 9-tab executive financial management dashboard:
- 📊 **Monthly Ledger & Income/Expense Manager**: Tracks salary, bonuses, freelance income, and categorized expenses.
- 📈 **1st to 31st Day-by-Day Expenditure Timeline Chart**: Visual daily expenditure bar chart highlighting peak days (> ৳2,000) and no-spend days.
- 🔮 **AI Impulse Purchase & Expense Anomaly Radar**: Computes a Financial Discipline Score (100-scale) and flags high-spike outlier expenses.
- 📅 **31-Day Expense Heat-Calendar Matrix**: Color-coded monthly spending intensity map (Emerald ৳0, Indigo Low, Amber Moderate, Red Peak).
- 🎛️ **Interactive Daily Budget Simulator & EOM Projection**: Live budget slider & preset buttons projecting end-of-month savings and runway coverage.
- 🧠 **AI Category Daily Pace & Advisory**: Monitored category daily pace, budget caps, over-spending alerts, and smart advisory recommendations.
- 🛡️ **AI Living Runway & Emergency Buffer Meter**: Essential baseline overhead audit (Rent + Food + Utility) with live emergency runway months.
- 💼 **Asset Allocation Vault & Savings Allocator**: Dynamic tracking of Bank Deposits, Gadgets, Cash Reserves, and Growth Equities synced to MongoDB.
- ✉️ **Automated Daily 8:00 PM BST Digest & Telegram Push**: Automated daily email executive reports and instant Telegram Bot (`@Rifat_CC`) push notifications.

---

### 🛍️ 3. Shopify Project Issue Tracker & Automated Telegram Notifications
- **Google Sheets Integration**: Synchronizes issues directly from live Google Sheets.
- **Team Column Syntax Parser**: Auto-parses team syntaxes such as `Rakib/CW`, `Ariful/CM`, `Knight Flow/Atik` to extract Employee Name and Team (`CW`, `CM`, `CC`, `CS`).
- **Telegram Bot Push Alerts**: Sends instant Telegram notifications upon issue assignment or sheet entries.

---

### 💬 4. Live AI Chat Assistant Widget
- Embedded conversational AI chat widget.
- Allows visitors to interact with a smart AI persona representing Refayet Hossen.
- Persists chat interaction logs directly to MongoDB.

---

## 🛠️ Tech Stack

- **Core Framework:** Next.js 16 (App Router, Turbopack)
- **Database & ODM:** MongoDB & Mongoose
- **Styling:** CSS Modules (Vanilla Luxury CSS Variables)
- **Animations:** Framer Motion (Fluid drag physics & enter transitions)
- **Icons:** Lucide React
- **Bot & Email Services:** Telegram Bot API, Nodemailer
- **Auth:** JWT Tokens with HTTP-only Cookies
- **Deployment:** Vercel

---

## 🚀 Getting Started

### 1. Environment Configuration
Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=your_email@example.com
ADMIN_PASSWORD=your_secure_password
TELEGRAM_BOT_TOKEN=8895190327:AAFYwFQisNa0SJWbk7GOHW3eEvkf9lmq1GM
TELEGRAM_CHAT_ID=5960113085
```

### 2. Installation
Install project dependencies:
```bash
npm install
```

### 3. Development Server
Run the local dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the homepage, or [http://localhost:3000/admin](http://localhost:3000/admin) to access the CMS & Personal OS panel.

---

## 📐 Styling System & Design Tokens
All style tokens are configured dynamically using CSS variables inside `globals.css`:
- **Golds:** `var(--accent-gold)`, `var(--accent-champagne)`
- **Rich Darks:** `var(--bg-primary)`, `var(--bg-secondary)`
- **Glassmorphism:** `var(--glass-bg)`, `var(--glass-border)`
- **Typography:** Display (`Cinzel/Outfit`), Body (`Inter`), Serif (`Playfair Display`)

---

⚜️ *Meticulously engineered for elite digital presence & executive control.*
