/**
 * Aerodome Procedural Terrain Engine
 * Real-time WebGL topographical contour field simulation
 */

class TerrainEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.container = this.canvas.parentElement;
    this.seed = 'AX-974983';
    this.targetSeed = this.seed;
    this.seedNum = this.hashSeed(this.seed);
    
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.time = 0;

    this.init();
  }

  hashSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  init() {
    if (typeof THREE !== 'undefined') {
      this.initThree();
    } else {
      this.initCanvasFallback();
    }

    // Interactive pointer parallax
    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      this.targetMouseX = x * 2;
      this.targetMouseY = y * 2;
    });

    window.addEventListener('resize', () => this.onResize());
  }

  initThree() {
    this.isThree = true;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x050807);
    this.scene.fog = new THREE.FogExp2(0x050807, 0.009);

    // Camera (58 deg FOV as defined in DESIGN.md)
    this.camera = new THREE.PerspectiveCamera(58, width / height, 1, 1000);
    this.camera.position.set(0, 45, 95);
    this.camera.lookAt(0, 10, 0);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Generate Procedural Topographic Grid
    this.createTerrainGeometry();

    // Subtle atmospheric ambient light
    const ambientLight = new THREE.AmbientLight(0x0c2b26, 1.8);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x9fd8bd, 1.2);
    directionalLight.position.set(50, 100, 50);
    this.scene.add(directionalLight);

    this.animate();
  }

  createTerrainGeometry() {
    if (this.terrainMesh) {
      this.scene.remove(this.terrainMesh);
      if (this.contourGroup) this.scene.remove(this.contourGroup);
    }

    const segmentsX = 140;
    const segmentsY = 100;
    const sizeX = 260;
    const sizeY = 200;

    this.planeGeo = new THREE.PlaneGeometry(sizeX, sizeY, segmentsX, segmentsY);
    this.planeGeo.rotateX(-Math.PI / 2);

    this.basePositions = this.planeGeo.attributes.position.array.slice();
    this.updateHeights();

    // Wireframe Mesh with soft mint luminescence
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x9fd8bd,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    });

    this.terrainMesh = new THREE.Mesh(this.planeGeo, wireframeMat);
    this.scene.add(this.terrainMesh);

    // Create stacked elevation contour lines
    this.createContourLines(segmentsX, segmentsY, sizeX, sizeY);
  }

  createContourLines(nx, ny, sx, sy) {
    this.contourGroup = new THREE.Group();
    const pos = this.planeGeo.attributes.position.array;

    // Generate iso-contour lines across Y segments
    for (let j = 0; j < ny; j += 2) {
      const points = [];
      for (let i = 0; i <= nx; i++) {
        const idx = (j * (nx + 1) + i) * 3;
        points.push(new THREE.Vector3(pos[idx], pos[idx + 1] + 0.1, pos[idx + 2]));
      }

      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      // Brightness increases near peaks
      const progress = j / ny;
      const opacity = 0.25 + progress * 0.55;
      
      const lineMat = new THREE.LineBasicMaterial({
        color: progress > 0.6 ? 0xb5edd5 : 0x9fd8bd,
        transparent: true,
        opacity: opacity,
        linewidth: 1.5
      });

      const line = new THREE.Line(lineGeo, lineMat);
      this.contourGroup.add(line);
    }

    this.scene.add(this.contourGroup);
  }

  // Noise generator based on seed
  noise(x, z, seed) {
    const s = seed * 0.0001;
    const n1 = Math.sin(x * 0.035 + s) * Math.cos(z * 0.035 + s);
    const n2 = Math.sin(x * 0.015 - z * 0.02 + s * 1.5) * 1.8;
    const n3 = Math.cos(x * 0.07 + z * 0.06 + s * 2.1) * 0.5;
    const ridged = 1.0 - Math.abs(n1 + n2 * 0.5);
    return Math.pow(Math.max(0, ridged), 1.8) * 28 + n3 * 4;
  }

  updateHeights(deltaOffset = 0) {
    if (!this.planeGeo) return;
    const pos = this.planeGeo.attributes.position.array;
    const seedVal = this.seedNum;

    for (let i = 0; i < pos.length; i += 3) {
      const x = pos[i];
      const z = pos[i + 2];
      
      // Calculate procedural height with geological ridge erosion feel
      const distFromCenter = Math.sqrt(x * x + z * z);
      const falloff = Math.max(0, 1 - distFromCenter / 140);
      
      const h = this.noise(x, z + deltaOffset, seedVal) * (0.4 + falloff * 0.8);
      pos[i + 1] = h;
    }

    this.planeGeo.attributes.position.needsUpdate = true;
    this.planeGeo.computeVertexNormals();
  }

  // Smoothly morph into a new seed
  setSeed(newSeed) {
    this.seed = newSeed;
    this.seedNum = this.hashSeed(newSeed);
    this.createTerrainGeometry();
  }

  onResize() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    if (this.isThree && this.renderer && this.camera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    } else if (this.ctx) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.time += 0.008;

    // Smooth cursor interpolation
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    if (this.isThree) {
      // Camera parallax
      this.camera.position.x = this.mouseX * 16;
      this.camera.position.y = 42 - this.mouseY * 12;
      this.camera.lookAt(this.mouseX * 4, 12, -20);

      // Terrain gentle wave drift
      if (this.terrainMesh) {
        this.terrainMesh.position.z = Math.sin(this.time * 0.5) * 1.5;
      }
      if (this.contourGroup) {
        this.contourGroup.position.z = Math.sin(this.time * 0.5) * 1.5;
      }

      this.renderer.render(this.scene, this.camera);
    } else if (this.ctx) {
      this.renderCanvasFallback();
    }
  }

  /* High fidelity Canvas 2D Fallback if Three.js is not loaded */
  initCanvasFallback() {
    this.ctx = this.canvas.getContext('2d');
    this.onResize();
    this.animate();
  }

  renderCanvasFallback() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    ctx.fillStyle = '#050807';
    ctx.fillRect(0, 0, w, h);

    const lines = 40;
    const step = h / lines;
    const t = this.time;
    const s = this.seedNum * 0.0001;

    for (let j = 10; j < lines; j++) {
      ctx.beginPath();
      const progress = j / lines;
      ctx.strokeStyle = `rgba(159, 216, 189, ${0.15 + progress * 0.5})`;
      ctx.lineWidth = 1 + progress;

      for (let x = 0; x <= w; x += 15) {
        const nx = (x - w / 2) * 0.005;
        const nz = j * 0.08;
        const elevation = Math.sin(nx * 4 + s + t) * Math.cos(nz * 2 + s) * 50 * progress;
        const y = j * step + elevation + (this.mouseY * 20 * progress);

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  }
}

window.TerrainEngine = TerrainEngine;
