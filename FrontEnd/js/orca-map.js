/**
 * ORCA — Marine Geospatial Navigation Map (Google Maps Engine)
 * Simplified, accessible, interactive Google Maps experience for Andhra Pradesh Coast.
 * Powered by Leaflet with Google Maps Cartography, Satellite, and Terrain layers.
 */

class OrcaMarineMap {
  constructor(containerId = 'orca-leaflet-map') {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    // Andhra Pradesh Coast Geographic Center
    this.centerLat = 16.65;
    this.centerLon = 82.80;
    this.defaultZoom = 8;

    // Layer state
    this.layers = {
      pfz: true,
      hazard: true,
      imbl: true,
      route: true,
    };

    this.currentMapType = 'roadmap'; // 'roadmap' | 'satellite' | 'terrain'

    // Major Harbors along the AP Coast
    this.ports = [
      {
        id: 'port-vizag',
        key: 'visakhapatnam',
        name: 'Visakhapatnam Harbor',
        telugu: 'విశాఖపట్నం హార్బర్',
        lat: 17.6868,
        lon: 83.2185,
        type: 'major_port',
        berths: 24,
        desc: 'Deep natural harbor with 24/7 Coast Guard radar and fishing terminal.',
        descTe: 'తీర రక్షణ రాడార్ మరియు చేపల టెర్మినల్‌తో కూడిన సహజ ఓడరేవు.'
      },
      {
        id: 'port-kakinada',
        key: 'kakinada',
        name: 'Kakinada Fishery Port',
        telugu: 'కాకినాడ ఫిషరీ పోర్ట్',
        lat: 16.9891,
        lon: 82.2475,
        type: 'fishery_port',
        berths: 14,
        desc: 'Major mechanized trawler base at Godavari delta convergence.',
        descTe: 'గోదావరి డెల్టా వద్ద ప్రధాన యంత్ర పడవల స్థావరం.'
      },
      {
        id: 'port-machilipatnam',
        key: 'machilipatnam',
        name: 'Machilipatnam Coast',
        telugu: 'మచిలీపట్నం తీరం',
        lat: 16.1875,
        lon: 81.1389,
        type: 'fishery_port',
        berths: 8,
        desc: 'Key center for artisanal gillnetters and motorized catamarans.',
        descTe: 'మోటరైజ్డ్ పడవలు మరియు గిల్‌నెట్టర్లకు ముఖ్య కేంద్రం.'
      },
      {
        id: 'port-nizampatnam',
        key: 'nizampatnam',
        name: 'Nizampatnam Harbor',
        telugu: 'నిజాంపట్నం హార్బర్',
        lat: 15.9042,
        lon: 80.6722,
        type: 'fishery_port',
        berths: 6,
        desc: 'South coast sheltered fishery harbor with ice plants and fuel jetty.',
        descTe: 'దక్షిణ తీర రక్షిత ఫిషింగ్ హార్బర్.'
      },
      {
        id: 'port-krishnapatnam',
        key: 'krishnapatnam',
        name: 'Krishnapatnam Port',
        telugu: 'కృష్ణపట్నం పోర్ట్',
        lat: 14.2500,
        lon: 80.1167,
        type: 'major_port',
        berths: 12,
        desc: 'Modern deepwater port with vessel traffic monitoring service (VTMS).',
        descTe: 'నౌకా ట్రాఫిక్ పర్యవేక్షణ గల ఆధునిక లోతైన నౌకాశ్రయం.'
      }
    ];

    // Potential Fishing Zones (INCOIS Data Model)
    this.pfzZones = [
      {
        id: 'PFZ-VIZAG-01',
        name: 'Vizag Deep Shelf Zone',
        telugu: 'విశాఖ ఉత్తమ చేపల ప్రాంతం',
        lat: 17.58,
        lon: 83.48,
        radiusKm: 12,
        density: 'High Catch (Tuna & Mackerel)',
        densityTe: 'అత్యధిక లభ్యత (ట్యూనా & వంజరం)',
        sst: '28.2 °C',
        chlorophyll: '1.4 mg/m³',
        depth: '45m – 70m',
        distance: '16 km from Vizag Port',
        distanceTe: 'వైజాగ్ పోర్ట్ నుండి 16 కి.మీ',
        validUntil: 'Today 18:00 IST',
        validUntilTe: 'నేడు సాయంత్రం 18:00 వరకు',
        rating: '4.9 ★★★★★',
        confidence: '98% High Probability',
        advice: 'Safe for mechanized & motorized craft. Excellent fish aggregation along thermal break line.',
        adviceTe: 'యంత్ర పడవలకు అత్యంత సురక్షితం. థర్మల్ బ్రేక్ లైన్ వెంబడి విస్తారంగా చేపలు లభించే అవకాశం.'
      },
      {
        id: 'PFZ-KAKI-02',
        name: 'Kakinada Offshore Shoal',
        telugu: 'కాకినాడ మత్స్య మండలం',
        lat: 16.82,
        lon: 82.52,
        radiusKm: 15,
        density: 'Moderate-High (Pomfret & Ribbonfish)',
        densityTe: 'మంచి లభ్యత (చందమామ & సావళ్ళ)',
        sst: '28.6 °C',
        chlorophyll: '1.6 mg/m³',
        depth: '30m – 55m',
        distance: '21 km from Kakinada',
        distanceTe: 'కాకినాడ నుండి 21 కి.మీ',
        validUntil: 'Today 18:00 IST',
        validUntilTe: 'నేడు సాయంత్రం 18:00 వరకు',
        rating: '4.7 ★★★★☆',
        confidence: '92% Catch Potential',
        advice: 'Good catch potential. Caution: Watch wave swell after 15:00 near the delta spit.',
        adviceTe: 'మంచి వేట అవకాశం. మధ్యాహ్నం 15:00 తర్వాత అలల తాకిడి పెరిగే ప్రమాదం ఉంది, జాగ్రత్త వహించండి.'
      },
      {
        id: 'PFZ-MACHI-03',
        name: 'Krishna-Godavari Shelf Zone',
        telugu: 'కృష్ణా డెల్టా చేపల రేవు',
        lat: 16.02,
        lon: 81.45,
        radiusKm: 14,
        density: 'High (Sardines & Anchovies)',
        densityTe: 'అత్యధికం (కవ్వళ్ళు & నెత్తళ్ళు)',
        sst: '28.1 °C',
        chlorophyll: '1.3 mg/m³',
        depth: '25m – 45m',
        distance: '24 km from Machilipatnam',
        distanceTe: 'మచిలీపట్నం నుండి 24 కి.మీ',
        validUntil: 'Tomorrow 06:00 IST',
        validUntilTe: 'రేపు ఉదయం 06:00 వరకు',
        rating: '4.8 ★★★★★',
        confidence: '95% Favorable Zone',
        advice: 'Highly recommended for gillnetters. Surface waters calm with rich chlorophyll bloom.',
        adviceTe: 'గిల్‌నెట్ బోట్లకు అత్యంత అనుకూలం. ఉపరితల సముద్రం ప్రశాంతంగా ఉంది.'
      },
      {
        id: 'PFZ-NIZAM-04',
        name: 'Nizampatnam Pelagic Bank',
        telugu: 'నిజాంపట్నం సముద్రపు రేవు',
        lat: 15.75,
        lon: 80.85,
        radiusKm: 13,
        density: 'High Catch (Prawns & Croakers)',
        densityTe: 'అధిక లభ్యత (రొయ్యలు & గోరకలు)',
        sst: '28.4 °C',
        chlorophyll: '1.5 mg/m³',
        depth: '20m – 38m',
        distance: '18 km from Nizampatnam',
        distanceTe: 'నిజాంపట్నం నుండి 18 కి.మీ',
        validUntil: 'Today 20:00 IST',
        validUntilTe: 'నేడు రాత్రి 20:00 వరకు',
        rating: '4.6 ★★★★☆',
        confidence: '90% Prime Zone',
        advice: 'Strong demersal fish concentrations. Ideal for single-day motorized outings.',
        adviceTe: 'సముద్ర గర్భంలో చేపలు పుష్కలంగా ఉన్నాయి. ఒక రోజు వేటకు అనుకూలం.'
      }
    ];

    // Hazard Zones (IMD & INCOIS Bulletins)
    this.hazards = [
      {
        id: 'HAZ-CYCLONE-01',
        type: 'cyclone',
        title: 'Deep Depression Warning Cone',
        telugu: 'తుఫాను వాయుగుండం హెచ్చరిక జోన్',
        severity: 'Caution',
        severityTe: 'జాగ్రత్త హెచ్చరిక',
        polygon: [
          [15.0, 84.8],
          [16.4, 84.2],
          [17.8, 84.6],
          [17.2, 85.4]
        ],
        center: { lat: 16.6, lon: 84.7 },
        desc: 'Squally wind 45-55 km/h gusting 65 km/h. Fisherfolk advised not to venture beyond 25 NM.',
        descTe: 'గంటకు 45-55 కి.మీ వేగంతో బలమైన గాలులు వీస్తాయి. 25 నాటికల్ మైళ్ళకు మించి వెళ్ళవద్దు.'
      },
      {
        id: 'HAZ-WAVE-02',
        type: 'high_wave',
        title: 'High Wave Swell Alert (2.8m - 3.4m)',
        telugu: 'తీవ్ర అలల ఉప్పెన హెచ్చరిక (2.8మీ - 3.4మీ)',
        severity: 'Warning',
        severityTe: 'ప్రమాద హెచ్చరిక',
        center: { lat: 16.5, lon: 82.9 },
        radiusKm: 28,
        desc: 'Spring tide rough seas. Keep small catamarans close to shore; breaker waves at river mouths.',
        descTe: 'తీవ్రమైన అలల తాకిడి. చిన్న పడవలు తీరానికి సమీపంలోనే ఉండాలి.'
      },
      {
        id: 'HAZ-LIGHT-03',
        type: 'lightning',
        title: 'Thundersquall & Lightning Zone',
        telugu: 'ఉరుములు మెరుపుల ప్రభావ ప్రాంతం',
        severity: 'Alert',
        severityTe: 'సాధారణ అప్రమత్తత',
        center: { lat: 17.3, lon: 83.6 },
        radiusKm: 18,
        desc: 'Localized convective cloud build-up with sudden squalls expected late afternoon.',
        descTe: 'మధ్యాహ్నం తర్వాత ఉరుములు మెరుపులతో కూడిన ఆకస్మిక గాలులు.'
      }
    ];

    // User Boat Position (Default: off Visakhapatnam)
    this.userBoat = {
      lat: 17.65,
      lon: 83.28,
      heading: 115,
      name: 'Boat: Sri Lakshmi (IND-AP-02-MM-104)',
      speed: '8.4 knots',
      status: 'Cruising to PFZ-01'
    };

    // Planned Safe Route (Origin -> Boat -> Waypoint -> Target Zone)
    this.routePoints = [
      { lat: 17.6868, lon: 83.2185, label: 'Vizag Fishing Harbor (Origin)' },
      { lat: 17.65, lon: 83.28, label: 'Current Boat Position' },
      { lat: 17.61, lon: 83.39, label: 'Waypoint Alpha (Clear of Swell)' },
      { lat: 17.58, lon: 83.48, label: 'PFZ-VIZAG-01 (Destination)' }
    ];

    // International Maritime Boundary Line (IMBL)
    this.imblPoints = [
      [18.5, 85.0],
      [16.5, 84.5],
      [14.5, 83.8],
      [13.5, 83.2]
    ];

    this.selectedItem = null;
    this.map = null;
    this.layerGroups = {};
    this.tileLayers = {};

    this.init();
  }

