# 04 — Incremental Step-by-Step Build Plan

> **VÉLORA — Real-Time Salon Queue Management System**  
> *The Art of Elevation · Beauty · Style · You*  
> *Production-Grade Step-by-Step Engineering Execution Guide for React + Vite + Tailwind CSS*

---

## Architecture & Technology Stack Overview

```mermaid
flowchart TD
    subgraph UI & Presentation Layer
        R["React 18 + Vite (SPA)"]
        TW["Tailwind CSS + Custom Editorial Theme"]
        L["Centralized Bilingual Localization (EN / GU)"]
        WA["Web Audio API (Synthesized Chimes)"]
    end

    subgraph State & Sync Engine
        Z["Reactive Store (Zustand or Context + Reducer)"]
        SM["Queue State Machine Engine"]
        BC["BroadcastChannel API + localStorage Sync (<5s)"]
    end

    subgraph Views (7 Dedicated Routes)
        V1["Customer Home (/)"]
        V2["Join Queue (/join)"]
        V3["Live Tracker (/status/:id)"]
        V4["Reception Tablet (/reception)"]
        V5["Barber Station (/barber/:name)"]
        V6["Wall TV Display (/display)"]
        V7["Owner Admin (/admin)"]
    end

    R --> TW
    R --> L
    R --> Z
    Z --> SM
    Z --> BC
    Z --> V1 & V2 & V3 & V4 & V5 & V6 & V7
```

* **Core Framework**: React 18 with TypeScript / modern JavaScript, bundled via Vite.
* **Styling Engine**: Tailwind CSS extended with custom color tokens (`#141210`, `#FBF9F5`, `#E7E3DD`, `#B48A45`, `#8A4F3A`, `#3F7A52`, `#B0452F`) and typography (`Playfair Display` + `Jost` + `Noto Sans Gujarati`).
* **Routing**: `react-router-dom` v6 for clean path routing across all 7 views.
* **Icons**: `lucide-react` for crisp minimal strokes.
* **State & Multi-Window Sync**: Reactive Store with `BroadcastChannel` and `window.addEventListener('storage')` for zero-latency cross-tab and cross-viewport synchronization across phones, tablets, and wall displays.

---

## Step-by-Step Implementation Guide

---

### Step 1: Project Setup, Theme Configuration & Bilingual Localization

#### Goal
Initialize the Vite React project, configure Tailwind CSS with the exact design tokens extracted from the reference template photo, setup `react-router-dom` routing skeleton for the 7 screens, and build a persistent, centralized English / Gujarati localization provider.

#### Files to Create / Modify
- `package.json`
- `vite.config.js`
- `tailwind.config.js`
- `index.html` (Google Fonts: Playfair Display, Jost, Noto Sans Gujarati)
- `src/index.css` (CSS custom properties, typography classes, reset)
- `src/locales/dictionary.js` (Complete EN and GU translations)
- `src/context/LanguageContext.jsx` (Language provider, persistent switcher hook)
- `src/components/HeaderNav.jsx` (Global header with logo, persistent language switcher, theme)
- `src/App.jsx` (Router configuration for all 7 routes)

#### Copy-Paste Prompt for Coding Agent

```markdown
### Prompt for Step 1: Scaffolding, Styling Tokens, and Bilingual Localization

Please set up the core scaffolding for the Luxe Salon Queue Management System:

1. In `tailwind.config.js`, extend the theme with our exact visual design tokens from `docs/02-screens.md`:
   - Colors:
     - `canvas`: `#FBF9F5` (dark: `#121010`)
     - `surface`: `#FFFFFF` (dark: `#1A1816`)
     - `ink`: `#141210` (dark: `#F1ECE4`)
     - `muted`: `#6B6762` (dark: `#A49D93`)
     - `stone-line`: `#E7E3DD` (dark: `#2A2623`)
     - `gold`: `#B48A45` (dark: `#D2A85D`)
     - `clay`: `#8A4F3A` (dark: `#C98A7C`)
     - `sage`: `#3F7A52` (dark: `#6FC08A`)
     - `rust`: `#B0452F` (dark: `#E07B63`)
   - Fonts:
     - `serif`: ['Playfair Display', 'Cormorant Garamond', 'serif']
     - `sans`: ['Jost', 'Noto Sans Gujarati', 'sans-serif']
   - Border radius: Enforce architectural minimal radii (`rounded-none` to `rounded-sm`).

