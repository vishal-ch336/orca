/**
 * ORCA — Morphicons: Animated Polymorphic Vector Icon System
 * Replaces unicode emojis and generic symbols with fluid, futuristic vector icons.
 * Nexus Volumetric Theme: Deep ocean aesthetics with seafoam, cyan, amber, and coral accents.
 */

(function () {
  const ICONS = {
    // 1. Home / Station (Nav Tab 1)
    home: `
      <svg class="morphicon morphicon-home" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path class="morph-roof" d="M3 10.5L12 3l9 7.5v9.5a1.5 1.5 0 0 1-1.5 1.5H4.5A1.5 1.5 0 0 1 3 20V10.5z"/>
        <path class="morph-door" d="M9 21v-7a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v7"/>
        <circle class="morph-beacon" cx="12" cy="7.5" r="1.2" fill="currentColor"/>
      </svg>
    `,

    // 2. Chat / Conversation (Nav Tab 2, Hero CTA)
    chat: `
      <svg class="morphicon morphicon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path class="morph-bubble" d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8.5z"/>
        <circle class="morph-dot morph-dot-1" cx="8.5" cy="12" r="1" fill="currentColor"/>
        <circle class="morph-dot morph-dot-2" cx="12" cy="12" r="1" fill="currentColor"/>
        <circle class="morph-dot morph-dot-3" cx="15.5" cy="12" r="1" fill="currentColor"/>
      </svg>
    `,

    // 3. Map / Nautical Chart (Nav Tab 3)
    map: `
      <svg class="morphicon morphicon-map" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <polygon class="morph-map-fold-1" points="1 6 8 2 15 6 22 2 22 18 15 22 8 18 1 22 1 6"/>
        <line class="morph-map-crease-1" x1="8" y1="2" x2="8" y2="18"/>
        <line class="morph-map-crease-2" x1="15" y1="6" x2="15" y2="22"/>
        <circle class="morph-map-target" cx="11.5" cy="11.5" r="1.8" fill="currentColor" opacity="0.6"/>
      </svg>
    `,

    // 4. Alerts / Siren Beacon (Nav Tab 4)
    alert: `
      <svg class="morphicon morphicon-alert" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path class="morph-siren-dome" d="M12 2a6 6 0 0 0-6 6v3.5L4 14v1h16v-1l-2-2.5V8a6 6 0 0 0-6-6z"/>
        <path class="morph-siren-base" d="M9 18h6a2 2 0 0 1-4 0"/>
        <path class="morph-siren-beam" d="M12 2V0M4 4l-1.5-1.5M20 4l1.5-1.5" stroke="var(--orca-secondary)" opacity="0.8"/>
      </svg>
    `,

    // 5. Evidence / Optical Scanner / Lens (Nav Tab 5, Explainability)
    evidence: `
      <svg class="morphicon morphicon-evidence" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle class="morph-lens-ring" cx="11" cy="11" r="7.5"/>
        <line class="morph-lens-handle" x1="21" y1="21" x2="16.3" y2="16.3"/>
        <circle class="morph-lens-reticle" cx="11" cy="11" r="3" stroke-dasharray="2 2"/>
        <circle class="morph-lens-center" cx="11" cy="11" r="1" fill="currentColor"/>
      </svg>
    `,

    // 6. Base Port / Anchor Pin
    location: `
      <svg class="morphicon morphicon-location" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path class="morph-pin-body" d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z"/>
        <circle class="morph-pin-dot" cx="12" cy="10" r="3" fill="currentColor"/>
        <path class="morph-pin-pulse" d="M12 4a6 6 0 0 1 6 6" stroke-dasharray="2 2" opacity="0.7"/>
      </svg>
    `,

    // 7. Fish / Potential Fishing Zone (PFZ)
    fish: `
      <svg class="morphicon morphicon-fish" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path class="morph-fish-body" d="M19 12c-4-4-10-5-15-2 1.5 2 1.5 4 0 6 5 3 11 2 15-2z"/>
        <path class="morph-fish-fin-top" d="M11 7c2-3 4-3 5-2"/>
        <path class="morph-fish-fin-bot" d="M10 17c1.5 2 3.5 2 4.5 1"/>
        <path class="morph-fish-tail" d="M4 10l-3-2v8l3-2"/>
        <circle class="morph-fish-eye" cx="16" cy="11" r="0.8" fill="currentColor"/>
      </svg>
    `,

    // 8. Warning / Caution Shield
    warning: `
      <svg class="morphicon morphicon-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path class="morph-warn-triangle" d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line class="morph-warn-bar" x1="12" y1="9" x2="12" y2="13"/>
        <circle class="morph-warn-dot" cx="12" cy="17" r="0.8" fill="currentColor"/>
      </svg>
    `,

    // 9. Check / Safe to Sail Shield
    check: `
      <svg class="morphicon morphicon-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path class="morph-check-shield" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline class="morph-check-tick" points="8.5 11.5 11 14 15.5 9.5"/>
      </svg>
    `,

    // 10. Danger / Unsafe Barrier
    danger: `
      <svg class="morphicon morphicon-danger" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <polygon class="morph-danger-oct" points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/>
        <line x1="8" y1="8" x2="16" y2="16"/>
        <line x1="16" y1="8" x2="8" y2="16"/>
      </svg>
    `,

    // 11. Cyclone / Storm Vortex
    cyclone: `
      <svg class="morphicon morphicon-cyclone" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path class="morph-cyclone-arm-1" d="M12 4a8 8 0 0 1 7.8 6.2c.4 1.8-.4 3.8-2 4.8L15 16.5"/>
        <path class="morph-cyclone-arm-2" d="M12 20a8 8 0 0 1-7.8-6.2c-.4-1.8.4-3.8 2-4.8L9 7.5"/>
        <circle class="morph-cyclone-eye" cx="12" cy="12" r="2.5" stroke="var(--orca-secondary)"/>
        <circle class="morph-cyclone-core" cx="12" cy="12" r="1" fill="currentColor"/>
      </svg>
    `,

    // 12. Flag / Maritime Border (IMBL)
    flag: `
      <svg class="morphicon morphicon-flag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <line class="morph-flag-pole" x1="4" y1="2" x2="4" y2="22"/>
        <path class="morph-flag-pennant" d="M4 3h13l-3 4.5 3 4.5H4z"/>
        <circle class="morph-flag-finial" cx="4" cy="2" r="1" fill="currentColor"/>
      </svg>
    `,

    // 13. Wave / Swell Telemetry
    wave: `
      <svg class="morphicon morphicon-wave" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path class="morph-wave-crest-1" d="M2 13c2.5 0 3-3 6-3s3.5 3 6 3 3.5-3 6-3 3 3 4 3"/>
        <path class="morph-wave-crest-2" d="M2 18c2.5 0 3-3 6-3s3.5 3 6 3 3.5-3 6-3 3 3 4 3" opacity="0.6"/>
        <path class="morph-wave-crest-3" d="M2 8c2.5 0 3-3 6-3s3.5 3 6 3 3.5-3 6-3 3 3 4 3" opacity="0.3"/>
      </svg>
    `,

    // 14. Wind / Velocity Vectors
    wind: `
      <svg class="morphicon morphicon-wind" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path class="morph-wind-line-1" d="M3 8h12.5a2.5 2.5 0 1 0-2.5-2.5"/>
        <path class="morph-wind-line-2" d="M2 13h16.5a2.5 2.5 0 1 0-2.5-2.5"/>
        <path class="morph-wind-line-3" d="M4 18h8.5a2.5 2.5 0 1 0-2.5-2.5"/>
      </svg>
    `,

    // 15. Temperature / SST Thermometer
    temp: `
      <svg class="morphicon morphicon-temp" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path class="morph-therm-stem" d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
        <circle class="morph-therm-mercury" cx="11.5" cy="17.5" r="2.2" fill="currentColor"/>
        <line class="morph-therm-level" x1="11.5" y1="9" x2="11.5" y2="15"/>
        <line x1="16" y1="6" x2="18" y2="6" stroke-width="1.4" opacity="0.7"/>
        <line x1="16" y1="10" x2="18" y2="10" stroke-width="1.4" opacity="0.7"/>
      </svg>
    `,

    // 16. Compass / Heading & Boundary Rose
    compass: `
      <svg class="morphicon morphicon-compass" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle class="morph-compass-rim" cx="12" cy="12" r="9.5"/>
        <polygon class="morph-compass-needle" points="15.8 8.2 12.8 12.8 8.2 15.8 11.2 11.2 15.8 8.2" fill="currentColor"/>
        <circle class="morph-compass-pivot" cx="12" cy="12" r="1.2" fill="#030806" stroke="currentColor" stroke-width="1"/>
      </svg>
    `,

    // 17. Lightning / Doppler Squalls
    lightning: `
      <svg class="morphicon morphicon-lightning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <polygon class="morph-bolt" points="13 2 4 14 11 14 9 22 20 10 13 10 13 2"/>
      </svg>
    `,

    // 18. Route / Nav-Mesh Waypoint
    route: `
      <svg class="morphicon morphicon-route" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle class="morph-route-start" cx="6" cy="18" r="2.5"/>
        <circle class="morph-route-end" cx="18" cy="6" r="2.5"/>
        <path class="morph-route-path" d="M8 16.5c3-1 4-6 8-8.5" stroke-dasharray="3 2.5"/>
        <polygon points="17 4 19 6 17 8" fill="currentColor"/>
      </svg>
    `,

    // 19. Shield / Agentic Defense (Collaborative Agent 1)
    shield: `
      <svg class="morphicon morphicon-shield" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path class="morph-shield-crest" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path class="morph-shield-emblem" d="M12 7v8M8.5 11h7"/>
      </svg>
    `,

    // 20. Globe / Universal Vernacular (Language Tag)
    globe: `
      <svg class="morphicon morphicon-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <path class="morph-globe-meridian" d="M12 3a13 13 0 0 0 0 18 13 13 0 0 0 0-18z"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
      </svg>
    `,

    // 21. Arrow Up-Right (CTA / Action Link)
    arrow_up_right: `
      <svg class="morphicon morphicon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line class="morph-arrow-stem" x1="7" y1="17" x2="17" y2="7"/>
        <polyline class="morph-arrow-head" points="7 7 17 7 17 17"/>
      </svg>
    `,

    // 22. Chevron Down (Evidence Drawer Toggle)
    chevron_down: `
      <svg class="morphicon morphicon-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <polyline class="morph-chevron-poly" points="6 9 12 15 18 9"/>
      </svg>
    `,

    // 23. Close (Popup Dismiss)
    close: `
      <svg class="morphicon morphicon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    `,

    // 24. Boat / Fishing Vessel (Map GPS Marker)
    boat: `
      <svg class="morphicon morphicon-boat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <path class="morph-boat-hull" d="M2 17l2 4h16l2-4H2z"/>
        <path class="morph-boat-cabin" d="M7 17V9h8v8"/>
        <line x1="11" y1="9" x2="11" y2="3"/>
        <path d="M11 3l5 3-5 2"/>
      </svg>
    `,
  };

  class MorphiconsEngine {
    constructor() {
      this.icons = ICONS;
    }

    /**
     * Get SVG markup for a specified morphicon
     * @param {string} name - The identifier (e.g. 'home', 'fish', 'wave')
     * @param {object} [opts] - Options { size, className, color, style }
     */
    get(name, opts = {}) {
      const raw = this.icons[name];
      if (!raw) return '';

      const size = opts.size || 16;
      const extraClass = opts.className ? ` ${opts.className}` : '';
      const colorStyle = opts.color ? `color: ${opts.color};` : '';
      const customStyle = opts.style ? ` ${opts.style}` : '';

      return raw
        .trim()
        .replace(
          '<svg ',
          `<svg width="${size}" height="${size}" style="${colorStyle}${customStyle}" `
        )
        .replace('class="morphicon', `class="morphicon${extraClass}`);
    }

    /**
     * Replace all matching [data-morphicon="name"] placeholders in a container
     */
    hydrate(root = document) {
      root.querySelectorAll('[data-morphicon]').forEach((el) => {
        const name = el.getAttribute('data-morphicon');
        const size = parseInt(el.getAttribute('data-morph-size') || '16', 10);
        const color = el.getAttribute('data-morph-color') || '';
        el.innerHTML = this.get(name, { size, color });
      });
    }
  }

  window.Morphicons = new MorphiconsEngine();
})();
