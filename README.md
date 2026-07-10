# ⚜️ AURA — Elite Full-Stack Portfolio & CMS

Aura is a bespoke, ultra-premium developer portfolio and custom Content Management System (CMS) designed for Refayet Hossen. Built with Next.js, MongoDB, and Framer Motion, it features an editorial visual aesthetic, interactive micro-animations, and a highly customizable layouts system managed from an admin dashboard.

---

## ✨ Features & Architecture

### 🔮 1. Multi-Layout Engine
Aura features a dynamic layouts engine that lets the admin switch the styling of key page sections instantly. Each section supports **8 premium layout variations**:
- **Selected Works (Projects):** Asymmetric Gallery, Classic Grid, Horizontal Drag Carousel, Staggered Masonry, Large List Rows, Borderless Minimal Cards, Split Parallax, and Minimal List.
- **Technical Proficiency (Skills):** Progress Bars, Glass Cards Grid, Infinite Marquee Track, Minimalist Tag Cloud, Timeline Stages, Dual-Column Table, Circular Dials, and Modern Badges.
- **Client Reviews (Testimonials):** Columns Grid, Carousel Slider, Masonry Wall, Huge Featured Quote, Split Sticky, Chat Bubbles Mockup, Gold Citation Quotes, and Infinite Ribbon.
- **Journal (Blogs):** Split Sticky Editorial, List Rows, Cards Grid, Magazine Split, Cover Story Banner, Alternate Blocks, Horizontal Strip, and Minimalist List.

### 🛡️ 2. Dynamic Settings & Admin Console
- Live-editable logo text, portraits, background banners, and custom favicon.
- secured JWT-authenticated administration dashboard (`/admin`).
- Instantly updates site layout selections, typewriter roles, and contact info.
- Fully wired to database persistence with automatic route revalidation on save.

### 💬 3. Live AI Chat Assistant Widget
- Integrates a conversational live-chat bubble.
- Allows visitors to interact with a smart AI agent representing the developer.
- Fast, fluid visual responses with automated chat logs saved to the database.

---

## 🛠️ Tech Stack

- **Core Framework:** Next.js 16 (App Router, Turbopack)
- **Database & ODM:** MongoDB & Mongoose
- **Styling:** CSS Modules (Vanilla Luxury CSS Variables)
- **Animations:** Framer Motion (Fluid drag physics & enter-transitions)
- **Icons:** Lucide React
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
Open [http://localhost:3000](http://localhost:3000) to view the homepage, or [http://localhost:3000/admin](http://localhost:3000/admin) to access the CMS panel.

### 4. Database Seeding (Admin Portal)
On first load, log into the `/admin` dashboard and click the **"Seed Database"** button to populate the site with standard gold-themed luxury portfolio items.

---

## 📐 Styling System & Design Tokens
All style tokens are configured dynamically using CSS variables inside `globals.css`:
- **Golds:** `var(--accent-gold)`, `var(--accent-champagne)`
- **Rich Darks:** `var(--bg-primary)`, `var(--bg-secondary)`
- **Glassmorphism:** `var(--glass-bg)`, `var(--glass-border)`
- **Typography:** Display (`Cinzel/Outfit`), Body (`Inter`), Serif (`Playfair Display`)

---
⚜️ *Meticulously engineered for elite digital presence.*
