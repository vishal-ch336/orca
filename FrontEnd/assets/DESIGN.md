---
version: "alpha"
name: "Nexus — Volumetric Interfaces"
description: "Nexus Volumetric Dashboard Section is designed for demonstrating application workflows and interface hierarchy. Key features include clear information density, modular panels, and interface rhythm. It is suitable for product showcases, admin panels, and analytics experiences."
colors:
  primary: "#9FD8BD"
  secondary: "#E2A356"
  tertiary: "#A3D1DF"
  neutral: "#93A096"
  background: "#080C0B"
  surface: "#EEEAE0"
  text-primary: "#EEEAE0"
  text-secondary: "#93A096"
  border: "#1E2A24"
  accent: "#9FD8BD"
  ramps:
    primary:
      50: "#FDF8F1"
      100: "#FAF0E4"
      200: "#F6E2C9"
      300: "#F1D3AE"
      400: "#EABD85"
      500: "#E2A356"
      600: "#C28C4A"
      700: "#9E723C"
      800: "#76552D"
      900: "#4D371D"
    emerald:
      50: "#EDF2F0"
      100: "#DBE5E2"
      200: "#B7CBC5"
      300: "#93B1A8"
      400: "#5D8A7C"
      500: "#1E5C49"
      600: "#1A4F3F"
      700: "#154033"
      800: "#103026"
      900: "#0A1F19"
typography:
  display-lg:
    fontFamily: "Bricolage Grotesque"
    fontSize: "107.122px"
    fontWeight: 230
    lineHeight: "104.98px"
    letterSpacing: "-0.035em"
  display-md:
    fontFamily: "Bricolage Grotesque"
    fontSize: "64px"
    fontWeight: 300
    lineHeight: "72px"
    letterSpacing: "-0.025em"
  body-md:
    fontFamily: "Instrument Sans"
    fontSize: "12.8px"
    fontWeight: 400
    lineHeight: "19.2px"
  label-md:
    fontFamily: "Instrument Sans"
    fontSize: "14.4px"
    fontWeight: 500
    lineHeight: "22.32px"
    letterSpacing: "0.144px"
  mono-sm:
    fontFamily: "JetBrains Mono"
    fontSize: "11px"
    fontWeight: 500
    lineHeight: "16px"
    letterSpacing: "0.08em"
spacing:
  base: "4px"
  scale:
    step-1: "4px"
    step-2: "4.8px"
    step-3: "5.6px"
    step-4: "6.43px"
  padding:
    card: "12px"
    section-sm: "29.6px"
    section-lg: "56px"
  gaps:
    compact: "9.6px"
    relaxed: "17.6px"
radii:
  sm: "4px"
  md: "9px"
  pill: "999px"
shadows:
  glow: "rgba(159, 216, 189, 0.26) 0px 0px 0px 3.84315px"
  card: "rgba(238, 234, 224, 0.25) 0px 8px 30px -10px"
webgl_system:
  renderer: "Three.js WebGLRenderer"
  camera:
    fov: 58
    perspective: true
    depthFade: true
  primitives: "Procedural wireframe contour terrain lines"
  lighting: "Ambient (#0c2b26) + Key rim light (#9fd8bd)"
  motion: "Smooth pointer parallax + slow fluid oscillation"
---

# Nexus — Volumetric Interfaces Design System

## Strategic Principles
1. **Volumetric Density**: Information is organized into hierarchical modular panels with clear data density and rhythmic spacing.
2. **Procedural Aesthetics**: Live WebGL topographic landscapes convey real-time generative capabilities.
3. **Contrast Hierarchy**: Deep obsidian surfaces set the foundation, elevated by soft mint (`#9FD8BD`) and warm amber (`#E2A356`) technical accents.
4. **Micro-Rhythm**: Typography uses ultra-light display weights (`Bricolage Grotesque`, weight 230) balanced with precision geometric sans (`Instrument Sans`) and telemetry monospaces.

## Component Specifications

### 1. Navigation Shell
- Fixed top bar with dark backdrop blur (`backdrop-filter: blur(16px)`).
- Semi-transparent glass pill container.
- Minimal hairline borders (`1px solid rgba(255, 255, 255, 0.08)`).

### 2. Procedural Landscape Canvas
- Background field: Deep cosmic gradient transitioning into terrain contour meshes.
- Contour lines: Elevated heights render with high-luminosity mint (`#9FD8BD`) falling off to dark emerald (`#103026`).
- Interactive pointer drift: Subtly tilts camera azimuth and pitch with damped smoothing.

### 3. Telemetry HUD Overlay
- Floating technical instrumentation panel in top-right corner.
- Monospace key-value readouts for SEED, ELEVATION, and GRID coordinates.
- Mutation action button `↻ NEW SEED [R]` triggering dynamic topological re-generation.
