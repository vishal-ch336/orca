/**
 * ORCA — Main Application Controller
 * Handles view switching, port switching, map initialization, and UI sync.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Ocean Volumetric WebGL Background Field
  const oceanEngine = new ReactBitsLandscape('terrain-canvas');

  // 2. Initialize Interactive Marine Navigation Map (Google Maps Engine)
  const mapEngine = new OrcaMarineMap('orca-leaflet-map');
  window.orcaMap = mapEngine;

  // 3. Initialize AI Conversational Safety Assistant
  const chatManager = new OrcaChatManager('chat-thread', 'chat-user-input', 'chat-send-btn');
  window.orcaChat = chatManager;

  // 4. Multi-Feature View Switcher (Landing, Chatbot, Map, Alerts, Evidences)
  const views = ['landing', 'chat', 'map', 'alerts', 'evidences'];

  window.switchView = function (targetView) {
    views.forEach((v) => {
      const el = document.getElementById(`view-${v}`);
      const btn = document.getElementById(`tab-btn-${v}`);
      if (el) {
        if (v === targetView) {
          el.classList.add('active-view');
        } else {
          el.classList.remove('active-view');
        }
      }
      if (btn) {
        if (v === targetView) {
          btn.classList.add('tab-active');
        } else {
          btn.classList.remove('tab-active');
        }
      }
    });

    if (targetView === 'map') {
      setTimeout(() => {
        if (window.orcaMap) window.orcaMap.onResize();
      }, 50);
    } else if (targetView === 'landing') {
      setTimeout(() => {
        if (oceanEngine) oceanEngine.onResize();
      }, 50);
    } else if (targetView === 'chat') {
      const input = document.getElementById('chat-main-input');
      if (input) input.focus();
    }
  };

  // Bind Header Feature Tab Navigation Buttons
  views.forEach((v) => {
    const btn = document.getElementById(`tab-btn-${v}`);
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.switchView(v);
      });
    }
  });

  // Hero Primary CTA -> Routes directly to the Chat Bot view per user request
  const heroLaunchBtn = document.getElementById('hero-launch-orca-btn');
  if (heroLaunchBtn) {
    heroLaunchBtn.addEventListener('click', () => window.switchView('chat'));
  }

  // 5. Port / Harbor Switcher (Andhra Pradesh Ports)
  const portSelect = document.getElementById('port-select');
  if (portSelect) {
    portSelect.addEventListener('change', (e) => {
      const portName = e.target.value;
      updatePortContext(portName);
    });
  }

  function updatePortContext(portName) {
    const portData = {
      visakhapatnam: {
        name: 'Visakhapatnam Harbor',
        telugu: 'విశాఖపట్నం',
        coords: '17.6868° N, 83.2185° E',
        wind: '14 kts ENE',
        waves: '1.8m swell',
        verdict: 'Caution',
        verdictText: '⚠️ CAUTION (హెచ్చరిక)',
        reasoning: 'Safe for motorized craft up to 15 NM. High swell active further offshore.',
        lat: 17.65,
        lon: 83.28,
      },
      kakinada: {
        name: 'Kakinada Fishery Port',
        telugu: 'కాకినాడ',
        coords: '16.9891° N, 82.2475° E',
        wind: '18 kts E',
        waves: '2.8m - 3.2m swell',
        verdict: 'Caution',
        verdictText: '⚠️ CAUTION (హెచ్చరిక)',
        reasoning: 'Rough sea conditions near Godavari mouth. Keep small catamarans near bay.',
        lat: 16.90,
        lon: 82.35,
      },
      machilipatnam: {
        name: 'Machilipatnam Coast',
        telugu: 'మచిలీపట్నం',
        coords: '16.1875° N, 81.1389° E',
        wind: '11 kts NE',
        waves: '1.4m calm',
        verdict: 'Safe',
        verdictText: '✓ SAFE (సురక్షితం)',
        reasoning: 'Calm conditions for all craft classes. High sardine catch probability in shelf zone.',
        lat: 16.12,
        lon: 81.25,
      },
      nizampatnam: {
        name: 'Nizampatnam Harbor',
        telugu: 'నిజాంపట్నం',
        coords: '15.9042° N, 80.6722° E',
        wind: '12 kts ENE',
        waves: '1.5m moderate',
        verdict: 'Safe',
        verdictText: '✓ SAFE (సురక్షితం)',
        reasoning: 'Favorable winds and mild swell. Clear visibility beyond 12 km.',
        lat: 15.85,
        lon: 80.75,
      },
    };

    const target = portData[portName] || portData.visakhapatnam;

    // Update GPS Coordinates badge
    const coordsEl = document.getElementById('header-gps-coords');
    if (coordsEl) coordsEl.textContent = target.coords;

    // Update Live Conditions Snapshot on Landing Page
    const isTe = window.orcaI18n && window.orcaI18n.currentLang === 'te';
    const snapTitle = document.getElementById('snapshot-port-title');
    if (snapTitle) {
      snapTitle.textContent = isTe
        ? `తీరప్రాంత పరిస్థితులు • ${target.telugu}`
        : `COASTAL CONDITIONS • ${target.name.toUpperCase()}`;
    }

    const snapVerdict = document.getElementById('snapshot-verdict');
    if (snapVerdict) {
      snapVerdict.className = `verdict-badge verdict-${target.verdict.toLowerCase()}`;
      const isSafe = target.verdict.toLowerCase() === 'safe';
      const vIcon = isSafe
        ? (window.Morphicons ? window.Morphicons.get('check', { size: 14, color: '#4ade80' }) : '')
        : (window.Morphicons ? window.Morphicons.get('warning', { size: 14, color: '#e2a356' }) : '');
      const label = isSafe ? (isTe ? 'సురక్షితం' : 'SAFE TO SAIL') : (isTe ? 'జాగ్రత్త' : 'CAUTION');
      snapVerdict.innerHTML = `${vIcon} <span>${label}</span>`;
    }

    const snapWind = document.getElementById('snapshot-wind');
    if (snapWind) snapWind.textContent = target.wind;

    const snapWaves = document.getElementById('snapshot-waves');
    if (snapWaves) snapWaves.textContent = target.waves;

    const snapReasoning = document.getElementById('snapshot-reasoning');
    if (snapReasoning) {
      snapReasoning.innerHTML = `<strong>${isTe ? 'సలహా:' : 'Advisory:'}</strong> ${target.reasoning}`;
    }

    // Update Boat position on map & fly to harbor
    if (window.orcaMap) {
      window.orcaMap.setPort(portName);
    }
  }

  // 6. Layer Checkbox Toggles
  const togglePfz = document.getElementById('toggle-pfz');
  const toggleHazard = document.getElementById('toggle-hazard');
  const toggleImbl = document.getElementById('toggle-imbl');
  const toggleRoute = document.getElementById('toggle-route');

  if (togglePfz) togglePfz.addEventListener('change', (e) => mapEngine.toggleLayer('pfz', e.target.checked));
  if (toggleHazard) toggleHazard.addEventListener('change', (e) => mapEngine.toggleLayer('hazard', e.target.checked));
  if (toggleImbl) toggleImbl.addEventListener('change', (e) => mapEngine.toggleLayer('imbl', e.target.checked));
  if (toggleRoute) toggleRoute.addEventListener('change', (e) => mapEngine.toggleLayer('route', e.target.checked));

  // 7. Hydrate all Morphicons on initial load
  if (window.Morphicons) {
    window.Morphicons.hydrate();
  }

  // 8. Dynamic Scroll Experience: Glowing Progress Bar & Hero Ocean Parallax
  const scrollProgressBar = document.getElementById('orca-scroll-progress');
  const heroContent = document.querySelector('.hero-content');
  const heroSnapshot = document.querySelector('.hero-conditions-snapshot');
  const scrollHint = document.querySelector('.hero-scroll-hint');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
    
    // Update Glowing Scroll Progress Bar
    if (scrollProgressBar) {
      const progress = Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));
      scrollProgressBar.style.width = `${progress}%`;
    }

    // Scroll Hint Fadeout
    if (scrollHint) {
      if (scrollY > 60) {
        scrollHint.style.opacity = '0';
        scrollHint.style.pointerEvents = 'none';
      } else {
        scrollHint.style.opacity = '1';
        scrollHint.style.pointerEvents = 'auto';
      }
    }

    // Gentle Parallax & Subtle Dive Effect on Hero (PRD Section 7)
    if (heroContent && window.innerWidth > 768) {
      const heroFade = Math.max(0, 1 - scrollY / 420);
      heroContent.style.opacity = heroFade;
      heroContent.style.transform = `translateY(${scrollY * 0.18}px)`;
    }
    if (heroSnapshot && window.innerWidth > 768) {
      const snapFade = Math.max(0, 1 - scrollY / 480);
      heroSnapshot.style.opacity = snapFade;
      heroSnapshot.style.transform = `translateY(${scrollY * 0.12}px)`;
    }

    // Subtle Speed & Pitch Modulation on WebGL Ocean Field
    if (oceanEngine && oceanEngine.props) {
      oceanEngine.props.speed = 0.35 + Math.min(scrollY * 0.0006, 0.4);
      oceanEngine.props.pitch = -0.14 - Math.min(scrollY * 0.0002, 0.08);
    }
  }, { passive: true });
});

