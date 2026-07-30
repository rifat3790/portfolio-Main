# 👑 REFAYET HOSSEN — Executive Full-Stack Portfolio, CMS & Financial OS

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Telegram_Bot-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram Bot" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

---

## 🌟 Executive Overview

**Refayet Hossen Portfolio & Executive OS** is a state-of-the-art, ultra-luxury web platform, bespoke Content Management System (CMS), and real-time financial intelligence suite designed for **Refayet Hossen** (Software Engineer & Full-Stack Digital Architect). 

It combines bespoke editorial visual design with high-performance Next.js 16 App Router architecture, real-time MongoDB synchronization, automated Telegram bot alerts, and AI-powered financial advisory modules.

---

## ⚡ Key System Modules

```
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                         REFAYET HOSSEN PLATFORM                              │
 └──────────────────────┬───────────────────────────────┬──────────────────────┘
                        │                               │
       ┌────────────────┴──────────────┐   ┌────────────┴──────────────┐
       │   Public Editorial Portfolio   │   │ Executive Admin Dashboard │
       └────────────────┬──────────────┘   └────────────┬──────────────┘
                        │                               │
     ┌──────────────────┼──────────────────┐            ├─ 💼 Personal Wallet Engine
     │                  │                  │            ├─ 🛍️ Shopify Issue Tracker
 🔮 Layouts         💬 AI Chat        📊 Projects       ├─ ✉️ Automated Email Digest
 Engine              Assistant         & Journal        └─ 📱 Telegram Push Bot
```

---

### 🔮 1. Editorial Multi-Layout Engine
A dynamic theme engine allowing instant rendering of key page sections across **8 luxury layout variations**:
- 💼 **Selected Works (Projects):** Asymmetric Gallery, Classic Grid, Horizontal Drag Carousel, Staggered Masonry, Large List Rows, Borderless Minimal Cards, Split Parallax, and Minimal List.
- ⚡ **Technical Proficiency (Skills):** Progress Bars, Glass Cards Grid, Infinite Marquee Track, Minimalist Tag Cloud, Timeline Stages, Dual-Column Table, Circular Dials, and Modern Badges.
- 💬 **Client Reviews (Testimonials):** Columns Grid, Carousel Slider, Masonry Wall, Huge Featured Quote, Split Sticky, Chat Bubbles Mockup, Gold Citation Quotes, and Infinite Ribbon.
- 📰 **Journal (Blogs):** Split Sticky Editorial, List Rows, Cards Grid, Magazine Split, Cover Story Banner, Alternate Blocks, Horizontal Strip, and Minimalist List.

---

### 💼 2. Personal Wealth & AI Financial Advisor (`Personal Wallet`)
A 100% dynamic, MongoDB-backed 9-tab executive financial operating system:
- 📊 **Monthly Ledger**: Track Salary, Freelance Revenues, Addons, Bonuses, and Expenses.
- 📈 **1st to 31st Expenditure Timeline**: Interactive daily spending bar chart highlighting peak outlay days (> ৳2,000) and no-spend streak days.
- 🔮 **AI Impulse Purchase Radar**: Calculates a Financial Discipline Score (100-scale) and flags high-value outlier transactions.
- 📅 **31-Day Heat-Calendar Matrix**: Color-coded monthly intensity grid (Emerald ৳0, Indigo Low, Amber Moderate, Red Peak).
- 🎛️ **Daily Budget Simulator & EOM Projection Engine**: Live budget range slider & preset buttons projecting end-of-month net savings and runway days.
- 🧠 **AI Category Daily Pace Breakdown & Advisory**: Monitors category daily spending rates, budget caps, over-spending alerts, and smart advisory guidance.
- 🛡️ **AI Living Runway & Emergency Buffer Meter**: Baseline overhead auditing (Rent + Food + Utility) with live emergency runway coverage months.
- 💼 **Asset Allocation Vault**: Real-time management of Bank Deposits, Workstation Gear, Cash Reserves, and Growth Equities.
- ✉️ **Automated Daily 8:00 PM BST Digest & Telegram Push**: Sends automated daily digest emails and instant Telegram Bot (`@Rifat_CC`) push alerts.

---

### 🛍️ 3. Shopify Project Issue Tracker & Automated Notifications
- **Google Sheets Integration**: Automatically syncs issues directly from Google Sheets (`Shopify` tab).
- **Syntax Parser Engine**: Auto-parses team column syntaxes such as `Rakib/CW`, `Ariful/CM`, `Knight Flow/Atik` to extract Employee Name and Team (`CW`, `CM`, `CC`, `CS`).
- **Telegram Push Bot**: Sends instant real-time Telegram notifications (`Chat ID: 5960113085`) upon issue assignment or sheet updates.

---

### 💬 4. Interactive AI Chat Assistant
- Embedded conversational AI chat widget for site visitors.
- Allows visitors to interact with a smart AI persona representing Refayet Hossen.
- Persists all conversation logs directly into MongoDB.

---

## 🛠️ Tech Stack & Dependencies

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript (Strict Mode) |
| **Database & ODM** | MongoDB & Mongoose |
| **Styling System** | Vanilla CSS Modules with Luxury Design Tokens |
| **Animations** | Framer Motion (Fluid drag physics & spring transitions) |
| **Icons** | Lucide React |
| **Integrations** | Telegram Bot API, Google Sheets API, Nodemailer |
| **Auth** | JWT Tokens with HTTP-only Cookies |
| **Hosting & Edge** | Vercel Serverless & Edge Network |

---

## 🚀 Environment Setup

### 1. Configure `.env.local`
Create `.env.local` in the root directory:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
ADMIN_EMAIL=mdrifayethossen@gmail.com
ADMIN_PASSWORD=your_secure_password
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=5960113085
```

### 2. Install & Run
```bash
# Install dependencies
npm install

# Launch local development server
npm run dev
```

Visit `http://localhost:3000` for the main portfolio, or `http://localhost:3000/admin` for the Executive Admin Portal.

---

## 🎨 Luxury Design Tokens (`globals.css`)

```css
:root {
  --accent-gold: #f59e0b;          /* Primary Luxury Gold */
  --accent-champagne: #fbbf24;     /* Champagne Gold Accent */
  --bg-primary: #07070b;           /* Deep Midnight Dark */
  --bg-secondary: #0f172a;         /* Slate Secondary Container */
  --glass-bg: rgba(15, 23, 42, 0.4);/* Glassmorphism Background */
  --glass-border: rgba(255, 255, 255, 0.08); /* Ambient Border */
}
```

---

<p align="center">
  ⚜️ <strong>Refayet Hossen Portfolio & Executive OS</strong> — Meticulously engineered for high-performance digital presence and total financial control.
</p>
