/**
 * Aerodome Telemetry & Seed Mutation System
 */

class TelemetryManager {
  constructor(engine) {
    this.engine = engine;
    this.seedEl = document.getElementById('telemetry-seed');
    this.elevationEl = document.getElementById('telemetry-elevation');
    this.gridEl = document.getElementById('telemetry-grid');
    this.newSeedBtn = document.getElementById('new-seed-btn');

    this.currentSeed = 'AX-974983';
    this.currentElevation = 2057;
    this.currentLat = 45.71;
    this.currentLon = 73.64;

    this.init();
  }

  init() {
    if (this.newSeedBtn) {
      this.newSeedBtn.addEventListener('click', () => this.generateNewSeed());
    }

    // Keyboard shortcut [R] to regenerate seed
    window.addEventListener('keydown', (e) => {
      if ((e.key === 'r' || e.key === 'R') && !this.isInputFocused()) {
        e.preventDefault();
        this.generateNewSeed();
      }
    });

    this.updateDisplay();
  }

  isInputFocused() {
    const active = document.activeElement;
    return active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');
  }

  generateNewSeed() {
    // Prefix choices: AX, NX, KX, ZX, RX
    const prefixes = ['AX', 'NX', 'KX', 'ZX', 'RX', 'VX', 'SX'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const number = Math.floor(100000 + Math.random() * 900000);
    this.currentSeed = `${prefix}-${number}`;

    // Elevation varies procedurally between 1,200m and 4,800m
    this.currentElevation = Math.floor(1200 + Math.random() * 3200);

    // Lat/Lon variation
    this.currentLat = (30 + Math.random() * 35).toFixed(2);
    this.currentLon = (40 + Math.random() * 60).toFixed(2);

    // Flash animation on HUD
    this.triggerHudFlash();
    this.updateDisplay();

    // Update 3D Terrain Engine
    if (this.engine) {
      this.engine.setSeed(this.currentSeed);
    }
  }

  triggerHudFlash() {
    const elements = [this.seedEl, this.elevationEl, this.gridEl];
    elements.forEach(el => {
      if (el) {
        el.classList.add('flash');
        setTimeout(() => el.classList.remove('flash'), 500);
      }
    });
  }

  updateDisplay() {
    if (this.seedEl) this.seedEl.textContent = this.currentSeed;
    if (this.elevationEl) this.elevationEl.textContent = `${this.currentElevation.toLocaleString()} M`;
    if (this.gridEl) this.gridEl.textContent = `${this.currentLat}°N ${this.currentLon}°W`;
  }
}

window.TelemetryManager = TelemetryManager;