2. In `index.html`, load Google Fonts: `Playfair Display:wght@400;500;600`, `Jost:wght@300;400;500`, and `Noto Sans Gujarati:wght@400;500`.

3. Create `src/locales/dictionary.js` containing complete translations in English (`en`) and Gujarati (`gu`) for:
   - Header, navigation, and footer labels
   - Service names and descriptions
   - Form fields, buttons, and error messages
   - Queue statuses (`waiting`, `called`, `in_service`, `completed`, `cancelled`, `no_show`)
   - Approach warnings, call alerts, and chair directions

4. Create `src/context/LanguageContext.jsx` exposing `{ lang, setLang, t(key) }`. Persist selection to `localStorage.getItem('luxe_lang')`.

5. Build `src/components/HeaderNav.jsx` featuring the centered uppercase logo "LUXE SALON" with `tracking-[0.32em]`, a language toggle button (`EN | ગુજ`), and quick links.

6. Configure `src/App.jsx` with routes for all 7 required views:
   - `/` (Home)
   - `/join` (Join Queue)
   - `/status/:id` (Live Tracker)
   - `/reception` (Reception Tablet)
   - `/barber/:name` (Barber Workstation)
   - `/display` (Wall TV Display)
   - `/admin` (Owner Settings)
```

#### Verification & Testing Criteria
- [ ] Application loads without Vite bundling errors.
- [ ] Playfair Display and Jost fonts render accurately.
- [ ] Language toggle switches UI text between English and Gujarati without page reload.
- [ ] Selected language persists across browser refreshes.
- [ ] Navigating to each of the 7 routes displays its respective placeholder component.

---

### Step 2: Shared Reactive Store, State Machine, Algorithms & Seed Data

#### Goal
Implement the central Queue Store with the deterministic Queue State Machine, the multi-barber wait time formula, duplicate phone validation, and the production dummy dataset (4 barbers, 8 services, 8 initial tokens).

#### Files to Create / Modify
- `src/types/queue.js` (Data models and state enums)
- `src/data/seedData.js` (Barbers, Services catalog, initial tokens A101–A108)
- `src/utils/waitTime.js` (Mathematical wait formula implementation)
- `src/context/QueueContext.jsx` (Central store, state machine transitions, localStorage sync)
- `src/utils/audio.js` (Web Audio API synthesized luxury chime)

#### Copy-Paste Prompt for Coding Agent

```markdown
### Prompt for Step 2: Queue Store, State Machine, and Wait Time Algorithms

Implement the central queue management engine in `src/context/QueueContext.jsx` and helper utilities:

1. Create `src/data/seedData.js` exporting:
   - `BARBERS`: The 4 stylists from `docs/02-screens.md` (Kabir, Meera, Aarav, Bhavik) with chair numbers, avatars, specialties, and shift statuses.
   - `SERVICES`: The 8 catalog services from `docs/02-screens.md` (Signature Haircut ₹500/30m, Beard Sculpt ₹250/20m, Hair Spa ₹900/45m, Facial ₹1200/45m, Color ₹2500/75m, Keratin ₹3500/90m, Massage ₹500/25m, Combo ₹1800/75m).
   - `INITIAL_TOKENS`: Tokens A101 to A108 in their designated states (2 in service, 1 called, 5 waiting).

2. In `src/utils/waitTime.js`, implement the exact formula from `docs/03-flows-rules.md`:
   - `calculateWaitTime(queue, targetTokenId, barbers)`
   - Computes wait time based on service durations of patrons ahead divided by active on-duty barbers, rounded up to the nearest 5-minute interval.
   - Respects specific barber requests vs "Any Available (Fastest)" requests.
   - Returns 0 if patron is currently in chair.

3. In `src/context/QueueContext.jsx`, create the primary reactive store:
   - State: `tokens`, `barbers`, `services`, `salonSettings` (`isQueueOpen`, `autoCutoffMinutes`).
   - Actions:
     - `joinQueue({ name, phone, serviceIds, preferredBarberId })`: Validates duplicate phone numbers; generates sequential token code; returns new token object.
     - `callNext(barberId)`: Implements Smart FIFO scan for the barber; enforces Single-Chair Concurrency Guard; updates status to `called`; sets `calledAt`.
     - `startService(tokenId)`: Transitions status to `in_service`; sets `serviceStartedAt`.
     - `completeService(tokenId)`: Transitions status to `completed`; logs completion; frees chair.
     - `cancelToken(tokenId)`: Transitions status to `cancelled`; recalculates downstream wait times.
     - `markNoShow(tokenId)`: Transitions status to `no_show`; frees chair.
     - `updateBarberStatus(barberId, status)`: Sets `on_duty`, `on_break`, or `off_duty`.
   - Synchronization: Persist state changes to `localStorage` under `luxe_salon_v1` and broadcast via `BroadcastChannel('luxe_queue_sync')`.