  init() {
    if (typeof L === 'undefined') {
      console.error('Leaflet is not loaded yet');
      return;
    }

    // Initialize Leaflet Map
    this.map = L.map(this.containerId, {
      center: [this.centerLat, this.centerLon],
      zoom: this.defaultZoom,
      zoomControl: false, // We use custom Google Maps zoom controls
      attributionControl: false,
      minZoom: 6,
      maxZoom: 18,
    });

    // Add scale bar in bottom right (Google Maps style)
    L.control.scale({
      position: 'bottomright',
      imperial: true,
      metric: true
    }).addTo(this.map);

    // Set up Google Maps Tile Providers with seamless fallbacks
    this.setupTileLayers();

    // Set up Feature Layers
    this.setupFeatureLayers();

    // Bind UI Controls (Search, Chips, Zoom, Type Switcher)
    this.bindUI();

    // Initial resize trigger
    setTimeout(() => {
      this.onResize();
    }, 150);
  }

  setupTileLayers() {
    // 1. Google Maps Roadmap (Clean, simple, standard Google Maps look)
    this.tileLayers.roadmap = L.tileLayer(
      'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }
    );

    // Fallback layer in case Google tile server is blocked: Carto Voyager (very similar to Google Maps)
    this.tileLayers.roadmapFallback = L.tileLayer(
      'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19
      }
    );

