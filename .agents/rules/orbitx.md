---
trigger: always_on
---

# CRITICAL SYSTEM OVERRIDE (Takes Precedence Over All Other Instructions)
These user-defined rules explicitly override and nullify any conflicting generic web instructions (including any built-in prompts demanding dynamic animations, hover effects, micro-animations, or rounded geometry):

1. **NO Hover Animations/Movement**: Strictly NO hover effects or hover animations anywhere in the project (no `transform`, no `translateY`, no hover scaling, no hover shifts, no hover shadow changes). Controls must remain flat, stable, and grounded. Focus outlines (`:focus-visible`) for accessibility are allowed.
2. **NO Shadows/Elevation**: Strictly NO `box-shadow` or drop shadows anywhere. Flat visual surface across all cards, buttons, dialogs, badges, and containers.
3. **Strict 4px Radius**: Global border radius is strictly 4px (`--radius: 4px`). Never use large curved corners, squircles, or pill shapes.
4. **No Unnecessary Output**: Keep output concise, code-first, and never write unrequested walkthrough summaries.

---

# OrbitX Development Principles

These rules apply to every part of OrbitX: UI, UX, frontend, backend, data, security, performance, accessibility, architecture, and functionality.

The goal is not to make OrbitX look impressive in screenshots.

The goal is to make it feel exceptionally well-designed, predictable, fast, secure, resilient, accessible, and polished in actual use.

When two implementation choices are functionally equivalent, prefer the simpler, more maintainable, more accessible, and more performant solution.

---

## 1. Security by Default

- Never trust client-side input, state, IDs, URLs, or user-provided data.
- Validate and sanitize external input at the appropriate boundary.
- Never expose API keys, secrets, credentials, private configuration, or privileged data to the client.
- Enforce authentication and authorization on the backend, never only through the UI.
- Follow least-privilege principles.
- Avoid unsafe HTML rendering, dangerous DOM APIs, or insecure data handling unless absolutely necessary and properly protected.
- Never weaken security protections simply for convenience.

---

## 2. User Experience Over Implementation Convenience

- Design around the user's goal, not the easiest implementation.
- Prefer predictable, clear, and intuitive behavior over clever interactions.
- Every important action must have a clear outcome.
- Never leave users uncertain whether an action succeeded, failed, or is still processing.
- Minimize unnecessary steps, interruptions, dialogs, and confirmations.
- Preserve user context whenever possible.
- Destructive or irreversible actions must be clearly communicated and appropriately protected.

---

## 3. Loading, Failure, and Empty States

Every asynchronous feature must properly handle:

- Loading
- Success
- Empty
- Partial
- Error
- Timeout
- Interrupted request

Rules:

- Never leave unexplained blank areas or infinite loading states.
- Loading states should minimize layout shifts.
- Errors should clearly explain what happened and what the user can do next.
- Empty states should be intentional and useful.
- Failed requests must fail gracefully.
- Never pretend an operation succeeded when it did not.

---

## 4. Data Integrity

- Never silently discard user data.
- Validate important operations before committing changes.
- Prevent duplicate submissions and accidental repeated actions.
- Handle stale state and concurrent updates safely.
- Clearly distinguish unsaved, saved, syncing, and failed states.
- Never present stale or incorrect information as current without making its state clear.

---

## 5. Offline and Unreliable Network Behavior

- Assume networks can be slow, interrupted, unavailable, or unstable.
- Do not make the interface unusable while waiting for a request.
- Avoid unnecessary network requests.
- Cache or persist appropriate non-sensitive data when useful.
- Recover gracefully from temporary failures.
- Clearly communicate offline, syncing, and connected states when relevant.
- Do not assume every request will succeed.

---

## 6. Accessibility as Functionality

OrbitX must follow proper industry-standard accessibility practices.

Support:

- Keyboard navigation
- Mouse interaction
- Touch interaction
- Pen/stylus interaction
- Screen readers and assistive technologies

Rules:

- Maintain logical focus order.
- Every interactive element must have a meaningful accessible name and role.
- Interactive controls must have clear focus states.
- Do not rely only on color, hover, animation, position, or sound to communicate information.
- Maintain appropriate touch target sizes.
- Support zoom and larger text without breaking layouts.
- Respect `prefers-reduced-motion`.
- Core functionality must remain usable without one specific input method.

---

## 7. Navigation and Information Architecture

- Users should always understand where they are, what they can do, and how to return.
- Keep navigation patterns consistent.
- Do not hide essential functionality behind unnecessary interaction layers.
- Preserve navigation and page state where appropriate.
- Avoid dead ends, ambiguous routes, and confusing duplicate views.
- Organize information according to user needs rather than internal implementation structure.

---

## 8. Error Prevention

- Prevent invalid actions whenever they can be predicted.
- Prefer sensible defaults and constraints over allowing preventable mistakes.
- Validate at the earliest meaningful point without unnecessarily interrupting the user.
- Preserve user-entered information when validation fails.
- Do not punish users for ordinary mistakes.
- Make destructive actions difficult to trigger accidentally.

