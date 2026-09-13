/**
 * React Bits Pro - Landscape Component (WebGL Raymarching Engine)
 * "A procedurally generated landscape scrolling toward the horizon"
 * Docs: https://pro.reactbits.dev/docs/components/landscape
 */

class ReactBitsLandscape {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    // React Bits Pro Landscape Props & Defaults (Crisp & Ridged)
    this.props = Object.assign(
      {
        speed: 0.35,              // Graceful, cinematic forward glide
        altitude: 6.2,            // Elevated vantage point overlooking broad terrain
        focal: 1.15,
        pitch: -0.14,             // Downward pitch to raise terrain view higher on screen
        elevation: 4.0,           // Majestic mountain ridges
        scale: 0.16,
        detail: 1.0,
        steps: 85,
        samples: 2,
        distance: 55.0,           // Extended view distance
        fogStart: 26.0,           // Distant horizon dissolve
        rampDistance: 42.0,
        // Adapted to Neuform Design Tokens:
        color: '#06130f',         // Rich dark ground
        midColor: '#050807',      // Middle distance
        farColor: '#a7e4c9',      // Luminous emerald horizon glow
        rimColor: '#c5f5e0',      // Light catching ridges
        rimPower: 3.6,
        rimStrength: 1.45,        // Stronger ridge definition
        ringColor: '#9fd8bd',     // Scanner rings sweeping outward
        ringSpacing: 0.5,
        ringSpeed: 1.2,           // Harmonious slower scanner wave
        ringWidth: 0.038,
        ringStrength: 0.45,
        gain: 1.0,
        grain: 0.04,
        grainRate: 24,
        vignette: 0.25,
        backgroundColor: '#050807', // Deep cosmic sky
        opacity: 1.0,
        cursorInteraction: true,
        cursorSteer: 0.45,
        paused: false,
        adaptiveQuality: true,
        targetFps: 60,
        dpr: 1.75,
      },
      options
    );

    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.time = 0;
    this.lastFrameTime = performance.now();