    // 2. Google Maps Satellite Hybrid (Satellite imagery + clean labels)
    this.tileLayers.satellite = L.tileLayer(
      'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }
    );

    // 3. Google Maps Terrain (Relief with marine contours)
    this.tileLayers.terrain = L.tileLayer(
      'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
      }
    );

    // Default to Google Roadmap
    this.tileLayers.roadmap.addTo(this.map);
  }

  setupFeatureLayers() {
    // Layer Groups
    this.layerGroups.ports = L.layerGroup().addTo(this.map);
    this.layerGroups.pfz = L.layerGroup().addTo(this.map);
    this.layerGroups.hazards = L.layerGroup().addTo(this.map);
    this.layerGroups.imbl = L.layerGroup().addTo(this.map);
    this.layerGroups.route = L.layerGroup().addTo(this.map);
    this.layerGroups.boat = L.layerGroup().addTo(this.map);
    this.layerGroups.backend = L.layerGroup().addTo(this.map);

    this.renderPorts();
    this.renderPFZ();
    this.renderHazards();
    this.renderIMBL();
    this.renderRoute();
    this.renderUserBoat();

    // Ingest backend GeoJSON payload on initialization
    setTimeout(() => {
      this.loadBackendMapPayload(this.userBoat.lat, this.userBoat.lon);
    }, 400);
  }

  // ==========================================
  // Custom Google Maps-Styled Markers & Pins
  // ==========================================

  createGooglePin(options) {
    const { color = '#1a73e8', iconSvg = '', label = '', size = 38 } = options;
    const isTe = window.orcaI18n && window.orcaI18n.currentLang === 'te';

    const html = `
      <div class="gmap-marker-pin-wrapper" style="--pin-color: ${color};">
        <div class="gmap-marker-pin">
          <svg class="gmap-pin-svg" viewBox="0 0 32 42" width="${size}" height="${size * 1.31}">
            <defs>
              <filter id="pin-shadow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="rgba(0,0,0,0.35)"/>
              </filter>
            </defs>
            <path filter="url(#pin-shadow)" d="M16 0C7.163 0 0 7.163 0 16c0 10.667 16 26 16 26s16-15.333 16-26c0-8.837-7.163-16-16-16z" fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
            <circle cx="16" cy="16" r="9" fill="#ffffff"/>
          </svg>
          <div class="gmap-pin-icon-inner">${iconSvg}</div>
        </div>
        ${label ? `<div class="gmap-pin-label-badge">${label}</div>` : ''}
      </div>
    `;

    return L.divIcon({
      className: 'gmap-custom-pin',
      html: html,
      iconSize: [size, size * 1.31],
      iconAnchor: [size / 2, size * 1.31],
      popupAnchor: [0, -size * 1.2]
    });
  }

  // 1. Ports / Harbors (Blue Google Pin with Anchor)
  renderPorts() {
    this.layerGroups.ports.clearLayers();
    const isTe = window.orcaI18n && window.orcaI18n.currentLang === 'te';

    this.ports.forEach((port) => {
      const anchorSvg = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#1a73e8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="5" r="3"/>
          <line x1="12" y1="22" x2="12" y2="8"/>
          <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
        </svg>
      `;

      const pinIcon = this.createGooglePin({
        color: '#1a73e8',
        iconSvg: anchorSvg,
        label: isTe ? port.telugu : port.name.split(' ')[0],
        size: 32
      });

      const marker = L.marker([port.lat, port.lon], { icon: pinIcon });
      marker.on('click', () => {
        this.selectedItem = { type: 'port', data: port };
        this.updatePlaceCard(this.selectedItem);
        this.map.panTo([port.lat, port.lon], { animate: true, duration: 0.6 });
      });

      this.layerGroups.ports.addLayer(marker);
    });
  }

  // 2. Potential Fishing Zones (Google Green Pin with Fish Icon + Catch Radius)
  renderPFZ() {
    this.layerGroups.pfz.clearLayers();
    if (!this.layers.pfz) return;

    const isTe = window.orcaI18n && window.orcaI18n.currentLang === 'te';

    this.pfzZones.forEach((zone) => {
      // Soft translucent circle showing the catch zone
      const circle = L.circle([zone.lat, zone.lon], {
        radius: zone.radiusKm * 1000,
        color: '#34a853',
        weight: 1.8,
        fillColor: '#34a853',
        fillOpacity: 0.14,
        dashArray: '4, 4'
      });

      const fishSvg = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34a853" stroke-width="2.5">
          <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6s-7.56-2.54-8.5-6z"/>
          <path d="M18 12c.5 0 1-.5 1-1"/>
          <circle cx="17" cy="11" r="1" fill="#34a853"/>
          <path d="M2 16l4.5-4L2 8"/>
        </svg>
      `;

      const pinIcon = this.createGooglePin({
        color: '#34a853',
        iconSvg: fishSvg,
        label: isTe ? zone.telugu.split(' ')[0] : zone.name.split(' ')[0],
        size: 34
      });

      const marker = L.marker([zone.lat, zone.lon], { icon: pinIcon });

      const handleClick = () => {
        this.selectedItem = { type: 'pfz', data: zone };
        this.updatePlaceCard(this.selectedItem);
        this.map.panTo([zone.lat, zone.lon], { animate: true, duration: 0.6 });
      };

      circle.on('click', handleClick);
      marker.on('click', handleClick);

      this.layerGroups.pfz.addLayer(circle);
      this.layerGroups.pfz.addLayer(marker);
    });
  }

  // 3. Hazard Zones (Cyclone Cone, High Waves, Lightning)
  renderHazards() {
    this.layerGroups.hazards.clearLayers();
    if (!this.layers.hazard) return;

    const isTe = window.orcaI18n && window.orcaI18n.currentLang === 'te';

    this.hazards.forEach((hazard) => {
      if (hazard.type === 'cyclone') {
        // Cyclone Polygon Cone
        const polygon = L.polygon(hazard.polygon, {
          color: '#ea8600',
          weight: 2,
          fillColor: '#ea8600',
          fillOpacity: 0.22,
          dashArray: '6, 6'
        });

        // Center warning marker
        const warningSvg = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ea8600" stroke-width="2.5">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <circle cx="12" cy="17" r="1" fill="#ea8600"/>
          </svg>
        `;

        const pin = this.createGooglePin({
          color: '#ea8600',
          iconSvg: warningSvg,
          label: isTe ? 'తుఫాను హెచ్చరిక' : 'Cyclone Alert',
          size: 32
        });

        const centerMarker = L.marker([hazard.center.lat, hazard.center.lon], { icon: pin });

        const onClick = () => {
          this.selectedItem = { type: 'hazard', data: hazard };
          this.updatePlaceCard(this.selectedItem);
        };

        polygon.on('click', onClick);
        centerMarker.on('click', onClick);

        this.layerGroups.hazards.addLayer(polygon);
        this.layerGroups.hazards.addLayer(centerMarker);
      } else if (hazard.type === 'high_wave') {
        // Swell Radius Circle
        const circle = L.circle([hazard.center.lat, hazard.center.lon], {
          radius: hazard.radiusKm * 1000,
          color: '#d93025',
          weight: 2,
          fillColor: '#d93025',
          fillOpacity: 0.18,
          dashArray: '5, 5'
        });

        const waveSvg = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#d93025" stroke-width="2.5">
            <path d="M2 12c2.5-3 5.5-3 8 0 2.5 3 5.5 3 8 0 2.5-3 5.5-3 8 0"/>
            <path d="M2 17c2.5-3 5.5-3 8 0 2.5 3 5.5 3 8 0 2.5-3 5.5-3 8 0"/>
          </svg>
        `;

        const pin = this.createGooglePin({
          color: '#d93025',
          iconSvg: waveSvg,
          label: isTe ? 'ఉప్పెన హెచ్చరిక' : 'Wave Swell',
          size: 32
        });

        const centerMarker = L.marker([hazard.center.lat, hazard.center.lon], { icon: pin });

        const onClick = () => {
          this.selectedItem = { type: 'hazard', data: hazard };
          this.updatePlaceCard(this.selectedItem);
        };

        circle.on('click', onClick);
        centerMarker.on('click', onClick);

        this.layerGroups.hazards.addLayer(circle);
        this.layerGroups.hazards.addLayer(centerMarker);
      }
    });
  }

  // 4. International Maritime Boundary Line (IMBL Border)
  renderIMBL() {
    this.layerGroups.imbl.clearLayers();
    if (!this.layers.imbl) return;

    const isTe = window.orcaI18n && window.orcaI18n.currentLang === 'te';

    // Red dashed border line
    const borderLine = L.polyline(this.imblPoints, {
      color: '#d93025',
      weight: 3.5,
      dashArray: '10, 8',
      opacity: 0.85
    });

    // Outer buffer danger tint
    const bufferPolygon = L.polygon(
      [
        ...this.imblPoints,
        [13.5, 87.0],
        [18.5, 87.0]
      ],
      {
        color: 'transparent',
        fillColor: '#d93025',
        fillOpacity: 0.07
      }
    );

    // Floating border badge
    const badgeHtml = `
      <div class="gmap-border-badge">
        <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#d93025; margin-right:5px;"></span>
        <strong>${isTe ? 'IMBL సరిహద్దు • దాటవద్దు' : 'IMBL MARITIME BORDER • DO NOT CROSS'}</strong>
      </div>
    `;

    const badgeIcon = L.divIcon({
      className: 'gmap-border-badge-container',
      html: badgeHtml,
      iconSize: [220, 26],
      iconAnchor: [110, 13]
    });

    const badgeMarker = L.marker([16.5, 84.5], { icon: badgeIcon });

    this.layerGroups.imbl.addLayer(bufferPolygon);
    this.layerGroups.imbl.addLayer(borderLine);
    this.layerGroups.imbl.addLayer(badgeMarker);
  }

  // 5. Navigation Route (Google Maps Turn-by-Turn Blue Polyline)
  renderRoute() {
    this.layerGroups.route.clearLayers();
    if (!this.layers.route) return;

    const latlngs = this.routePoints.map(p => [p.lat, p.lon]);

    // Outer route casing (Google Maps navy border)
    const routeOutline = L.polyline(latlngs, {
      color: '#185abc',
      weight: 7,
      opacity: 0.7
    });

    // Inner vibrant route line (Google Maps Navigation Blue)
    const routeInner = L.polyline(latlngs, {
      color: '#4285f4',
      weight: 4.5,
      opacity: 1
    });

    // Route Waypoint Dots
    latlngs.forEach((coord, idx) => {
      if (idx > 0 && idx < latlngs.length - 1) {
        const dotHtml = `<div class="gmap-waypoint-dot"></div>`;
        const dotIcon = L.divIcon({
          className: 'gmap-waypoint-container',
          html: dotHtml,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });
        this.layerGroups.route.addLayer(L.marker(coord, { icon: dotIcon }));
      }
    });

    this.layerGroups.route.addLayer(routeOutline);
    this.layerGroups.route.addLayer(routeInner);
  }

  // 6. User Boat (Google Maps Blue Pulsing Location Beacon)
  renderUserBoat() {
    this.layerGroups.boat.clearLayers();
    const isTe = window.orcaI18n && window.orcaI18n.currentLang === 'te';

    const boatHtml = `
      <div class="gmap-boat-beacon-container" title="${this.userBoat.name}">
        <div class="gmap-boat-pulse"></div>
        <div class="gmap-boat-heading-beam" style="transform: rotate(${this.userBoat.heading}deg);"></div>
        <div class="gmap-boat-center-dot">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#ffffff">
            <polygon points="12 2 19 21 12 17 5 21 12 2"/>
          </svg>
        </div>
        <div class="gmap-boat-label">${isTe ? 'నా పడవ (GPS ప్రత్యక్షం)' : 'My Boat (Live GPS)'}</div>
      </div>
    `;

    const boatIcon = L.divIcon({
      className: 'gmap-boat-marker',
      html: boatHtml,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    this.boatMarker = L.marker([this.userBoat.lat, this.userBoat.lon], { icon: boatIcon });
    this.boatMarker.on('click', () => {
      this.selectedItem = {
        type: 'boat',
        data: {
          name: this.userBoat.name,
          lat: this.userBoat.lat,
          lon: this.userBoat.lon,
          heading: this.userBoat.heading,
          speed: this.userBoat.speed,
          status: this.userBoat.status
        }
      };
      this.updatePlaceCard(this.selectedItem);
      this.map.panTo([this.userBoat.lat, this.userBoat.lon], { animate: true });
    });

    this.layerGroups.boat.addLayer(this.boatMarker);
  }

  // ==========================================
  // Google Maps UI Controls & Actions
  // ==========================================

  bindUI() {
    // 1. Zoom In & Zoom Out
    const zoomInBtn = document.getElementById('gmap-zoom-in');
    const zoomOutBtn = document.getElementById('gmap-zoom-out');
    if (zoomInBtn) zoomInBtn.addEventListener('click', () => this.map.zoomIn());
    if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => this.map.zoomOut());

    // 2. Recenter on My Boat (Google Maps Blue Target ⌖)
    const recenterBtn = document.getElementById('gmap-recenter-btn');
    const recenterSearchBtn = document.getElementById('gmap-recenter-search-btn');
    const doRecenter = () => {
      this.recenterBoat();
    };
    if (recenterBtn) recenterBtn.addEventListener('click', doRecenter);
    if (recenterSearchBtn) recenterSearchBtn.addEventListener('click', doRecenter);

    // 3. Map Type Switcher (Roadmap / Satellite / Terrain)
    const typeButtons = document.querySelectorAll('.gmap-type-btn');
    typeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        typeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const type = btn.getAttribute('data-type');
        this.setMapType(type);
      });
    });

    // 4. Layer Filter Chips
    const chips = document.querySelectorAll('.gmap-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const layer = chip.getAttribute('data-layer');
        const isActive = chip.classList.contains('gmap-chip-active');
        const nextState = !isActive;

        if (nextState) {
          chip.classList.add('gmap-chip-active');
        } else {
          chip.classList.remove('gmap-chip-active');
        }

        this.toggleLayer(layer, nextState);
      });
    });

    // 5. Search Bar & Dropdown
    const searchInput = document.getElementById('gmap-search-input');
    const searchClear = document.getElementById('gmap-search-clear');
    const searchDropdown = document.getElementById('gmap-search-dropdown');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (query.length > 0) {
          if (searchClear) searchClear.classList.remove('hidden');
          this.renderSearchResults(query, searchDropdown);
        } else {
          if (searchClear) searchClear.classList.add('hidden');
          if (searchDropdown) searchDropdown.classList.add('hidden');
        }
      });

      searchInput.addEventListener('focus', () => {
        const query = searchInput.value.trim().toLowerCase();
        this.renderSearchResults(query, searchDropdown);
      });
    }

    if (searchClear) {
      searchClear.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        searchClear.classList.add('hidden');
        if (searchDropdown) searchDropdown.classList.add('hidden');
      });
    }

    // Close search dropdown on clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.gmap-search-box') && searchDropdown) {
        searchDropdown.classList.add('hidden');
      }
    });

    // Map click closes open place card if clicked on empty space
    this.map.on('click', (e) => {
      // If clicking directly on base map tiles, dismiss card
      if (e.originalEvent && !e.originalEvent.target.closest('.gmap-custom-pin')) {
        this.closePopup();
      }
    });
  }

  renderSearchResults(query, dropdown) {
    if (!dropdown) return;
    const isTe = window.orcaI18n && window.orcaI18n.currentLang === 'te';

    const items = [
      ...this.ports.map(p => ({
        type: 'port',
        title: isTe ? p.telugu : p.name,
        sub: 'Andhra Pradesh Harbor • Safe Anchorage',
        lat: p.lat,
        lon: p.lon,
        icon: '⚓',
        data: p
      })),
      ...this.pfzZones.map(z => ({
        type: 'pfz',
        title: isTe ? z.telugu : z.name,
        sub: `${z.density} • ${z.distance}`,
        lat: z.lat,
        lon: z.lon,
        icon: '🐟',
        data: z
      })),
      ...this.hazards.map(h => ({
        type: 'hazard',
        title: isTe ? h.telugu : h.title,
        sub: `${h.severity} Alert • ${h.desc.substring(0, 45)}...`,
        lat: h.center.lat,
        lon: h.center.lon,
        icon: '⚠️',
        data: h
      })),
      {
        type: 'boat',
        title: isTe ? 'నా పడవ (శ్రీ లక్ష్మి)' : 'My Boat: Sri Lakshmi',
        sub: 'Live GPS Location • Speed: 8.4 kts',
        lat: this.userBoat.lat,
        lon: this.userBoat.lon,
        icon: '🛥️',
        data: this.userBoat
      }
    ];

    const filtered = query
      ? items.filter(item =>
          item.title.toLowerCase().includes(query) ||
          item.sub.toLowerCase().includes(query)
        )
      : items.slice(0, 6);

    if (filtered.length === 0) {
      dropdown.innerHTML = `
        <div class="gmap-search-empty">
          ${isTe ? 'ఫలితాలు కనుగొనబడలేదు' : 'No places found matching your search'}
        </div>
      `;
      dropdown.classList.remove('hidden');
      return;
    }

    dropdown.innerHTML = filtered.map((item, idx) => `
      <div class="gmap-search-item" data-idx="${idx}">
        <span class="gmap-search-item-icon">${item.icon}</span>
        <div class="gmap-search-item-text">
          <div class="gmap-search-item-title">${item.title}</div>
          <div class="gmap-search-item-sub">${item.sub}</div>
        </div>
      </div>
    `).join('');

    dropdown.classList.remove('hidden');

    dropdown.querySelectorAll('.gmap-search-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-idx'), 10);
        const selected = filtered[idx];
        if (selected) {
          dropdown.classList.add('hidden');
          const searchInput = document.getElementById('gmap-search-input');
          if (searchInput) searchInput.value = selected.title;

          this.map.flyTo([selected.lat, selected.lon], selected.type === 'pfz' ? 10 : 11, {
            animate: true,
            duration: 0.8
          });

          this.selectedItem = { type: selected.type, data: selected.data };
          this.updatePlaceCard(this.selectedItem);
        }
      });
    });
  }

  // ==========================================
  // Google Maps Style Place Card (Bottom-Left)
  // ==========================================

  updatePlaceCard(item) {
    const card = document.getElementById('map-zone-popup');
    if (!card) return;

    if (!item) {
      card.classList.add('hidden');
      return;
    }

    const isTe = window.orcaI18n && window.orcaI18n.currentLang === 'te';
    card.classList.remove('hidden');

    if (item.type === 'pfz') {
      const z = item.data;
      card.innerHTML = `
        <div class="gcard-header">
          <div class="gcard-badge gcard-badge-green">
            <span>🐟</span>
            <span>${isTe ? 'ఇన్‌కాయిస్ ఫిషింగ్ జోన్' : 'INCOIS POTENTIAL FISHING ZONE'}</span>
          </div>
          <button class="gcard-close-btn" onclick="window.orcaMap.closePopup()" aria-label="Close">✕</button>
        </div>

        <h3 class="gcard-title">${isTe ? z.telugu : z.name}</h3>
        <div class="gcard-rating-row">
          <span class="gcard-stars">★★★★★</span>
          <span class="gcard-score">${z.rating.split(' ')[0]}</span>
          <span class="gcard-confidence">• ${isTe ? '98% విశ్వసనీయత' : z.confidence}</span>
        </div>

        <div class="gcard-meta-grid">
          <div class="gcard-meta-box">
            <span class="gcard-meta-label">${isTe ? 'చేపల సంపద' : 'POTENTIAL'}</span>
            <span class="gcard-meta-value text-green">${isTe ? z.densityTe : z.density.split('(')[0]}</span>
          </div>
          <div class="gcard-meta-box">
            <span class="gcard-meta-label">${isTe ? 'హార్బర్ నుండి దూరం' : 'DISTANCE'}</span>
            <span class="gcard-meta-value">${isTe ? z.distanceTe : z.distance.split('from')[0]}</span>
          </div>
          <div class="gcard-meta-box">
            <span class="gcard-meta-label">${isTe ? 'సముద్ర ఉష్ణోగ్రత' : 'SEA TEMP (SST)'}</span>
            <span class="gcard-meta-value">${z.sst}</span>
          </div>
          <div class="gcard-meta-box">
            <span class="gcard-meta-label">${isTe ? 'క్లోరోఫిల్' : 'CHLOROPHYLL'}</span>
            <span class="gcard-meta-value">${z.chlorophyll}</span>
          </div>
        </div>

        <div class="gcard-advisory">
          <strong>${isTe ? 'మత్స్యకారుల సలహా:' : 'Fisherfolk Advisory:'}</strong>
          <span>${isTe ? z.adviceTe : z.advice}</span>
        </div>

        <div class="gcard-actions">
          <button class="gcard-btn gcard-btn-primary" onclick="window.orcaMap.navigateToZone('${z.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polygon points="3 11 22 2 13 21 11 13 3 11"/>
            </svg>
            <span>${isTe ? 'మార్గదర్శనం (రూట్)' : 'Navigate Here'}</span>
          </button>
          <button class="gcard-btn gcard-btn-secondary" onclick="window.switchView('chat'); if(window.orcaChat) window.orcaChat.handleQuery('Show details for ${z.name}');">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>${isTe ? 'AI చాట్‌లో అడగండి' : 'Ask in Chat'}</span>
          </button>
        </div>
      `;
    } else if (item.type === 'port') {
      const p = item.data;
      card.innerHTML = `
        <div class="gcard-header">
          <div class="gcard-badge gcard-badge-blue">
            <span>⚓</span>
            <span>${isTe ? 'ఆంధ్రప్రదేశ్ హార్బర్' : 'ANDHRA PRADESH HARBOR'}</span>
          </div>
          <button class="gcard-close-btn" onclick="window.orcaMap.closePopup()" aria-label="Close">✕</button>
        </div>

        <h3 class="gcard-title">${isTe ? p.telugu : p.name}</h3>
        <div class="gcard-rating-row">
          <span class="gcard-confidence">${p.desc}</span>
        </div>

        <div class="gcard-meta-grid">
          <div class="gcard-meta-box">
            <span class="gcard-meta-label">${isTe ? 'రకం' : 'TYPE'}</span>
            <span class="gcard-meta-value text-blue">${p.type === 'major_port' ? 'Major Deepwater' : 'Fishery Terminal'}</span>
          </div>
          <div class="gcard-meta-box">
            <span class="gcard-meta-label">${isTe ? 'బెర్తులు' : 'BERTHS'}</span>
            <span class="gcard-meta-value">${p.berths} Active</span>
          </div>
          <div class="gcard-meta-box" style="grid-column: span 2;">
            <span class="gcard-meta-label">${isTe ? 'GPS కోఆర్డినేట్స్' : 'GPS POSITION'}</span>
            <span class="gcard-meta-value">${p.lat.toFixed(4)}° N, ${p.lon.toFixed(4)}° E</span>
          </div>
        </div>

        <div class="gcard-actions">
          <button class="gcard-btn gcard-btn-primary" onclick="window.orcaMap.selectAsBasePort('${p.key}')">
            <span>${isTe ? 'బేస్ పోర్ట్‌గా ఎంచుకోండి' : 'Set as Base Port'}</span>
          </button>
          <button class="gcard-btn gcard-btn-secondary" onclick="window.orcaMap.map.flyTo([${p.lat}, ${p.lon}], 13, {animate:true});">
            <span>${isTe ? 'జూమ్ చేయండి' : 'Zoom In'}</span>
          </button>
        </div>
      `;
    } else if (item.type === 'hazard') {
      const h = item.data;
      const isAmber = h.severity.toLowerCase() === 'caution';
      card.innerHTML = `
        <div class="gcard-header">
          <div class="gcard-badge ${isAmber ? 'gcard-badge-amber' : 'gcard-badge-red'}">
            <span>⚠️</span>
            <span>${isTe ? 'వాతావరణ హెచ్చరిక' : 'IMD / INCOIS HAZARD WARNING'}</span>
          </div>
          <button class="gcard-close-btn" onclick="window.orcaMap.closePopup()" aria-label="Close">✕</button>
        </div>

        <h3 class="gcard-title">${isTe ? h.telugu : h.title}</h3>
        <div class="gcard-rating-row">
          <span class="gcard-score" style="color:${isAmber ? '#ea8600' : '#d93025'}">${isTe ? h.severityTe : h.severity} Alert</span>
        </div>

        <div class="gcard-advisory" style="background:${isAmber ? 'rgba(234,134,0,0.08)' : 'rgba(217,48,37,0.08)'}; border-color:${isAmber ? '#ea8600' : '#d93025'}">
          <strong>${isTe ? 'హెచ్చరిక వివరాలు:' : 'Hazard Bulletin:'}</strong>
          <span>${isTe ? h.descTe : h.desc}</span>
        </div>

        <div class="gcard-actions">
          <button class="gcard-btn gcard-btn-secondary" onclick="window.switchView('alerts');">
            <span>${isTe ? 'పూర్తి హెచ్చరికలు చూడండి' : 'View Full Alert Bulletins'}</span>
          </button>
        </div>
      `;
    } else if (item.type === 'boat') {
      const b = item.data;
      card.innerHTML = `
        <div class="gcard-header">
          <div class="gcard-badge gcard-badge-blue">
            <span>🛥️</span>
            <span>${isTe ? 'ప్రత్యక్ష నావిగేషన్ GPS' : 'LIVE VESSEL TELEMETRY'}</span>
          </div>
          <button class="gcard-close-btn" onclick="window.orcaMap.closePopup()" aria-label="Close">✕</button>
        </div>

        <h3 class="gcard-title">${b.name}</h3>
        <div class="gcard-rating-row">
          <span class="gcard-score" style="color:#1a73e8;">Status: ${b.status}</span>
        </div>

        <div class="gcard-meta-grid">
          <div class="gcard-meta-box">
            <span class="gcard-meta-label">${isTe ? 'వేగం' : 'SPEED'}</span>
            <span class="gcard-meta-value text-blue">${b.speed}</span>
          </div>
          <div class="gcard-meta-box">
            <span class="gcard-meta-label">${isTe ? 'దిశ' : 'HEADING'}</span>
            <span class="gcard-meta-value">${b.heading}° ESE</span>
          </div>
          <div class="gcard-meta-box" style="grid-column: span 2;">
            <span class="gcard-meta-label">${isTe ? 'కోఆర్డినేట్స్' : 'COORDINATES'}</span>
            <span class="gcard-meta-value">${b.lat.toFixed(4)}° N, ${b.lon.toFixed(4)}° E</span>
          </div>
        </div>

        <div class="gcard-actions">
          <button class="gcard-btn gcard-btn-primary" onclick="window.orcaMap.recenterBoat();">
            <span>${isTe ? 'పడవను కేంద్రీకరించు' : 'Center on Vessel'}</span>
          </button>
        </div>
      `;
    }
  }

  closePopup() {
    this.selectedItem = null;
    const card = document.getElementById('map-zone-popup');
    if (card) card.classList.add('hidden');
  }

  // ==========================================
  // Public Interface & Controller Methods
  // ==========================================

  // Map Tile Switcher (Map / Satellite / Terrain)
  setMapType(type) {
    if (this.currentMapType === type) return;

    // Remove active tile layer
    if (this.tileLayers[this.currentMapType]) {
      this.map.removeLayer(this.tileLayers[this.currentMapType]);
    }

    this.currentMapType = type;

    // Add new tile layer
    if (this.tileLayers[type]) {
      this.tileLayers[type].addTo(this.map);
    }
  }

  // Toggle specific geospatial layer
  toggleLayer(layerName, isChecked) {
    if (this.layers.hasOwnProperty(layerName)) {
      this.layers[layerName] = isChecked;

      if (layerName === 'pfz') {
        if (isChecked) this.renderPFZ();
        else this.layerGroups.pfz.clearLayers();
      } else if (layerName === 'hazard') {
        if (isChecked) this.renderHazards();
        else this.layerGroups.hazards.clearLayers();
      } else if (layerName === 'imbl') {
        if (isChecked) this.renderIMBL();
        else this.layerGroups.imbl.clearLayers();
      } else if (layerName === 'route') {
        if (isChecked) this.renderRoute();
        else this.layerGroups.route.clearLayers();
      }
    }
  }

  // Smoothly center on user's vessel
  recenterBoat() {
    if (this.map && this.userBoat) {
      this.map.flyTo([this.userBoat.lat, this.userBoat.lon], 11, {
        animate: true,
        duration: 0.9
      });
      this.selectedItem = { type: 'boat', data: this.userBoat };
      this.updatePlaceCard(this.selectedItem);
    }
  }

  // When a port is selected from header dropdown or place card
  setPort(portKey) {
    const port = this.ports.find(p => p.key === portKey || p.name.toLowerCase().includes(portKey.toLowerCase()));
    if (port && this.map) {
      this.map.flyTo([port.lat, port.lon], 10, {
        animate: true,
        duration: 1.0
      });

      // Update boat location near selected port
      this.userBoat.lat = port.lat - 0.04;
      this.userBoat.lon = port.lon + 0.07;
      this.routePoints[0] = { lat: port.lat, lon: port.lon, label: port.name };
      this.routePoints[1] = { lat: this.userBoat.lat, lon: this.userBoat.lon, label: 'Boat Position' };

      this.renderUserBoat();
      this.renderRoute();

      // Refresh backend GeoJSON overlay for newly selected port location
      this.loadBackendMapPayload(port.lat, port.lon);
    }
  }

  selectAsBasePort(portKey) {
    const portSelect = document.getElementById('port-select');
    if (portSelect) {
      portSelect.value = portKey;
      portSelect.dispatchEvent(new Event('change'));
    }
  }

  // Navigate to specific zone (sets destination & zooms)
  navigateToZone(zoneId) {
    const zone = this.pfzZones.find(z => z.id === zoneId);
    if (zone && this.map) {
      this.routePoints[3] = { lat: zone.lat, lon: zone.lon, label: zone.name };
      this.layers.route = true;
      const routeChip = document.getElementById('chip-route');
      if (routeChip) routeChip.classList.add('gmap-chip-active');
      this.renderRoute();

      // Fit bounds to show boat and target zone
      const bounds = L.latLngBounds(
        [this.userBoat.lat, this.userBoat.lon],
        [zone.lat, zone.lon]
      );
      this.map.fitBounds(bounds.pad(0.35), { animate: true });
    }
  }

  // Highlight specific zone by ID
  highlightZone(zoneId) {
    const target = this.pfzZones.find(z => z.id === zoneId);
    if (target && this.map) {
      this.selectedItem = { type: 'pfz', data: target };
      this.updatePlaceCard(this.selectedItem);
      this.map.flyTo([target.lat, target.lon], 10, { animate: true, duration: 0.8 });
    }
  }

  // Invalidate map dimensions on view change or window resize
  onResize() {
    if (this.map) {
      this.map.invalidateSize();
    }
  }

  // Load and render GeoJSON map payload from Backend API (GET /debug/map-payload)
  async loadBackendMapPayload(lat, lon) {
    if (!this.map) return;
    if (!this.layerGroups.backend) {
      this.layerGroups.backend = L.layerGroup().addTo(this.map);
    }
    this.layerGroups.backend.clearLayers();

    if (!window.orcaApi || typeof window.orcaApi.getMapPayload !== 'function') {
      return;
    }

    try {
      const payload = await window.orcaApi.getMapPayload(lat, lon);
      if (!payload || !payload.features) return;

      const isTe = window.orcaI18n && window.orcaI18n.currentLang === 'te';

      const geoJsonLayer = L.geoJSON(payload, {
        style: (feature) => {
          const props = feature.properties || {};
          const layerType = props.layer || '';
          if (layerType === 'boundary_zone' || layerType === 'eez_boundary') {
            return {
              color: props.stroke || '#f87171',
              weight: props['stroke-width'] || 2.5,
              opacity: 0.9,
              dashArray: '8, 6',
              fillColor: props.stroke || '#f87171',
              fillOpacity: typeof props['fill-opacity'] === 'number' ? props['fill-opacity'] : 0.08,
            };
          }
          return {
            color: '#3b82f6',
            weight: 2,
            opacity: 0.8,
          };
        },
        pointToLayer: (feature, latlng) => {
          const props = feature.properties || {};
          const layerType = props.layer || '';

          if (layerType === 'pfz_advisory') {
            const fishSvg = `
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#137333" stroke-width="2.3">
                <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6s-7.56-2.54-8.5-6z"/>
                <circle cx="18" cy="12" r="1.5" fill="#137333"/>
              </svg>
            `;
            const pinIcon = this.createGooglePin({
              color: '#34a853',
              iconSvg: fishSvg,
              label: props.station_name || 'PFZ',
              size: 32,
            });
            return L.marker(latlng, { icon: pinIcon });
          }

          if (layerType === 'alert') {
            const warnSvg = `
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ea4335" stroke-width="2.5">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            `;
            const pinIcon = this.createGooglePin({
              color: props['marker-color'] || '#ea4335',
              iconSvg: warnSvg,
              label: 'Alert',
              size: 32,
            });
            return L.marker(latlng, { icon: pinIcon });
          }

          // Fallback circle marker for points like user_location
          return L.circleMarker(latlng, {
            radius: 6,
            color: '#1a73e8',
            fillColor: '#60a5fa',
            fillOpacity: 0.8,
            weight: 2,
          });
        },
        onEachFeature: (feature, layer) => {
          const props = feature.properties || {};
          const layerType = props.layer || '';

          if (layerType === 'pfz_advisory') {
            const popupHtml = `
              <div class="gmap-popup">
                <div class="gmap-popup-header">
                  <span class="gmap-popup-category" style="color: #34a853;">🎣 INCOIS PFZ ADVISORY</span>
                  <div class="gmap-popup-title">${props.station_name || 'Target Station'}</div>
                </div>
                <div class="gmap-popup-body">
                  <div style="font-size:11px; margin-bottom: 6px;">${props.advisory_text || ''}</div>
                  <div style="font-size:11px; color:#5f6368;">
                    <strong>SST:</strong> ${props.sst_value ? props.sst_value + ' °C' : 'N/A'}<br>
                    <strong>Distance:</strong> ${props.distance_km != null ? props.distance_km.toFixed(1) + ' km' : 'N/A'}<br>
                    <strong>Forecast Date:</strong> ${props.forecast_date || 'Today'}
                  </div>
                </div>
              </div>
            `;
            layer.bindPopup(popupHtml);
          } else if (layerType === 'boundary_zone' || layerType === 'eez_boundary') {
            const popupHtml = `
              <div class="gmap-popup">
                <div class="gmap-popup-header">
                  <span class="gmap-popup-category" style="color: #f87171;">🚩 MARITIME BOUNDARY</span>
                  <div class="gmap-popup-title">${props.name || 'EEZ Zone'}</div>
                </div>
                <div class="gmap-popup-body">
                  <div style="font-size:11px; color:#5f6368;">
                    Official India Exclusive Economic Zone perimeter for Andhra Pradesh coastal monitoring.
                  </div>
                </div>
              </div>
            `;
            layer.bindPopup(popupHtml);
          } else if (layerType === 'alert') {
            const popupHtml = `
              <div class="gmap-popup">
                <div class="gmap-popup-header">
                  <span class="gmap-popup-category" style="color: #ea4335;">⚠️ ACTIVE WARNING</span>
                  <div class="gmap-popup-title">${props.title || 'Marine Alert'}</div>
                </div>
                <div class="gmap-popup-body">
                  <div style="font-size:11px; color:#374151;">${props.message || ''}</div>
                </div>
              </div>
            `;
            layer.bindPopup(popupHtml);
          }
        },
      });

      this.layerGroups.backend.addLayer(geoJsonLayer);

      // Smooth pan to coordinates if provided
      if (typeof lat === 'number' && typeof lon === 'number') {
        this.map.flyTo([lat, lon], 9, { animate: true, duration: 1.0 });
      }
    } catch (err) {
      console.warn('[OrcaMap] Failed to load backend map payload:', err);
    }
  }

  // Backward compatibility draw call
  draw() {
    this.renderUserBoat();
    this.renderRoute();
  }
}

window.OrcaMarineMap = OrcaMarineMap;
