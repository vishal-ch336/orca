# ORCA — Product Requirements Document (Frontend)
**Marine Ecosystem Reasoning with Collaborative Agents**
*Smart India Hackathon — PS 26176*

---

## 0. Prompt to Paste into Figma Make

> Design and generate a web application called ORCA — an AI-powered marine safety assistant for coastal fisherfolk in Andhra Pradesh, India. The product has two parts: (1) a marketing landing page with a cinematic full-bleed ocean video hero, and (2) a main app with a map-first, chat-driven interface.
>
> **Visual direction**: Deep ocean color palette (navy/teal base tones, coral/amber reserved only for alerts/warnings). Calm, trustworthy, functional tone — this is a safety tool, not a playful consumer app. Single clean sans-serif typeface (Inter or Manrope). Avoid generic light-mode SaaS dashboard look — favor a darker, map-first, immersive feel.
>
> **Landing Page**: Full-bleed hero section with looping ocean video background (aerial shot moving from sandy shoreline into open turquoise water, small traditional fishing boat visible in the distance). Dark gradient overlay for text legibility. Hero headline + subheadline introducing ORCA, primary CTA button "Launch ORCA". Below the hero: a "How it works" section, a section showcasing 8 example queries users can ask, an explainability/trust section, and a footer.
>
> **Main App Layout**: Map view is the dominant visual element, taking up most of the screen. A collapsible chat panel sits alongside it (right or left side on desktop, stacks below the map on mobile). Include:
> - A chat thread with message bubbles that can contain plain text, an inline map preview card, a data card, or an alert banner
> - A row of tappable quick-action query chips above the chat input
> - A base map centered on the Andhra Pradesh coastline with colored zone polygons/markers (Potential Fishing Zones), toggleable hazard overlays (cyclone cone, high-wave zones, lightning zones), toggleable boundary lines (IMBL/EEZ/MPA), a route polyline, and a user location pin
> - A popup info card that appears when a map marker/zone is clicked, showing SST, chlorophyll, distance, and valid-until date
> - A compact "Conditions" card showing wind, wave height, sea state, temperature, with a clear Safe/Caution/Unsafe verdict badge (color + icon) and expandable reasoning text underneath
> - An alerts panel/feed showing active alerts with type, severity, affected area, and valid-until date, plus a high-severity push-style banner
> - An expandable "Evidence" drawer attached to each chat response, listing the data sources used (source name, type, timestamp)
> - A location input control supporting browser geolocation, manual lat/lon, or place-name entry
>
> Generate responsive layouts for both desktop and mobile. Prioritize clarity and legibility of map overlays and the Safe/Caution/Unsafe verdict badge above decorative styling.

---

## 1. Overview

ORCA is an AI-powered conversational assistant that helps coastal fisherfolk and marine stakeholders in Andhra Pradesh get real-time, explainable guidance on Potential Fishing Zones (PFZ), weather/sea conditions, hazard alerts, and maritime boundary safety. The frontend is a **map-first, chat-driven web application** with a strong emphasis on **explainability** (showing users exactly what data informed a recommendation).

This document defines the product's screens, components, data behavior, and visual direction for frontend design and build (in Figma Make), followed by a separate landing page with a scroll-based cinematic video hero.

---

## 2. Goals

- Make complex marine/weather/geospatial data instantly understandable to non-technical users (fisherfolk, first responders).
- Prioritize **trust and explainability** — every AI response should be traceable to a data source.
- Deliver a demo-ready, visually distinctive experience (ocean-themed, not a generic dashboard).
- Support multilingual input without requiring a language switcher UI.

---

## 3. Target Users

- Coastal fisherfolk (primary) — need quick, simple safety/PFZ guidance, often on mobile.
- Coast guard / disaster response teams — need hazard + boundary awareness.
- Hackathon judges (secondary but critical) — need to see explainability and data-richness clearly in a short demo.

---

## 4. Information Architecture

