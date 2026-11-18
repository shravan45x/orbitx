# Agent Instructions

See root [AGENT_INSTRUCTIONS.md](../../AGENT_INSTRUCTIONS.md) and [docs.md](../../docs.md) for full architecture and design system constraints.

### Key Rules
1. **Flat Design:** Strict 4px radius (`--radius: 4px`), NO box shadows, NO hover scaling/movement.
2. **Fixed Navbar:** Global navbar is fixed at 74px height. Every page section must have top padding.
3. **Themes:** Supports dark and light themes via CSS variables (`[data-theme="light"]`). Never hardcode white text colors in light mode.
4. **Vercel:** Automated builds on `main` are paused via `ignoreCommand` to prevent unwanted deployments.