4. In `src/utils/audio.js`, implement `playChime()` using HTML5 Web Audio API:
   - Synthesizes a luxury two-tone chime (587.33 Hz [D5] to 880.00 Hz [A5]) with soft sine gain envelope. Zero external audio file dependencies.
```

#### Verification & Testing Criteria
- [ ] Initial state loads with 8 seed tokens, 4 barbers, and 8 services.
- [ ] Duplicate phone number validation throws appropriate error when identical number is submitted.
- [ ] Wait time utility correctly computes ceiling-to-5-min calculations.
- [ ] Calling `completeService` updates barber chair to available and unlocks customer phone.
- [ ] `playChime()` produces clear two-tone audio on click.

---

### Step 3: Screens 1, 2, 3 (Customer Home, Join Queue, Live Status Tracker)

#### Goal
Build the customer mobile-first journey: the aesthetic luxury Landing Page with the 3x2 service grid from the template photo, the remote Join Queue form with real-time validation, and the Live Status Tracker with dynamic countdown and approach alerts.

#### Files to Create / Modify
- `src/pages/Home.jsx` (Hero banner, live pulse stats, 3x2 editorial service offerings grid, ticker marquee)
- `src/pages/JoinQueue.jsx` (Name, phone, max-3 service selector, barber preference, duplicate guard)
- `src/pages/StatusTracker.jsx` (Token emblem, countdown wait timer, approaching banner, fullscreen "It's your turn" call takeover, cancel modal)
- `src/components/ServiceCard.jsx` (Mood photography card with dark overlay and centered tracking text)

#### Copy-Paste Prompt for Coding Agent

```markdown
### Prompt for Step 3: Customer Screens (Home, Join Queue, Live Status Tracker)

Develop the three customer-facing views according to the specifications in `docs/02-screens.md`:

1. Build `src/pages/Home.jsx`:
   - Hero Section: Dark vignette overlay, H1 "A queue that respects your time", subtitle "Sector 12 · Sānand, Gujarat", primary CTA button to `/join`.
   - Live Pulse Panel: 4-column metric strip (Waiting count, Now Serving tokens, Est. Wait for new guests, Active Chairs).
   - Service Offerings Grid: Exact 3x2 responsive photo grid directly matching the reference template image:
     - Cards: HAIRCUTTING, COLOR SERVICES, TREATMENT SERVICES & KERATIN SERVICES, ADD-ON SERVICES, STYLING, EXTENSIONS.
     - Styling: High-contrast photography, dark gradient overlay, uppercase centered white text with `tracking-[0.2em] font-medium`.
   - "How It Works" horizontal sequence: 1. Choose -> 2. Get Token -> 3. Track Live -> 4. Walk In.
   - Continuous Marquee Ticker at the bottom.

2. Build `src/pages/JoinQueue.jsx`:
   - 2-column layout (mobile stacked, desktop 340px form + live queue list).
   - Form fields:
     - Customer Name (text, required, min 2 chars).
     - Mobile Number (tel input, exactly 10 digits).
     - Services Selection (checkbox grid of 8 services, maximum 3 allowed, displays duration and INR price).
     - Barber Preference radio group: "Any Available (Fastest)" + list of 4 on-duty barbers with photos.
   - Real-time Duplicate Phone Check: Alerts if user already has an active token with a direct link to their status tracker.
   - Live summary preview: Total duration, total price, dynamic estimated wait.
   - Inverted black submit button: `GET MY TOKEN`. Redirects to `/status/:id` on success.

3. Build `src/pages/StatusTracker.jsx`:
   - Retrieves token by URL parameter `:id` or `localStorage.luxe_active_token`.
   - Prominent Token Code display (`A104`).
   - Dynamic State Renderings:
     - `WAITING`: Guests ahead counter, countdown minutes, live pulse icon.
     - `APPROACHING` (<= 10m or 1st in line): Amber alert banner: "Please start heading to the salon".
     - `CALLED`: Fullscreen high-contrast modal takeover: "IT'S YOUR TURN! PROCEED TO CHAIR X", plays audio chime.
     - `IN_SERVICE`: Elapsed timer counting upward against service duration.
     - `COMPLETED`: Thank you summary with INR billing amount.
   - "Cancel My Spot" button with confirmation modal.
