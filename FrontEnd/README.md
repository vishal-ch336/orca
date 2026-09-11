# ORCA Frontend — Marine Ecosystem Safety Portal

> **Marine Ecosystem Reasoning with Collaborative Agents (ORCA)**  
> AI-Powered Marine Safety, Geospatial Intelligence, and Potential Fishing Zone (PFZ) Advisory Web Application for Coastal Andhra Pradesh, India.

---

## Overview

The **ORCA Frontend** is a map-first, explainability-focused web application designed to deliver real-time marine safety advisories, meteorological feeds, and Potential Fishing Zone (PFZ) insights to coastal fisherfolk, maritime authorities, and disaster response teams.

Built with pure Vanilla JavaScript, WebGL, and custom CSS, the application delivers instant load times and responsive performance without requiring heavy JavaScript framework build pipelines.

---

## Key Features

### 1. 🗺️ Interactive Marine Geospatial Navigation Map (`js/orca-map.js`)
- **Multi-Source Cartography**: Powered by Leaflet with Google Maps tile layers (Roadmap, Satellite Imagery, and Terrain).
- **Potential Fishing Zones (PFZ)**: Visualizes oceanographic zones with Sea Surface Temperature (SST), Chlorophyll-a density, catch abundance predictions, and distance-to-shore.
- **Hazard Overlays**: Toggleable real-time warnings for cyclone forecast cones, high swell waves, and lightning strike danger corridors.
- **Maritime Boundary Safety**: Outlines the International Maritime Boundary Line (IMBL), Exclusive Economic Zone (EEZ), and Marine Protected Areas (MPA) to prevent accidental border transgressions.
- **Port Selector**: Quick-jump coordinates and harbor metrics for Visakhapatnam, Kakinada, Machilipatnam, Krishnapatnam, Nizampatnam, and Bhavanapadu.

### 2. 🤖 Bilingual AI Conversational Assistant (`js/orca-chat.js`)
- **Native Bilingual Support**: Complete language separation between **English** and **Telugu (తెలుగు)** with typography optimized for Anek Telugu.
- **Quick-Action Chips**: One-tap queries for rapid field access (*"Where are the best fishing zones near me today?"*, *"Is it safe to go out to sea right now?"*, *"Show cyclone hazard zones"*).
- **Safety Verdict Badges**: Color-coded and icon-supported status cards (**Safe** / **Caution** / **Unsafe**).
- **Explainability & Evidence Drawer**: Every advisory is backed by verifiable data attribution citing INCOIS (Oceansat-3 / AVHRR), IMD Coastal Bulletins, and Fishery Survey of India (FSI).

### 3. 🌊 Volumetric WebGL Ocean Simulator (`js/landscape.js`)
- Full-bleed WebGL canvas wave simulation that renders responsive, dynamic ocean terrain in the background.

### 4. 🚨 Real-Time Alerts & Harbor Conditions
- Live telemetry for wind speed (knots / km/h), swell height (meters), sea temperature (°C), and tide cycles.
- Categorized alert feed with severity filters (Advisory, Caution, Emergency).

---

## Directory Structure

```
FrontEnd/
├── assets/                     # Static icons, sound effects, and imagery
├── components/                 # Reusable UI component modules & configs
├── js/                         # Application logic & controllers
│   ├── orca-app.js             # Main controller, view router, and GPS sync
│   ├── orca-map.js             # Leaflet + Google Maps geospatial GIS engine
│   ├── orca-chat.js            # AI chat manager, verdict engine & evidence drawers
│   ├── orca-i18n.js            # English & Telugu translation dictionary
│   ├── landscape.js            # WebGL ocean shader terrain renderer
│   ├── morphicons.js           # Dynamic SVG icon morphing transitions
│   ├── leaflet.js              # Bundled Leaflet geospatial library
│   └── telemetry.js            # Harbor telemetry & condition handlers
├── styles/                     # CSS stylesheets & theme system
│   ├── orca.css                # Primary design system (glassmorphism, layout, responsive)
│   ├── leaflet.css             # Leaflet GIS map stylesheet
│   └── main.css                # Base typography and utility classes
├── index.html                  # Main multi-view application portal
├── studio.html                 # UI preview & interactive playground
├── serve.js                    # Zero-dependency local Node.js web server
├── tsconfig.json               # JavaScript/TypeScript configuration
└── package.json                # Project scripts and metadata
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher)

### Installation & Running Locally

1. Open your terminal and navigate to the `FrontEnd/` directory:
   ```bash
   cd FrontEnd
   ```

2. Start the local development server:
   ```bash
   npm run dev
   # or
   node serve.js
   ```

3. The server will start and automatically open your default browser at:
   ```
   http://localhost:3000/
   ```

> [!NOTE]
> If port `3000` is already in use by another application, `serve.js` will automatically detect the conflict and increment to the next available port (e.g., `3001`).

---

## Available Views & Navigation

The application uses an integrated view controller (`window.switchView`) to switch between five main modes:

| View Tab | Description |
| :--- | :--- |
| **Overview** | Landing presentation with cinematic hero, feature showcases, and system capabilities. |
| **AI Chatbot** | Conversational assistant with quick prompts, verdict badges, and evidence citations. |
| **Marine Map** | Full-screen Leaflet geospatial map with PFZ zones, hazard overlays, and boundary lines. |
| **Alerts** | Filterable feed of active maritime advisories, wave warnings, and cyclone bulletins. |
| **Evidences** | Deep-dive panel displaying sensor sources (INCOIS, IMD, FSI) and satellite telemetry. |

---

## Technology Stack

- **Markup & Structure**: Semantic HTML5 with localized `data-i18n` attributes.
- **Styling**: Vanilla CSS3 (Custom Properties, Glassmorphism, CSS Grid, Flexbox, Mobile-responsive media queries).
- **Mapping Engine**: Leaflet.js integrating Google Maps Tile Cartography (Roadmap, Satellite, Terrain).
- **Graphics Engine**: WebGL Shader / Canvas for procedural volumetric ocean wave rendering.
- **Typography**: 
  - *Anek Telugu* — Native Telugu script support
  - *Bricolage Grotesque* & *Instrument Sans* — Headings & UI elements
  - *JetBrains Mono* — Geospatial coordinates and technical telemetry
- **Development Server**: Built-in Node.js HTTP server (`serve.js`) with zero external runtime dependencies.

---

## Internationalization (i18n)

The application supports real-time switching between English and Telugu without page reload:
- Toggle button located in the top navigation bar (`EN` / `తెలుగు`).
- Managed by `js/orca-i18n.js` via the `OrcaI18n.setLanguage('en' | 'te')` controller.
- Chat responses dynamically load pure English or pure Telugu payloads with localized terminology.
