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

    // Update Floating Chatbot Button (FAB) state across views
    const floatingChatBtn = document.getElementById('floating-orca-chat-btn');
    if (floatingChatBtn) {
      if (targetView === 'chat') {
        floatingChatBtn.classList.add('is-chat-active');
      } else {
        floatingChatBtn.classList.remove('is-chat-active');
      }
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

  // Floating Chatbot Button (FAB) -> Fixed on every screen, directs to Chat Bot
  const floatingChatBtn = document.getElementById('floating-orca-chat-btn');
  if (floatingChatBtn) {
    floatingChatBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.switchView('chat');
      const input = document.getElementById('chat-main-input');
      if (input) {
        input.focus();
        input.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // 5. Port / Harbor Switcher (Andhra Pradesh Ports)
  const portSelect = document.getElementById('port-select');
  if (portSelect) {
    portSelect.addEventListener('change', (e) => {
      const portName = e.target.value;
      updatePortContext(portName);
    });
  }

  // Initialize Custom Glassmorphic Port Selector Component
  function initCustomPortSelector() {
    const wrapper = document.getElementById('port-selector-wrapper');
    const nativeSelect = document.getElementById('port-select');
    const trigger = document.getElementById('port-dropdown-trigger');
    const menu = document.getElementById('port-dropdown-menu');
    const optionsContainer = document.getElementById('port-dropdown-options');
    const triggerCurrent = document.getElementById('port-trigger-current');

    if (!wrapper || !nativeSelect || !trigger || !menu || !optionsContainer || !triggerCurrent) {
      return;
    }

    const portMetadata = {
      visakhapatnam: { coords: '17.68° N, 83.21° E', type_en: 'Major Deepwater Harbor', type_te: 'ప్రధాన లోతైన రేవు' },
      kakinada: { coords: '16.98° N, 82.24° E', type_en: 'Fishery & Anchorage Port', type_te: 'మత్స్య & యాంకరేజ్ రేవు' },
      machilipatnam: { coords: '16.18° N, 81.13° E', type_en: 'Krishna Estuary Coast', type_te: 'కృష్ణా డెల్టా తీరం' },
      nizampatnam: { coords: '15.90° N, 80.67° E', type_en: 'Guntur Fishery Harbor', type_te: 'గుంటూరు మత్స్య రేవు' },
    };

    function renderOptions() {
      const currentLang = (window.orcaI18n && window.orcaI18n.currentLang) || 'en';
      const portList = (typeof ORCA_PORTS_I18N !== 'undefined' && ORCA_PORTS_I18N[currentLang]) || [
        { value: 'visakhapatnam', text: 'Visakhapatnam Harbor' },
        { value: 'kakinada', text: 'Kakinada Fishery Port' },
        { value: 'machilipatnam', text: 'Machilipatnam Coast' },
        { value: 'nizampatnam', text: 'Nizampatnam Harbor' },
      ];

      const currentVal = nativeSelect.value || 'visakhapatnam';
      const activeObj = portList.find(p => p.value === currentVal) || portList[0];
      if (triggerCurrent && activeObj) {
        triggerCurrent.textContent = activeObj.text;
      }

      optionsContainer.innerHTML = portList.map(port => {
        const meta = portMetadata[port.value] || { coords: '', type_en: '', type_te: '' };
        const typeText = currentLang === 'te' ? meta.type_te : meta.type_en;
        const isSelected = port.value === currentVal;

        return `
          <div class="port-dropdown-item ${isSelected ? 'is-selected' : ''}" data-value="${port.value}" role="option" aria-selected="${isSelected}">
            <div class="port-item-info">
              <span class="port-item-name">${port.text}</span>
              <div class="port-item-meta">
                <span>${meta.coords}</span>
                <span>•</span>
                <span class="port-item-type">${typeText}</span>
              </div>
            </div>
            <div class="port-item-check" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
        `;
      }).join('');

      // Add click listeners to custom options
      optionsContainer.querySelectorAll('.port-dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const val = item.getAttribute('data-value');
          if (val) {
            selectPort(val);
            closeDropdown();
          }
        });
      });
    }

    function selectPort(portValue) {
      if (nativeSelect.value !== portValue) {
        nativeSelect.value = portValue;
        nativeSelect.dispatchEvent(new Event('change'));
      } else {
        renderOptions();
      }
    }

    function toggleDropdown() {
      const isOpen = menu.classList.contains('is-open');
      if (isOpen) {
        closeDropdown();
      } else {
        openDropdown();
      }
    }

    function openDropdown() {
      renderOptions();
      menu.classList.add('is-open');
      trigger.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
    }

    function closeDropdown() {
      menu.classList.remove('is-open');
      trigger.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    }

    // Toggle on trigger click
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown();
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        closeDropdown();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeDropdown();
        trigger.focus();
      }
    });

    // Prevent mouse wheel over port selector from scrolling the website
    const handleWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();

      // If dropdown menu is open, allow smooth scrolling of the options list
      if (menu && menu.classList.contains('is-open') && optionsContainer) {
        optionsContainer.scrollTop += e.deltaY;
      }
    };

    wrapper.addEventListener('wheel', handleWheel, { passive: false });
    trigger.addEventListener('wheel', handleWheel, { passive: false });
    menu.addEventListener('wheel', handleWheel, { passive: false });

    // Sync when native select changes (e.g. from map or other controllers)
    nativeSelect.addEventListener('change', () => {
      renderOptions();
    });

    // Expose sync functions globally for i18n and map
    window.orcaPortSelector = {
      syncLanguage: () => renderOptions(),
      open: openDropdown,
      close: closeDropdown,
      select: selectPort,
    };

    // Initial render
    renderOptions();
  }

  initCustomPortSelector();

  async function updatePortContext(portName) {
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

    const snapWind = document.getElementById('metric-wind-val') || document.getElementById('snapshot-wind');
    if (snapWind) snapWind.textContent = target.wind;

    const snapWaves = document.getElementById('metric-waves-val') || document.getElementById('snapshot-waves');
    if (snapWaves) snapWaves.textContent = target.waves;

    const snapReasoning = document.getElementById('snapshot-reasoning');
    if (snapReasoning) {
      snapReasoning.innerHTML = `<strong>${isTe ? 'సలహా:' : 'Advisory:'}</strong> ${target.reasoning}`;
    }

    // Query API Risk & Alerts asynchronously to refresh conditions card with live backend metrics
    if (window.orcaApi) {
      try {
        const [risk, alerts] = await Promise.all([
          window.orcaApi.getRisk(target.lat, target.lon),
          window.orcaApi.getAlerts(target.lat, target.lon),
        ]);

        if (risk) {
          if (snapWind && risk.wind_speed_kts != null) {
            snapWind.textContent = `${risk.wind_speed_kts} kts`;
          }
          if (snapWaves && risk.wave_height_m != null) {
            snapWaves.textContent = `${risk.wave_height_m}m swell`;
          }
          if (snapVerdict && risk.verdict) {
            const v = risk.verdict.toLowerCase();
            snapVerdict.className = `verdict-badge verdict-${v}`;
            const isSafe = v === 'safe';
            const vIcon = isSafe
              ? (window.Morphicons ? window.Morphicons.get('check', { size: 14, color: '#4ade80' }) : '')
              : (window.Morphicons ? window.Morphicons.get('warning', { size: 14, color: '#e2a356' }) : '');
            const label = isSafe ? (isTe ? 'సురక్షితం' : 'SAFE TO SAIL') : (isTe ? 'జాగ్రత్త' : 'CAUTION');
            snapVerdict.innerHTML = `${vIcon} <span>${label}</span>`;
          }
          const boundaryEl = document.getElementById('metric-boundary-val');
          if (boundaryEl && risk.eez_distance_km != null) {
            boundaryEl.textContent = `${risk.eez_distance_km.toFixed(1)} km Clear`;
          }
        }

        if (alerts && typeof alerts.total_count === 'number') {
          const alertsBadge = document.querySelector('#tab-btn-alerts .badge-count');
          if (alertsBadge) {
            alertsBadge.textContent = alerts.total_count;
          }
        }
      } catch (err) {
        console.warn('[OrcaApp] Failed to fetch live port risk/alerts:', err);
      }
    }

    // Update Boat position on map & fly to harbor
    if (window.orcaMap) {
      window.orcaMap.setPort(portName);
    }
  }

  // Connect Backend API Status Pill in Header
  const apiStatusEl = document.getElementById('orca-api-status');
  const apiStatusText = document.getElementById('orca-api-status-text');

  if (window.orcaApi && apiStatusEl && apiStatusText) {
    window.orcaApi.onStatusChange((isOnline, baseUrl) => {
      const isTe = window.orcaI18n && window.orcaI18n.currentLang === 'te';
      if (isOnline) {
        apiStatusEl.className = 'orca-api-status-pill is-online';
        apiStatusText.textContent = isTe ? 'లైవ్ API (8000)' : 'Live API (8000)';
        apiStatusEl.title = `Connected to ORCA Backend API at ${baseUrl}`;
      } else {
        apiStatusEl.className = 'orca-api-status-pill is-offline';
        apiStatusText.textContent = isTe ? 'స్టాండ్‌అలోన్ మోడ్' : 'Standalone Mode';
        apiStatusEl.title = `Backend at ${baseUrl} is offline; High-Fidelity Standalone Engine Active. Click to re-check.`;
      }
    });

    apiStatusEl.addEventListener('click', () => {
      apiStatusText.textContent = 'Checking...';
      window.orcaApi.checkHealth();
    });
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