1. **Landing Page** (marketing/intro, cinematic ocean video hero)
2. **Main App**
   - Chat Interface (left panel or primary view on mobile)
   - Map View (core, dominant screen)
   - Conditions/Safety Card
   - Alerts Panel
   - Evidence/Explainability Drawer
   - Location Input
   - Quick Action Query Chips

---

## 5. Screens & Components

### 5.1 Landing Page
- Full-bleed looping cinematic ocean video background (shore → open water, traditional fishing boat in distance)
- Dark gradient overlay for text legibility
- Hero headline + subheadline introducing ORCA
- Primary CTA: "Launch ORCA" → routes to main app
- Scroll-driven reveal: as user scrolls, background video motion is tied to scroll position (see Section 7 for animation prompt), transitioning into a features/how-it-works section
- Sections below hero: what ORCA does, the 8 sample query types, explainability promise, footer

### 5.2 Chat Interface
- Multi-turn conversation thread, standard chat bubble UI
- Text input, auto-detects language (no UI switcher needed)
- Assistant responses can carry attachments:
  - Plain text
  - Map payload (renders inline mini-map or triggers main map update)
  - Data card (e.g. conditions summary)
  - Alert banner
- Each response has an attached **Evidence Drawer** trigger (see 5.5)
- Quick Action Chips row above input (Section 5.7)

### 5.3 Map View (Core Screen)
- Base map centered on Andhra Pradesh coastline
- **PFZ Layer**: zone markers/polygons from INCOIS data, color-coded by potential strength
- **Hazard Layer** (toggleable): cyclone cone of uncertainty, high-wave zones, lightning strike zones
- **Boundary Layer** (toggleable): IMBL / EEZ / MPA lines
- **Route Line**: polyline from origin to destination avoiding hazards (renders only if present)
- **User Location Pin**
- Clicking any marker/zone → info card popup: SST, chlorophyll, distance, valid-until date
- Layer toggle control (checkboxes/switches)

### 5.4 Conditions/Safety Card
- Compact card: wind speed/direction, wave height, sea state, temperature
- Verdict badge: **Safe / Caution / Unsafe** (color + icon, not color alone)
- Expandable reasoning text under the badge
- Source + last-updated timestamp (small, always visible)

### 5.5 Alerts Panel
- Feed of active alerts relevant to user's region/location
- Each alert: type (cyclone/lightning/high-wave/boundary), severity, affected area, valid-until
- High-severity/imminent alerts render as a push-style banner (e.g. "You are approaching the IMBL")

### 5.6 Evidence/Explainability Drawer
- Expandable panel attached to each chat response
- Lists each data source used: type (IMD bulletin, INCOIS advisory, boundary layer), timestamp
- Should feel lightweight and always accessible — this is the app's core trust-building feature

### 5.7 Location Input
- Three modes: browser geolocation, manual lat/lon entry, place-name search
- Feeds `user_location` state used across map, conditions, and alerts

### 5.8 Quick Action Query Chips
- Horizontal scrollable row of tappable canned queries (matching the 8 sample PS queries)
- Pre-fills chat input on tap — used for smooth demo flow

---

## 6. Visual Direction

- **Theme**: deep ocean palette — navy/teal base tones, coral/amber accents reserved for alerts and warnings only
- **Layout**: map-first — map is the dominant visual element in the main app; chat sits alongside as a collapsible panel (stacks below map on mobile)
- **Typography**: single clean sans-serif (Inter or Manrope), avoid default system fonts
- **Accessibility**: verdict badges and hazard layers must use icon + pattern differentiation, not color alone
- **Tone**: calm, trustworthy, functional — avoid overly playful or "startup SaaS" styling; this is a safety tool

---

## 7. Landing Page Scroll Animation — Prompt for Build

Use the following as a build prompt/spec (for Figma Make or a frontend dev implementing it in code):

