# VÉLORA — Real-Time Salon Queue Management System

> **THE ART OF ELEVATION** · *BEAUTY · STYLE · YOU*  
> 🌐 **Live Demo (Receptionist Console):** [https://salon-queue-management-three.vercel.app/reception](https://salon-queue-management-three.vercel.app/reception)

A production-grade, real-time salon queue management web application built with **React 18 + Vite + Tailwind CSS**, featuring an editorial **Quiet Luxury** visual design system inspired directly by high-end salon brand aesthetics.

---

## 📸 Design Language & Visual System
- **Editorial Typography**: `Playfair Display` serif for architectural display headers paired with geometric `Jost` for crisp micro-legibility and native `Noto Sans Gujarati` for regional text.
- **Palette**: Obsidian charcoal (`#141210`), warm limestone canvas (`#FBF9F5`), champagne gold (`#B48A45`), deep clay (`#8A4F3A`), sage available (`#3F7A52`), and spiced rust (`#B0452F`).
- **Service Offerings Photo Grid**: Authentic 3x2 editorial layout with dark moody vignette overlays and centered uppercase wide-tracked typography (`HAIRCUTTING`, `COLOR SERVICES`, `TREATMENT SERVICES & KERATIN SERVICES`, `ADD-ON SERVICES`, `STYLING`, `EXTENSIONS`).
- **Smooth Animations**: Animated infinite marquee ticker, smooth scroll indicators, visual call border pulses, and confetti celebration effects.

---

## 🚀 The 7 Required Dedicated Views

| View Name | Route | Target Device | Key Features |
|---|---|---|---|
| **Customer Home** | `/` | Mobile / Desktop | Live salon pulse strip, 3x2 editorial service photo grid, horizontal stepper, Gujarat branches. |
| **Join Queue** | `/join` | Mobile-first | Multi-service selector (max 3), stylist preference ("Any" vs specific barber), duplicate phone guard. |
| **Live Status Tracker** | `/status/:id` | Mobile phone | Live position counter, countdown wait estimate, amber approaching warning, full-screen "It's your turn!" modal. |
| **Receptionist Dashboard** | `/reception` | iPad / Tablet | Active FIFO table, 4-chair station overview, rapid walk-in modal (`+ Add Walk-In`), no-show grace timer. |
| **Barber Workstation** | `/barber/:name` | Mirror tablet | Touch-first stylist panel, giant elapsed timer, `+5 Min Extension`, single-chair concurrency guard, smart FIFO call. |
| **Wall TV Ambient Display** | `/display` | 1080p/4K Lounge TV | Split-screen non-scrolling layout ("Now Serving" left, "Upcoming Queue" right), animated call flashes, Web Audio chime. |
| **Owner Admin & Analytics** | `/admin` | Laptop / Desktop | Master queue acceptance toggle, 30-min closing auto-cutoff rule, service catalog pricing editor, stylist roster controls. |

---

## ⚡ Core Business & Queue Logic
1. **Smart FIFO Preference Dispatch**:
   - Calling "Next" for Barber X skips customers who requested a different stylist and claims the next customer requesting Barber X or "Any available (Fastest)".
2. **Single-Chair Concurrency Guard**:
   - Prevents double-booking: A stylist cannot call another customer while their chair is currently `IN_SERVICE`.
3. **Duplicate Phone Number Guard**:
   - A customer mobile number cannot have more than one active token in `WAITING`, `CALLED`, or `IN_SERVICE`.
4. **Dynamic Mathematical Wait Formula**:
   $$\text{Estimated Wait (min)} = \left\lceil \frac{\sum \text{Durations Ahead}}{\text{Active On-Duty Barbers}} \times \frac{1}{5} \right\rceil \times 5$$
5. **Centralized Bilingual Localization (English & Gujarati)**:
   - Persistent header toggle (`EN | ગુજ`) with zero translation leaks across all 7 views.
6. **Sub-second Cross-Device Sync**:
   - Synchronized across customer phones, reception iPads, barber tablets, and wall displays using `BroadcastChannel` and `localStorage` events (< 1s latency).
7. **Synthesized Luxury Audio Chimes**:
   - Built with the native HTML5 Web Audio API (587.33 Hz [D5] $\rightarrow$ 880.00 Hz [A5]). Zero external MP3 asset downloads.

---

## 🛠️ Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 3. Production Build & Preview
```bash
npm run build
npm run preview
```

---

## 📁 Repository Structure
```
SalonQueueManagement/
├── docs/
│   ├── 01-brief.md          # Complete PRD, user personas, in/out scope
│   ├── 02-screens.md        # Visual design system & all 7 screen specs
│   ├── 03-flows-rules.md    # State machine, wait formulas & 15-point test suite
│   └── 04-build-plan.md     # Step-by-step engineering prompts
├── src/
│   ├── components/
│   │   ├── HeaderNav.jsx    # Sticky navigation, logo, lang switcher, theme
│   │   ├── MarqueeTicker.jsx# Continuous animated ticker
│   │   └── ServiceCard.jsx  # Editorial photography card from template
│   ├── context/
│   │   ├── LanguageContext.jsx # EN/GU localization engine + dark mode
│   │   └── QueueContext.jsx    # Central reactive queue store + sync
│   ├── data/
│   │   └── seedData.js      # Barbers, 8 catalog services, seed tokens A101-A108
│   ├── locales/
│   │   └── dictionary.js    # Comprehensive English & Gujarati dictionary
│   ├── pages/
│   │   ├── Home.jsx         # Screen 1: Customer Home
│   │   ├── JoinQueue.jsx    # Screen 2: Remote Join Queue
│   │   ├── StatusTracker.jsx# Screen 3: Live My Status Tracker
│   │   ├── ReceptionDashboard.jsx # Screen 4: Receptionist Console
│   │   ├── BarberWorkstation.jsx  # Screen 5: Barber Styling Station
│   │   ├── WallDisplay.jsx  # Screen 6: Lounge Wall TV Display
│   │   └── AdminSettings.jsx# Screen 7: Owner Settings & Analytics
│   ├── utils/
│   │   ├── audio.js         # Web Audio API synthesized chime
│   │   └── waitTime.js      # Mathematical queue wait algorithm
│   ├── App.jsx              # Routing for all 7 views
│   ├── index.css            # Custom CSS & Tailwind typography
│   └── main.jsx
├── tailwind.config.js
├── vite.config.js
├── vercel.json
└── package.json
```
