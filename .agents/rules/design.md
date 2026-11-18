---
version: alpha
name: Kononenko Architectural Bureau
description: A minimalist architectural system with restrained contrast, expansive hero typography, and editorial calm.
colors:
  primary: "#000000"
  secondary: "#6B7280"
  tertiary: "#E5E7EB"
  neutral: "#FFFFFF"
  surface: "#FFFFFF"
  on-surface: "#000000"
  error: "#B91C1C"
  border: "#E5E7EB"
typography:
  headline-display:
    fontFamily: N
    fontSize: 175px
    fontWeight: 400
    lineHeight: 210px
    letterSpacing: -2.4px
  headline-lg:
    fontFamily: N
    fontSize: 96px
    fontWeight: 400
    lineHeight: 122.5px
    letterSpacing: -5.25px
  headline-md:
    fontFamily: H
    fontSize: 53px
    fontWeight: 400
    lineHeight: 64px
    letterSpacing: -0.32px
  headline-sm:
    fontFamily: N
    fontSize: 29px
    fontWeight: 400
    lineHeight: 35px
    letterSpacing: 0px
  body-lg:
    fontFamily: N
    fontSize: 18px
    fontWeight: 400
    lineHeight: 28px
    letterSpacing: -0.16px
  body-md:
    fontFamily: N
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: -0.32px
  body-sm:
    fontFamily: N
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: -0.16px
  label-lg:
    fontFamily: N
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
    letterSpacing: 0px
  label-md:
    fontFamily: N
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    letterSpacing: 0px
  label-sm:
    fontFamily: N
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
    letterSpacing: 0.04em
rounded:
  none: 0px
  sm: 4px
  md: 8px
  lg: 12px
  xl: 16px
  full: 9999px
spacing:
  xs: 10px
  sm: 24px
  md: 44px
  lg: 120px
  xl: 150px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    size: "120px"
    height: "40px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.sm}"
    padding: "8px 16px"
    size: "120px"
    height: "40px"
  button-link:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.none}"
    padding: "0px"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "16px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    padding: "12px 14px"
  chip:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: "6px 10px"
---

# Kononenko Architectural Bureau

## Overview
Kononenko Architectural Bureau feels quiet, precise, and gallery-like, with a strong editorial presence and very little visual noise. The experience is spacious and confident, leaning professional rather than playful. Large typography and restrained black-and-white contrast let the architecture imagery do most of the storytelling.

## Colors
- **Primary (#000000):** Deep ink used for headlines, navigation, body text, button fills, and graphic emphasis. It creates the system’s sharpest contrast and most authoritative moments.
- **Surface (#FFFFFF):** Clean white used for page surfaces, cards, and negative space. It keeps the interface feeling light and architectural.
- **On-surface (#000000):** Primary reading color on white surfaces, ensuring clear hierarchy and strong legibility.
- **Secondary (#6B7280):** A muted gray for supportive text and subtle UI states when a softer note is needed without breaking the monochrome tone.
- **Tertiary (#E5E7EB):** Pale structural gray used for borders and separators, giving components definition without visual heaviness.
- **Border (#E5E7EB):** The standard line color for cards and thin structural rules.
- **Error (#B91C1C):** Reserved for validation or destructive states; it should be used sparingly so the system remains calm.

## Typography
The system uses two custom faces: N for most interface and display text, and H for the serif editorial accent. N carries the brand’s modern, minimal tone across navigation, body copy, and the largest headlines. H is reserved for a more expressive headline tier, adding an architectural, publication-like contrast.

Headlines are highly scaled and intentionally tracked tight. `headline-display` and `headline-lg` are the signature modes, with large sizes and negative letter spacing that create dramatic, poster-like impact. `headline-md` uses the serif face for a refined, image-led hierarchy, while `headline-sm` provides a smaller but still elegant display option.

Body text stays compact and measured, with `body-md` as the default reading style. Labels and navigation use the same family with restrained sizing and minimal decoration. Uppercase treatment is not dominant in the source; instead, emphasis comes from size, spacing, and placement.

## Layout
The layout feels full-bleed and immersive, especially in hero treatments where imagery spans the entire viewport. Rather than a dense grid, the composition relies on generous open space and careful edge alignment. The spacing scale moves from compact `xs` and `sm` values to very large `lg` and `xl` sections, reinforcing an architectural sense of scale.

Padding should stay restrained in cards and controls, while major sections should breathe. Align content to strong left and right edges, and preserve wide margins around editorial elements. Container widths can be generous, but never clutter the frame with too many competing blocks.

## Elevation & Depth
The system is intentionally flat. Shadows are effectively absent, so hierarchy is created through scale, contrast, cropping, and thin borders rather than depth effects. Cards use a subtle `border` tone and white fill to separate them from the background without introducing softness or weight.

Because depth is minimal, spacing and typography must do the heavy lifting. Use tonal layers sparingly and avoid anything that looks glossy, raised, or tactile.

## Shapes
The shape language is understated and slightly softened. `rounded.sm` at 4px is the default for interactive elements, while `rounded.md` at 8px can be used for cards and contained surfaces. Larger radii should remain rare so the system keeps its precise, architectural edge.

Overall, shapes should feel crisp, geometric, and disciplined. Avoid highly curved or playful forms unless the component specifically calls for a full pill treatment like chips.

## Components
Buttons should be simple and utility-driven. `button-primary` uses a black fill, white text, 4px radius, and compact 8px 16px padding for strong calls to action. `button-secondary` keeps the same dimensions but switches to a transparent fill with black border and text, making it appropriate for less dominant actions. `button-link` is minimal, with no border, no fill, and underlined text for navigation-like actions. All buttons should remain 40px tall and feel understated rather than promotional.

Cards should be white, bordered, and lightly padded. Use `card` for content groupings that need structure without visual emphasis. Keep shadows off and rely on the `border` token plus `rounded.md` to preserve the calm, architectural tone.

Inputs should follow the same restrained logic as cards: white background, black text, subtle border, and compact padding. Focus states should be clear but not flashy; prefer strong outline or border changes rather than glow effects. Chips can be pill-shaped with `rounded.full`, light surfaces, and small label typography for filters or metadata.

Navigation links should read like editorial text rather than buttons. Keep them thin, black, and minimally decorated except for underline or active-state emphasis. Lists, breadcrumbs, and metadata rows should preserve generous rhythm and strong alignment.

## Do's and Don'ts
- Do keep contrast high and the palette mostly monochrome.
- Do use oversized typography for hero and section hierarchy.
- Do let whitespace and alignment create structure instead of shadows.
- Do use 4px to 8px radii for most UI, reserving pills for chips only.
- Don't introduce bright accent colors unless they are truly necessary.
- Don't add heavy shadows, gradients, or glossy surfaces.
- Don't crowd the layout; keep sections open and editorial.
- Don't make buttons or controls look playful, rounded, or decorative.