> Build a full-bleed hero section with a looping ocean video background (aerial shot transitioning from a sandy shoreline into open turquoise water, with a small traditional fishing boat visible in the distance). As the user scrolls down from the top of the page, bind the video's visual progress (or a sequence of cross-faded video/image frames) to scroll position, so scrolling feels like the viewer is moving forward from the shore out into open ocean. The hero headline and CTA should fade out within the first ~20% of scroll, revealing the video fully, before transitioning into the next content section (feature highlights) with a smooth crossfade or slide. Motion should be smooth, continuous, and performant on both desktop and mobile — avoid janky scroll jumps. Keep overall page scroll length for this effect between 150–250vh so it doesn't overstay its welcome.

**Recommended implementation approach (for whoever builds it in code, e.g. via Claude Code):**
- Use **GSAP + ScrollTrigger** (`scrub` mode) to bind `video.currentTime` to scroll progress, OR
- If using a short looping video instead of scroll-scrubbing, use **Framer Motion** or **GSAP** for opacity/parallax transitions layered on top of the looping video
- Lazy-load and compress the video (WebM + MP4 fallback) to avoid landing page performance issues

---

## 7.1 Landing Page Copy

**Hero headline:**
> Know the Sea Before You Sail

**Hero subheadline:**
> ORCA gives Andhra Pradesh's fisherfolk real-time, explainable guidance on fishing zones, weather, and hazards — in your own language.

**Primary CTA:** Launch ORCA

**How it works — section heading:**
> Ask a question. Get a clear answer, backed by real data.

**How it works — three steps:**
1. **Ask in your language** — Type or speak your question, no matter which language you're comfortable in.
2. **See it on the map** — Fishing zones, hazards, and boundaries shown clearly, updated in real time.
3. **Know why** — Every answer comes with the exact data and sources behind it, so you can trust the guidance.

**Sample queries section — heading:**
> Try asking ORCA things like:

**Sample query chips (placeholder — replace with the 8 from the PS):**
- "Where are the best fishing zones near me today?"
- "Is it safe to go out to sea right now?"
- "Show me the nearest PFZ"
- "Are there any cyclone alerts nearby?"
- "How far am I from the IMBL?"
- "What's the wave height near my location?"
- "Plan a safe route to the fishing zone"
- "Any lightning warnings for today?"

**Explainability/trust section — heading:**
> Every answer, fully explained.

**Explainability body:**
> ORCA never gives a recommendation without showing its work. Every response includes the exact weather bulletins, satellite advisories, and boundary data it used — so you always know what you're trusting.

**Footer tagline:**
> Built for the fisherfolk of Andhra Pradesh. Smart India Hackathon 2026.

---

## 8. Frontend Tech Stack

| Layer | Choice |
|---|---|
| Framework | React + Vite |
| Styling | Tailwind CSS |
| Map | MapLibre GL JS |
| State management | Zustand |
| Charts (data cards) | Recharts |
| Scroll/landing animation | GSAP + ScrollTrigger (or Framer Motion) |
| Markdown rendering (chat) | react-markdown |
| Real-time alerts | WebSocket or polling (per backend team decision) |

---

## 9. Data Contracts (Summary)

```json
// Chat message
{
  "role": "user | assistant",
  "text": "string",
  "attachments": [
    { "type": "map_payload | data_card | alert_banner", "payload": {} }
  ],
  "evidence": [
    { "source": "INCOIS | IMD | Boundary Layer", "type": "string", "timestamp": "ISO8601" }
  ]
}

// Conditions card
{
  "wind_speed": "number", "wind_direction": "string",
  "wave_height": "number", "sea_state": "string", "temperature": "number",
  "verdict": "Safe | Caution | Unsafe", "reasoning": "string",
  "source": "string", "last_updated": "ISO8601"
}

// Alert
{
  "type": "cyclone | lightning | high-wave | boundary",
  "severity": "low | medium | high",
  "affected_area": "string", "valid_until": "ISO8601"
}
```

---

## 10. Build Priority (Suggested)

1. Chat shell with mock data + attachments
2. Evidence drawer (cheap, high explainability payoff)
3. Quick action chips
4. Conditions/Safety card
5. Map view + PFZ layer
6. Hazard/boundary layers + route line
7. Alerts panel + banner
8. Location input
9. Landing page + scroll video hero

---

*Prepared for frontend design handoff — Figma Make / React implementation.*