```

#### Verification & Testing Criteria
- [ ] Home page displays the 3x2 service grid identical to the template photo layout.
- [ ] Submitting `/join` with > 3 services is prevented.
- [ ] Submitting `/join` with an active phone number displays duplicate error.
- [ ] Submitting valid form navigates to `/status/:id` and stores token in `localStorage`.
- [ ] Live status tracker dynamically reflects status transitions (`WAITING` $\rightarrow$ `CALLED` $\rightarrow$ `IN_SERVICE`).

---

### Step 4: Screen 4 (Receptionist Tablet Dashboard)

#### Goal
Build the high-throughput Receptionist Command Center (`/reception`) with the active queue table, real-time chair station cards, rapid walk-in registration modal, and no-show grace timer controls.

#### Files to Create / Modify
- `src/pages/ReceptionDashboard.jsx` (Queue table, chair status cards, search filter)
- `src/components/WalkInModal.jsx` (Fast 3-tap walk-in customer creation modal)
- `src/components/NoShowModal.jsx` (10-minute grace timer countdown and ejection dialogue)

#### Copy-Paste Prompt for Coding Agent

```markdown
### Prompt for Step 4: Receptionist Dashboard and Walk-In Modal

Build the reception desk interface in `src/pages/ReceptionDashboard.jsx`:

1. Design layout for Tablet / Desktop landscape:
   - Header: Salon Title, Status filters (`All`, `Waiting`, `In Chair`, `Completed`), Clock, Language toggle.
   - Top KPI Strip: Waiting count, In-Chair count, Completed today, Average wait time, and giant `+ Walk-In` button.
   - Left 60%: Active Queue Table sorted strictly by FIFO token order:
     - Columns: Token, Guest Name & Phone, Services, Stylist Preference, Status Badge, Wait/Elapsed Time, Action Buttons.
     - Row Actions: `Call Guest`, `Start Service`, `Mark Done`, `No-Show`, `Cancel`.
   - Right 40%: Styling Chairs Overview:
     - 4 Chair Station Cards (Kabir, Meera, Aarav, Bhavik).
     - Shows current occupant, service name, elapsed timer, and quick station toggle (`On Duty` / `On Break`).

2. Build `src/components/WalkInModal.jsx`:
   - Single-tap rapid check-in form.
   - Fields: Name, Mobile (with quick "Guest Declined" button for `0000000000`), Service selection, Barber choice.
   - Appends token strictly to the end of the queue with `isWalkIn: true`.

3. Implement No-Show Grace Period Handling:
   - Clicking "No-Show" initiates a 10-minute grace timer.
   - Allows receptionist to eject the customer if they fail to arrive, or cancel the no-show if they walk in.
```

#### Verification & Testing Criteria
- [ ] Walk-in customer appears at the bottom of the active queue with a new sequential token.
- [ ] Chair cards display correct real-time occupant and elapsed service timer.
- [ ] Filtering by "Waiting" or "In Chair" filters the table accurately.
- [ ] Ejecting a no-show frees up the chair and unlocks the queue.

---

### Step 5: Screens 5 & 6 (Barber Workstation & Wall TV Display)

#### Goal
Build the tactile Barber Mirror Workstation view (`/barber/:name`) with single-chair concurrency guards, and the 1080p/4K Lounge Wall TV Display (`/display`) with ambient split-screen layout, visual call pulses, and Web Audio API chimes.

#### Files to Create / Modify
- `src/pages/BarberWorkstation.jsx` (Touch-first stylist station, elapsed timer, Call Next button, upcoming queue)
- `src/pages/WallDisplay.jsx` (Ambient split-screen 16:9 non-scrolling TV view, call highlight flash, audio chime trigger)
- `src/components/TvChimeListener.jsx` (Audio listener playing chime on new call events)

#### Copy-Paste Prompt for Coding Agent

```markdown
### Prompt for Step 5: Barber Workstation and Lounge Wall TV Display

Implement the operational Barber Workstation and Waiting Lounge TV views:

