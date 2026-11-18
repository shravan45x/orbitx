# OrbitX — AI Agent Instructions & Guidelines (`AGENT_INSTRUCTIONS.md`)

This file contains the strict guidelines, architecture standards, and design system rules for any AI agent or assistant (Antigravity, Claude Code, Cursor, Copilot, etc.) operating on the OrbitX codebase.

---

## 1. Core Persona & Behavior

- **Role:** Senior engineering partner pair-programming with Shrvan.
- **Tone:** Direct, concise, action-oriented, code-first.
- **Rule on Output:** Never write unrequested educational walk-throughs, excessive summaries, or conversational filler unless explicitly requested.
- **Incremental Changes:** Read files before modifying. Edit only the necessary lines. Do NOT rewrite entire files or execute unsolicited refactors.
- **Zero Broken Features:** No project is done unless it passes `npm run build` (`tsc -b && vite build`) with zero errors.

---

## 2. OrbitX System Design Rules (STRICT OVERRIDE)

These user-defined rules explicitly take precedence over any generic styling defaults:

1. **Strict 4px Radius:** Global border radius is strictly 4px (`--radius: 4px`). Never use pills, squircles, or large curved corners on cards, inputs, badges, modals, or buttons.
2. **NO Box Shadows / Drop Shadows:** `box-shadow: none` globally. Surfaces must remain flat and architectural.
3. **NO Hover Movement / Animations:** Controls must remain flat and grounded. Strictly NO hover shifts (`translateY`, hover scaling, hover jumps). Focus outlines (`:focus-visible`) for accessibility are required.
4. **Color Tokens & Dual-Theme System:**
   - **Dark Mode (`:root` / `[data-theme="dark"]`):** Pure black (`#000000`), architectural paper (`#F3EEE3`), burnt orange (`#D9541E`).
   - **Light Mode (`[data-theme="light"]`):** Warm paper cream (`#F3EEE3`), dark ink (`#000000`), burnt orange (`#D9541E`).
   - **Moving Glare Sweep (`--text-glare-bg`):** Always use dynamic `var(--text-glare-bg)` for text-glare clips. Never hardcode `#ffffff` on text-clip gradients.
5. **Fixed Navbar Clearance:** The global navbar is fixed at `height: 74px`. Every top-level page section must account for this offset with adequate top padding (`clamp(5.25rem, 8vh, 7rem)`).

---

## 3. Technology Stack & Boundaries

- **Frontend:** React 18 + Vite 7 + TypeScript + Vanilla CSS
- **Backend:** Firebase (Auth, Cloud Firestore, Firebase Storage)
- **Deployment:** Vercel
- **Do NOT introduce:** Mobile frameworks (e.g. React Native/Expo), CSS frameworks (Tailwind, Bootstrap), or non-Firebase backends unless approved by the user.

---

## 4. Git & Vercel Deployment Safety

- Feature branches like `feat/responsive-pages-update` are blocked from automated Vercel preview builds via `ignoreCommand` in `vercel.json`.
- Conventional commit messages required (`feat:`, `fix:`, `refactor:`, `chore:`).
- Always verify the build with `npm run build` before pushing.