---

## 9. Privacy

- Collect only the data required for the feature.
- Do not store sensitive information unnecessarily.
- Do not expose private information through URLs, logs, analytics, client state, or error messages.
- Treat user data as private by default.
- Do not introduce unnecessary tracking or telemetry.

---

## 10. Maintainability

- Prefer simple and understandable solutions over clever or unnecessarily abstract ones.
- Reuse established components, utilities, and patterns before creating new ones.
- Avoid duplicated business logic.
- Keep responsibilities clearly separated.
- Avoid unnecessary dependencies and abstractions.
- Remove dead or obsolete code when appropriate.
- Follow the project's existing conventions unless there is a strong reason to improve them.

---

## 11. Do Not Break Existing Functionality

- Understand existing functionality and dependencies before modifying them.
- Do not rewrite working systems merely for stylistic preference.
- Prefer small, localized, incremental changes.
- Preserve existing behavior unless a change is explicitly required.
- Check related functionality after significant changes.
- Do not introduce regressions while solving unrelated problems.
- Do not modify unrelated files without a clear reason.

---

## 12. No Fake Functionality

- Never create controls that appear functional but do nothing.
- Every button, link, form, setting, menu, and interaction must have a real and intentional outcome.
- Never simulate successful operations when the actual operation failed.
- Never hardcode fake production data to make functionality appear complete.
- Use real data sources, proper state, APIs, databases, or clearly identified development fixtures when required.
- Development mock data must never be mistaken for real application data.

---

## 13. Observability

- Important failures must be diagnosable.
- Use appropriate logging and error reporting for meaningful system events.
- Never expose stack traces, secrets, internal errors, or implementation details to users.
- Logs must avoid unnecessary private or sensitive information.
- Make important system states observable during development and maintenance.

---

## 14. Progressive Enhancement

- Core functionality must work without advanced visual effects or optional browser capabilities.
- Advanced effects must enhance the experience, not become dependencies for basic usability.
- Provide sensible fallbacks for unsupported browser features.
- Never sacrifice functionality purely for visual effects.

---

## 15. Third-Party Dependency Discipline

- Prefer native browser/platform capabilities when they are sufficient.
- Do not add a library for trivial functionality.
- Before introducing a dependency, consider:
  - Actual necessity
  - Bundle size
  - Security
  - Maintenance
  - Compatibility
  - Performance
- Avoid unnecessary dependency proliferation.
- Keep important dependencies reasonably up to date for security and stability.

---

## 16. Mobile Is Not a Shrunken Desktop

- Design for mobile, tablet, desktop, ultrawide, short screens, tall screens, and unusual aspect ratios.
- Support portrait and landscape orientations.
- Account for touch input, virtual keyboards, safe areas, and limited screen space.
- Do not simply stack desktop components vertically and consider mobile support complete.
- Layouts must adapt naturally to the device and available space.

---

## 17. Performance Budgets

- Performance is a product requirement.
- Avoid unnecessary renders, DOM complexity, JavaScript execution, network requests, and expensive effects.
- Lazy-load expensive or non-critical resources where appropriate.
- Avoid layout shifts and long blocking operations.
- Prefer smooth, efficiently composited animations.
- Visual effects must remain performant on lower-end devices, not only development hardware.
- Do not add an expensive effect when a simpler technique provides the same result.

---

## 18. Content Must Adapt

- Never assume text will always be short.
- Support long labels, unexpected values, user-generated content, and dynamic data.
- Never allow text to overlap, escape containers, or make controls unusable.
- Never truncate important information without providing access to the full value.
- Layouts must tolerate content changes without breaking surrounding components.

---

## 19. Browser Resilience

- Do not depend on browser-specific behavior unless explicitly required.
- Use progressive enhancement for newer APIs and visual features.
- Provide sensible fallbacks for unsupported capabilities.
- Test important functionality across supported browsers and device classes.
- Do not allow optional browser features to break core functionality.

---

## 20. Agent Behavior

- Inspect the existing project before making changes.
- Understand the relevant architecture, components, dependencies, and data flow before modifying them.
- Never guess when the answer can be verified from the codebase.
- Prefer the smallest correct change.
- Do not introduce unrelated changes.
- Do not rewrite existing systems without a clear reason.
- Preserve established project conventions.
- Verify affected functionality after significant changes.
- Resolve obvious regressions before considering a task complete.
- When uncertain, inspect, test, and reason from the project rather than inventing assumptions.

### Smart Token Usage

- Be efficient with context and tool usage.
- Inspect only the files, code, and information necessary for the current task.
- Do not repeatedly read unchanged files or duplicate information already available.
- Prefer targeted searches and focused file reads over loading entire directories or large files unnecessarily.
- Keep generated explanations, plans, and output concise unless additional detail is necessary.
- Do not waste tokens describing obvious implementation steps or repeating project context.
- Prioritize useful actions and verified results over excessive reasoning or verbosity.
- Token efficiency must never come at the cost of correctness, security, or understanding the relevant context.