1. Build `src/pages/BarberWorkstation.jsx`:
   - Route: `/barber/:name` (e.g. `/barber/kabir`, `/barber/meera`).
   - Match parameter against barber slug from `seedData.js`.
   - Station Status Banner: Station Number, Barber Name, Shift status toggle (`On Duty` / `15m Break` / `Off Duty`).
   - Active Client Card (if client is in chair):
     - Large Token Number, Customer Name, Phone.
     - Service breakdown and target duration.
     - Giant Service Timer: Displays elapsed time (e.g. `18:45 / 30:00`) with visual progress bar.
     - Action buttons: `+5 Min Extension` and `Complete Service (Mark Done)`.
   - "Call Next Guest" Primary Action:
     - Enforces Single-Chair Concurrency Guard: Hidden or disabled if station is already `IN_SERVICE`.
     - Uses Smart FIFO: Calls first guest who requested this barber or "Any Stylist".
   - Upcoming Queue Preview: Lists next 3 eligible customers waiting for this stylist.

2. Build `src/pages/WallDisplay.jsx`:
   - Fixed 1080p landscape layout (non-scrolling, high-contrast obsidian or warm limestone).
   - Left 50% ("NOW SERVING"):
     - Grid of styling chairs.
     - Displays Token Number, Guest Name, Stylist Name, and Chair Number.
     - **Visual Attention Flash**: When a token transitions to `CALLED`, its chair card flashes an animated border pulse for 15 seconds with badge `[ PLEASE PROCEED TO CHAIR ]`.
   - Right 50% ("UPCOMING QUEUE"):
     - Table of next 6 waiting tokens with masked names (e.g. `Rohan M.`), services, and dynamic countdown wait minutes.
     - Salon notice card with QR code instruction.
   - Bottom continuous news-ticker streaming live updates.
   - Integrate `src/utils/audio.js` to play the Web Audio synthesized chime whenever a new token is called. Provide an "Enable Audio" prompt button on first load to satisfy browser autoplay requirements.
```

#### Verification & Testing Criteria
- [ ] Workstation prohibits calling a new customer when a customer is already in chair.
- [ ] Workstation correctly filters upcoming queue to only show eligible customers.
- [ ] Completing a service marks token `COMPLETED` and recalculates queue.
- [ ] Wall TV displays active chairs and waiting list without vertical scrollbars.
- [ ] When a barber taps "Call Next", the Wall TV flashes the chair and sounds the audio chime.

---

### Step 6: Screen 7 (Owner Admin Settings) & Multi-Device Sync

#### Goal
Build the Owner Administration Console (`/admin`) with master queue toggles, 30-minute auto-cutoff rules, service catalog editing, and staff roster controls. Implement robust cross-tab/cross-device state synchronization via `BroadcastChannel` and `localStorage`.

#### Files to Create / Modify
- `src/pages/AdminSettings.jsx` (Capacity controls, analytics KPIs, service manager, staff roster)
- `src/hooks/useRealtimeSync.js` (BroadcastChannel + storage event listener for cross-window sync < 5s)

#### Copy-Paste Prompt for Coding Agent

```markdown
### Prompt for Step 6: Owner Admin Settings and Cross-Device Synchronization

Implement the administrative console and real-time synchronization engine:

1. Build `src/pages/AdminSettings.jsx`:
   - Top Capacity Control Bar:
     - Master Queue Acceptance toggle: `Open` vs `Paused/Closed`. When closed, remote join on `/join` is blocked.
     - 30-Minute Auto-Cutoff Rule checkbox: When checked, automatically rejects remote joins if current backlog exceeds salon closing time.
     - Salon Operating Hours configurator (e.g. 09:00 AM to 09:00 PM).
   - Real-Time Analytics Cards:
     - Total Guests Served today.
     - Average Wait Time in minutes.
     - Chair Utilization percentage.
     - No-Show rate percentage.
   - Tabbed Configuration Sections:
     - Services Catalog: Table of services with inline duration (minutes) and price (INR) editing, plus active toggle.
     - Stylist Roster: List of barbers with chair assignments, specialties, and on-duty toggles.

2. Build `src/hooks/useRealtimeSync.js`:
   - Connects to `BroadcastChannel('luxe_salon_sync')` and listens for `storage` events.
   - Synchronizes state changes instantly across tabs and windows with latency < 1 second.
   - Ensures that when a barber taps "Call Next" in Tab A, the TV in Tab B and the customer's phone in Tab C update immediately.