    this.init();
  }

  hexToVec3(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    const num = parseInt(hex, 16);
    return [
      ((num >> 16) & 255) / 255,
      ((num >> 8) & 255) / 255,
      (num & 255) / 255,
    ];
  }

  init() {
    this.gl =
      this.canvas.getContext('webgl2') ||
      this.canvas.getContext('webgl') ||
      this.canvas.getContext('experimental-webgl');

    if (!this.gl) {
      console.warn('WebGL not supported, falling back to 2D context.');
      return;
    }

    this.initShaders();
    this.initBuffers();
    this.setupListeners();
    this.onResize();

    requestAnimationFrame((t) => this.render(t));
  }

  initShaders() {
    const gl = this.gl;

    const vsSource = `
      attribute vec2 aPosition;
      varying vec2 vUv;
      void main() {
        vUv = (aPosition + 1.0) * 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision highp float;
      varying vec2 vUv;

      uniform vec2 uResolution;
      uniform float uTime;
      uniform vec2 uMouse;
      uniform float uSpeed;
      uniform float uAltitude;
      uniform float uFocal;
      uniform float uPitch;
      uniform float uElevation;
      uniform float uScale;
      uniform float uDetail;
      uniform int uSteps;
      uniform float uDistance;
      uniform float uFogStart;
      uniform float uRampDistance;
      uniform vec3 uColor;
      uniform vec3 uMidColor;
      uniform vec3 uFarColor;
      uniform vec3 uRimColor;
      uniform float uRimPower;
      uniform float uRimStrength;
      uniform vec3 uRingColor;
      uniform float uRingSpacing;
      uniform float uRingSpeed;
      uniform float uRingWidth;
      uniform float uRingStrength;
      uniform float uGain;
      uniform float uGrain;
      uniform float uVignette;
      uniform vec3 uBackgroundColor;
      uniform float uOpacity;

      // Pseudo-random & procedural terrain noise
      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      // Layered Fractional Brownian Motion with Ridged Crests
      float fbm(vec2 p) {
        float v = 0.0;
        float amp = 0.55;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 5; i++) {
          float n = smoothNoise(p);
          // Ridged crest shaping for dramatic geological peaks
          v += (1.0 - abs(n * 2.0 - 1.0)) * amp;
          p = rot * p * 2.05 + shift;
          amp *= 0.48;
        }
        return v;
      }

      // Heightfield function
      float terrainHeight(vec2 xz) {
        vec2 p = xz * uScale;
        float h = fbm(p);
        // Fine detail layer
        h += smoothNoise(p * 4.0) * 0.15 * uDetail;
        return h * uElevation;
      }

      // Distance estimation for ray marching
      float map(vec3 p) {
        return p.y - terrainHeight(p.xz);
      }

      // Surface normal via central difference
      vec3 calcNormal(vec3 p, float t) {
        float eps = 0.003 * max(1.0, t * 0.2);
        return normalize(vec3(
          map(p + vec3(eps, 0.0, 0.0)) - map(p - vec3(eps, 0.0, 0.0)),
          2.0 * eps,
          map(p + vec3(0.0, 0.0, eps)) - map(p - vec3(0.0, 0.0, eps))
        ));
      }

      void main() {
        vec2 uv = (gl_FragCoord.xy - uResolution * 0.5) / uResolution.y;

        // Camera positioning & forward scroll toward the horizon
        float zTravel = uTime * uSpeed * 6.0;
        vec3 ro = vec3(uMouse.x * 2.5, uAltitude, zTravel);
        
        // Ray direction with focal FOV and pitch tilt
        float yaw = uMouse.x * 0.25;
        vec3 rd = normalize(vec3(uv.x * uFocal + yaw, uv.y * uFocal + uPitch - uMouse.y * 0.15, 1.0));

        // Raymarching loop
        float t = 0.1;
        float maxD = uDistance;
        float hit = 0.0;
        vec3 p = ro;

        for (int i = 0; i < 80; i++) {
          p = ro + rd * t;
          float d = map(p);
          if (d < 0.003 * t) {
            hit = 1.0;
            break;
          }
          t += max(d * 0.6, 0.04 * t);
          if (t > maxD) break;
        }

        vec3 finalColor = uBackgroundColor;

        if (hit > 0.5) {
          vec3 n = calcNormal(p, t);

          // 1. Depth Color Ramp (near -> mid -> far)
          float depthFactor = clamp(t / uRampDistance, 0.0, 1.0);
          vec3 groundColor = mix(uColor, uMidColor, smoothstep(0.0, 0.45, depthFactor));
          groundColor = mix(groundColor, uFarColor, smoothstep(0.4, 1.0, depthFactor));

          // 2. Ridge Rim Lighting (grazing light catching crests)
          float rim = 1.0 - max(dot(-rd, n), 0.0);
          rim = pow(rim, uRimPower) * uRimStrength;
          vec3 ridgeGlow = uRimColor * rim;

          // 3. Sweeping Scanner Rings
          float distFromOrigin = length(p.xz - ro.xz);
          float ringPhase = fract(distFromOrigin * uRingSpacing - uTime * uRingSpeed);
          float ringWave = smoothstep(0.0, uRingWidth, ringPhase) * (1.0 - smoothstep(uRingWidth, uRingWidth * 2.5, ringPhase));
          vec3 ringEmission = uRingColor * (ringWave * uRingStrength * (1.0 - depthFactor));

          // 4. Subtle Wireframe / Contour grid lines
          vec2 gridUv = fract(p.xz * 1.5);
          float wire = step(0.96, gridUv.x) + step(0.96, gridUv.y);
          vec3 contourGlow = uFarColor * (wire * 0.35 * (1.0 - depthFactor));

          // Composite terrain surface
          finalColor = groundColor + ridgeGlow + ringEmission + contourGlow;

          // 5. Atmospheric Horizon Fog
          float fog = smoothstep(uFogStart, maxD, t);
          finalColor = mix(finalColor, uBackgroundColor, fog);
        }

        // 6. Vignette
        vec2 vUvCenter = vUv * (1.0 - vUv.yx);
        float vig = vUvCenter.x * vUvCenter.y * 15.0;
        vig = clamp(pow(vig, uVignette), 0.0, 1.0);
        finalColor *= vig;

        // 7. Film Grain
        float grainVal = (hash(gl_FragCoord.xy + fract(uTime * 0.3) * 100.0) - 0.5) * uGrain;
        finalColor += grainVal;

        finalColor *= uGain;

        gl_FragColor = vec4(finalColor, uOpacity);
      }
    `;

    const vs = this.compileShader(gl.VERTEX_SHADER, vsSource);
    const fs = this.compileShader(gl.FRAGMENT_SHADER, fsSource);

    this.program = gl.createProgram();
    gl.attachShader(this.program, vs);
    gl.attachShader(this.program, fs);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error('Shader link failed:', gl.getProgramInfoLog(this.program));
    }

    // Cache Uniform Locations
    this.uniforms = {
      uResolution: gl.getUniformLocation(this.program, 'uResolution'),
      uTime: gl.getUniformLocation(this.program, 'uTime'),
      uMouse: gl.getUniformLocation(this.program, 'uMouse'),
      uSpeed: gl.getUniformLocation(this.program, 'uSpeed'),
      uAltitude: gl.getUniformLocation(this.program, 'uAltitude'),
      uFocal: gl.getUniformLocation(this.program, 'uFocal'),
      uPitch: gl.getUniformLocation(this.program, 'uPitch'),
      uElevation: gl.getUniformLocation(this.program, 'uElevation'),
      uScale: gl.getUniformLocation(this.program, 'uScale'),
      uDetail: gl.getUniformLocation(this.program, 'uDetail'),
      uSteps: gl.getUniformLocation(this.program, 'uSteps'),
      uDistance: gl.getUniformLocation(this.program, 'uDistance'),
      uFogStart: gl.getUniformLocation(this.program, 'uFogStart'),
      uRampDistance: gl.getUniformLocation(this.program, 'uRampDistance'),
      uColor: gl.getUniformLocation(this.program, 'uColor'),
      uMidColor: gl.getUniformLocation(this.program, 'uMidColor'),
      uFarColor: gl.getUniformLocation(this.program, 'uFarColor'),
      uRimColor: gl.getUniformLocation(this.program, 'uRimColor'),
      uRimPower: gl.getUniformLocation(this.program, 'uRimPower'),
      uRimStrength: gl.getUniformLocation(this.program, 'uRimStrength'),
      uRingColor: gl.getUniformLocation(this.program, 'uRingColor'),
      uRingSpacing: gl.getUniformLocation(this.program, 'uRingSpacing'),
      uRingSpeed: gl.getUniformLocation(this.program, 'uRingSpeed'),
      uRingWidth: gl.getUniformLocation(this.program, 'uRingWidth'),
      uRingStrength: gl.getUniformLocation(this.program, 'uRingStrength'),
      uGain: gl.getUniformLocation(this.program, 'uGain'),
      uGrain: gl.getUniformLocation(this.program, 'uGrain'),
      uVignette: gl.getUniformLocation(this.program, 'uVignette'),
      uBackgroundColor: gl.getUniformLocation(this.program, 'uBackgroundColor'),
      uOpacity: gl.getUniformLocation(this.program, 'uOpacity'),
    };
  }

  compileShader(type, src) {
    const gl = this.gl;
    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  initBuffers() {
    const gl = this.gl;
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    this.aPosition = gl.getAttribLocation(this.program, 'aPosition');
  }

  setupListeners() {
    window.addEventListener('mousemove', (e) => {
      if (!this.props.cursorInteraction) return;
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      this.targetMouseX = x * 2.0 * this.props.cursorSteer;
      this.targetMouseY = y * 2.0 * this.props.cursorSteer;
    });

    window.addEventListener('resize', () => this.onResize());
  }

  onResize() {
    const width = this.canvas.parentElement ? this.canvas.parentElement.clientWidth : window.innerWidth;
    const height = this.canvas.parentElement ? this.canvas.parentElement.clientHeight : window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, this.props.dpr);

    this.canvas.width = Math.floor(width * dpr);
    this.canvas.height = Math.floor(height * dpr);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  render(now) {
    requestAnimationFrame((t) => this.render(t));

    if (this.props.paused) return;

    const delta = (now - this.lastFrameTime) * 0.001;
    this.lastFrameTime = now;
    this.time += delta;

    // Smooth cursor inertia
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.06;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.06;

    const gl = this.gl;
    gl.useProgram(this.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.enableVertexAttribArray(this.aPosition);
    gl.vertexAttribPointer(this.aPosition, 2, gl.FLOAT, false, 0, 0);

    // Uniform updates
    gl.uniform2f(this.uniforms.uResolution, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.uniforms.uTime, this.time);
    gl.uniform2f(this.uniforms.uMouse, this.mouseX, this.mouseY);

    gl.uniform1f(this.uniforms.uSpeed, this.props.speed);
    gl.uniform1f(this.uniforms.uAltitude, this.props.altitude);
    gl.uniform1f(this.uniforms.uFocal, this.props.focal);
    gl.uniform1f(this.uniforms.uPitch, this.props.pitch);
    gl.uniform1f(this.uniforms.uElevation, this.props.elevation);
    gl.uniform1f(this.uniforms.uScale, this.props.scale);
    gl.uniform1f(this.uniforms.uDetail, this.props.detail);
    gl.uniform1i(this.uniforms.uSteps, this.props.steps);
    gl.uniform1f(this.uniforms.uDistance, this.props.distance);
    gl.uniform1f(this.uniforms.uFogStart, this.props.fogStart);
    gl.uniform1f(this.uniforms.uRampDistance, this.props.rampDistance);

    const c1 = this.hexToVec3(this.props.color);
    const c2 = this.hexToVec3(this.props.midColor);
    const c3 = this.hexToVec3(this.props.farColor);
    const cRim = this.hexToVec3(this.props.rimColor);
    const cRing = this.hexToVec3(this.props.ringColor);
    const cBg = this.hexToVec3(this.props.backgroundColor);

    gl.uniform3f(this.uniforms.uColor, c1[0], c1[1], c1[2]);
    gl.uniform3f(this.uniforms.uMidColor, c2[0], c2[1], c2[2]);
    gl.uniform3f(this.uniforms.uFarColor, c3[0], c3[1], c3[2]);
    gl.uniform3f(this.uniforms.uRimColor, cRim[0], cRim[1], cRim[2]);
    gl.uniform1f(this.uniforms.uRimPower, this.props.rimPower);
    gl.uniform1f(this.uniforms.uRimStrength, this.props.rimStrength);

    gl.uniform3f(this.uniforms.uRingColor, cRing[0], cRing[1], cRing[2]);
    gl.uniform1f(this.uniforms.uRingSpacing, this.props.ringSpacing);
    gl.uniform1f(this.uniforms.uRingSpeed, this.props.ringSpeed);
    gl.uniform1f(this.uniforms.uRingWidth, this.props.ringWidth);
    gl.uniform1f(this.uniforms.uRingStrength, this.props.ringStrength);

    gl.uniform1f(this.uniforms.uGain, this.props.gain);
    gl.uniform1f(this.uniforms.uGrain, this.props.grain);
    gl.uniform1f(this.uniforms.uVignette, this.props.vignette);
    gl.uniform3f(this.uniforms.uBackgroundColor, cBg[0], cBg[1], cBg[2]);
    gl.uniform1f(this.uniforms.uOpacity, this.props.opacity);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  // Support procedural seed regeneration from Telemetry HUD
  setSeed(seedStr) {
    let h = 0;
    for (let i = 0; i < seedStr.length; i++) {
      h = (h << 5) - h + seedStr.charCodeAt(i);
      h |= 0;
    }
    const seedVal = Math.abs(h);
    // Mutate parameters procedurally
    this.props.scale = 0.12 + (seedVal % 100) * 0.0008;
    this.props.elevation = 2.8 + (seedVal % 50) * 0.03;
    this.props.ringSpacing = 0.35 + (seedVal % 40) * 0.01;
  }
}

window.ReactBitsLandscape = ReactBitsLandscape;
