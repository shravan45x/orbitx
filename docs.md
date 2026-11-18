# OrbitX — Developer & Collaborator Guide (`docs.md`)

Welcome to the **OrbitX** web platform repository. This document outlines the project architecture, design system, current progress, development workflow, and conventions so any collaborator can continue development seamlessly.

---

## 1. Project Overview & Architecture

**OrbitX** is the official web portal for the astronomical research, telemetry, observation, and aerospace engineering club at **Zeal College of Engineering and Research (ZCOER), Pune**.

### Tech Stack
- **Framework & Bundler:** React 18, Vite 7, TypeScript
- **Styling:** Vanilla CSS with custom properties (`src/index.css`), flat architectural aerospace styling
- **Typography:** Custom `D-DIN` aerospace type family (`public/font/`)
  - `D-DIN` (Sans)
  - `D-DIN Condensed` (Headlines, Wire headers)
  - `D-DIN Exp` (Expanded tags, technical readouts)
- **Backend & Database:** Firebase Auth, Cloud Firestore, Firebase Storage
- **Routing:** `react-router-dom` v7 (SPA with Vercel rewrite configuration)
- **Hosting Target:** Vercel

---

## 2. OrbitX Design System (Mandatory Rules)

Every page and component in OrbitX adheres to strict design system directives (enforced in `.agents/rules/orbitx.md`):

1. **Strict 4px Border Radius:** Global radius is strictly 4px (`--radius: 4px`). Do not use pills, large curved corners, or squircles.
2. **Strictly Flat (NO Box Shadows):** `box-shadow: none` across cards, dialogs, buttons, and containers. Elevation is expressed via crisp 1px borders (`var(--border-color)`, `var(--border-strong)`) and subtle background tiering (`var(--bg-card)`, `var(--bg-secondary)`).
3. **Strictly Grounded (NO Hover Transforms):** Controls must remain visually stable and grounded. Strictly NO hover shifts, `translateY`, hover scaling, or bobbing animations. Standard `:focus-visible` outlines are required for accessibility.
4. **Color Tokens & Dual-Theme:**
   - **Dark Mode (Default):** Pure black (`#000000`), architectural paper (`#F3EEE3`), burnt orange accent (`#D9541E`).
   - **Light Mode (`[data-theme="light"]`):** Warm paper cream (`#F3EEE3`), dark ink (`#000000`), burnt orange accent (`#D9541E`).
   - **Moving Glare Sweep (`--text-glare-bg`):** Automatically swaps between a bright white sheen on dark mode and a deep jet-black ink sheen on light mode.
5. **Navbar Offset:** Global navbar is fixed at `height: 74px`. Every top-level page section must account for this offset with adequate top padding (`clamp(5.25rem, 8vh, 7rem)`).

---

## 3. Current Progress & Page Status

This branch (`feat/responsive-pages-update`) contains the latest structural and responsive developments:

| Page | Route | Status | Notes |
|------|-------|--------|-------|
| **Home** | `/` | Complete & Polished | Inquiry optics blueprint background (left fade), Synergy observatory station (right fade), separate Community Wire divider section. Fully responsive. |
| **About** | `/about` | Complete | Archival hero triptych, story media section, core purpose cards, decoded values, and stats grid. |
| **Members** | `/members` | Grounded & Responsive | 60/40 hero layout with mirrored team photo (`/members-hero-img.png`) touching the bottom border. ResponsiveGallery uses DomeGallery on desktop and MobileGallery on phones. |
| **Events** | `/events` | Coming Soon Mode | Clean coming soon layout with animated text-glare sweep; global Navbar and Footer intact. |
| **Merchandise** | `/merch` | Coming Soon Mode | Displays "MERCH COMING SOON..." with text-glare sweep. Full product catalog and checkout logic preserved in codebase. |
| **Blogs** | `/blog` | Coming Soon Mode | Displays "BLOGS COMING SOON..." with text-glare sweep. Full post cards, modal, and newsletter logic preserved. |
| **Recruitment** | `/recruitment`, `/join` | Active / Cleaned | Hero section removed so open roles and application forms display immediately below the navbar. |
| **Contact Us** | `/contact` | Streamlined | Status strip removed. Form, interactive channels, FAQ accordion, and Google Map frame adapted for touchscreens (44px min targets). |
| **Dashboard** | `/dashboard` | Functional | User profile, verification badges, bulletin board, and member administrative panels. |

---

## 4. Vercel Deployment Safety

To prevent accidental deployments or untested previews while collaborating on this branch, Vercel build execution has been configured in [vercel.json](file:///z:/Projects%20Workspace/orbitx/vercel.json):

```json
{
  "ignoreCommand": "if [ \"$VERCEL_GIT_COMMIT_REF\" = \"feat/responsive-pages-update\" ]; then exit 0; else exit 1; fi",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

- When this branch is pushed to GitHub, Vercel runs the `ignoreCommand`.
- The command detects `VERCEL_GIT_COMMIT_REF = "feat/responsive-pages-update"`, exits with `0`, and Vercel automatically skips the build without deploying.
- Only when this branch is merged into `main` (or another deployment branch) will Vercel proceed with building.

---

## 5. Local Setup & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
The server will start on `http://localhost:5173`.

### 3. Verify Build & Types
Always run this before committing:
```bash
npm run build
```
This runs TypeScript checking (`tsc -b`) followed by Vite production bundling. It must pass with 0 errors.

---

## 6. Directory Structure Guide

```
src/
├── app/
│   └── App.tsx                 # Root router, global Navbar, theme provider
├── components/
│   ├── admin/                  # Admin dashboard managers (Events, Merch, Recruitment)
│   ├── auth/                   # ProtectedRoute, AdminRoute
│   ├── blog/                   # Blog cards, post modal, categories
│   ├── checkout/               # Razorpay checkout modal
│   ├── events/                 # Event modal, registration forms
│   ├── gallery/                # DomeGallery (3D spherical), MobileGallery, ResponsiveGallery
│   ├── layout/                 # Navbar, MobileNav, Footer
│   ├── merch/                  # MerchCard, MerchModal, category filters
│   ├── recruitment/            # RoleCard, RoleModal, AlertSubscriptionBox
│   └── ui/                     # SearchInput, FilterDropdown, Toolbar
├── contexts/
│   ├── AuthContext.tsx         # Firebase auth session provider
│   └── ThemeContext.tsx        # Light/Dark view-transition theme switcher
├── pages/
│   ├── about/                  # About page + CSS
│   ├── admin/                  # AdminDashboard + CSS
│   ├── auth/                   # Login, Onboarding, ForgotPassword
│   ├── blog/                   # Blog page (Coming Soon)
│   ├── contact/                # Contact page + inquiry form
│   ├── dashboard/              # User member dashboard
│   ├── events/                 # Events page (Coming Soon)
│   ├── home/                   # Main portal homepage
│   ├── members/                # Members roster page
│   ├── merch/                  # Merchandise page (Coming Soon)
│   └── recruitment/            # Recruitment / Join page
└── services/
    ├── firebase/               # Firestore collections, auth, storage configs
    └── payment/                # Razorpay service integrations
```

---

## 7. Next Steps for Collaborators

1. **Test Responsiveness:** Verify navigation and forms on multiple devices (iOS Safari, Android Chrome, Foldables).
2. **Events & Merch Re-activation:** When live events or merch drops are scheduled, restore the full components from `src/components/events/` and `src/components/merch/` into `Events.tsx` and `Merch.tsx`.
3. **Application Review:** Test recruitment application submission flow in `src/pages/recruitment/` with Firestore emulator or staging environment.