```

#### Verification & Testing Criteria
- [ ] Toggling Master Queue to "Paused" prevents new joins on `/join`.
- [ ] Editing service duration or price in Admin updates the catalog across all screens.
- [ ] Actions taken in one browser tab reflect in all other open tabs within 1 second.
- [ ] Analytics summary accurately aggregates completed tokens.

---

### Step 7: Edge Cases, Lifecycle Guards & 15-Point Test Verification

#### Goal
Perform rigorous verification of all business rules, edge cases, and bilingual copy; audit against the 15-point test checklist in `docs/03-flows-rules.md`.

#### Files to Create / Modify
- `src/utils/guards.js` (Invariant assertions and validation checks)
- `src/tests/queueLogic.test.js` (Automated or manual verification test suite)
- `src/locales/dictionary.js` (Complete audit of Gujarati translations)

#### Copy-Paste Prompt for Coding Agent

```markdown
### Prompt for Step 7: Edge Cases, Lifecycle Guards, and Verification

Conduct a comprehensive hardening and test execution pass:

1. Implement invariant guards in `src/utils/guards.js`:
   - Assert single-chair concurrency (cannot start service if chair is busy).
   - Assert single active token per mobile number.
   - Assert unidirectional state transitions (cannot revert from completed/cancelled).
   - Assert zero-barber fallback: When all barbers are on break, display "Queue Temporarily Paused".

2. Verify all 15 scenarios from the Test Checklist in `docs/03-flows-rules.md`:
   - Test 1: Standard Remote Join.
   - Test 2: Duplicate Phone Guard.
   - Test 3: Max 3 Services Guard.
   - Test 4: Walk-In Append Order.
   - Test 5: Smart FIFO Barber Dispatch.
   - Test 6: "Any Barber" FIFO Claim.
   - Test 7: Single-Chair Concurrency Guard.
   - Test 8: Timer Lifecycle Transition.
   - Test 9: Approaching Turn Warning.
   - Test 10: "It's Your Turn" Fullscreen Alert.
   - Test 11: Wall TV Chime & Visual Flash.
   - Test 12: Customer Self-Cancellation.
   - Test 13: No-Show 10-Minute Grace Ejection.
   - Test 14: Bilingual Toggle Persistence.
   - Test 15: Cross-Tab Real-Time Sync (< 5s).

3. Audit Gujarati translations in `src/locales/dictionary.js` to ensure 100% string coverage across all 7 screens with zero English leaks when Gujarati is active.
```

#### Verification & Testing Criteria
- [ ] All 15 verification checklist points pass without errors.
- [ ] Zero unhandled console warnings or JavaScript exceptions.
- [ ] Complete Gujarati localization audit passes across all modals, toasts, and buttons.

---

### Step 8: Production Build, Deployment & README Documentation

#### Goal
Create optimized production build, configure Vercel deployment with client-side SPA routing rewrites, and prepare the project README.

#### Files to Create / Modify
- `vercel.json` (SPA client routing rewrites)
- `README.md` (Project overview, quick start, architecture, screen directory)
- Production build validation (`npm run build`)

#### Copy-Paste Prompt for Coding Agent

```markdown
### Prompt for Step 8: Production Build, Deployment Config, and Documentation

Finalize the repository for production deployment:

1. Create `vercel.json` with SPA routing rewrite rules:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

2. Create `README.md` containing:
   - High-level system overview and architectural highlights.
   - Quick Start Guide (`npm install`, `npm run dev`, `npm run build`).
   - Route Directory linking all 7 required views:
     - `/` — Customer Home
     - `/join` — Remote Queue Join
     - `/status/:id` — Live My Status Tracker
     - `/reception` — Receptionist Tablet Dashboard
     - `/barber/:name` — Barber Mirror Workstation
     - `/display` — Lounge Wall TV Ambient Display
     - `/admin` — Salon Owner Capacity & Analytics Console
   - Visual Design System summary matching the reference template aesthetic.
   - Bilingual support documentation (English and Gujarati).
   - Local state synchronization and Web Audio chime notes.

3. Execute `npm run build` to confirm zero lint or TypeScript/bundling errors.
```

#### Verification & Testing Criteria
- [ ] `npm run build` succeeds and produces an optimized `/dist` folder.
- [ ] Deep linking to `/status/t-101` or `/barber/kabir` works without 404 errors.
- [ ] README provides clear setup and verification guidelines.
