"use client";

import React, { useEffect, useRef } from "react";

export interface DitherCursorProps {
  /** Size of the dither pattern pixels. Default: 4 */
  ditherSize?: number;
  /** Radius of the cursor influence (normalized screen space). Default: 0.1 */
  radius?: number;
  /** Exponent for the falloff curve. Default: 2.0 */
  exponent?: number;
  /** Speed at which the trail fades. Default: 0.01 */
  decay?: number;
  /** Color of the cursor trail (hex string). Default: "#9fd8bd" */
  color?: string;
  /** Trail opacity / intensity multiplier. Default: 1.0 */
  intensity?: number;
  /** Number of trail history points. Default: 24 */
  trailLength?: number;
  /** Custom CSS classes for container */
  className?: string;
}

const VERTEX_SHADER = `
attribute vec2 position;
varying vec2 vUv;

void main() {
  vUv = (position + 1.0) * 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;

varying vec2 vUv;
uniform vec2 uResolution;
uniform vec3 uColor;
uniform float uDitherSize;
uniform float uRadius;
uniform float uExponent;
uniform float uIntensity;

// Trail uniforms (maximum 32 points)
const int MAX_POINTS = 32;
uniform vec2 uPoints[MAX_POINTS];
uniform float uAlphas[MAX_POINTS];
uniform int uCount;

// 4x4 Bayer Dithering Matrix
float getBayerValue(vec2 coord, float ditherSize) {
  int x = int(mod(coord.x / ditherSize, 4.0));
  int y = int(mod(coord.y / ditherSize, 4.0));
  int idx = y * 4 + x;

  if (idx == 0) return 0.0 / 16.0;
  if (idx == 1) return 8.0 / 16.0;
  if (idx == 2) return 2.0 / 16.0;
  if (idx == 3) return 10.0 / 16.0;
  if (idx == 4) return 12.0 / 16.0;
  if (idx == 5) return 4.0 / 16.0;
  if (idx == 6) return 14.0 / 16.0;
  if (idx == 7) return 6.0 / 16.0;
  if (idx == 8) return 3.0 / 16.0;
  if (idx == 9) return 11.0 / 16.0;
  if (idx == 10) return 1.0 / 16.0;
  if (idx == 11) return 9.0 / 16.0;
  if (idx == 12) return 15.0 / 16.0;
  if (idx == 13) return 7.0 / 16.0;
  if (idx == 14) return 13.0 / 16.0;
  return 5.0 / 16.0;
}

void main() {
  vec2 aspect = vec2(uResolution.x / min(uResolution.x, uResolution.y), uResolution.y / min(uResolution.x, uResolution.y));
  vec2 fragCoordAspect = vUv * aspect;

  float totalAlpha = 0.0;

  for (int i = 0; i < MAX_POINTS; i++) {
    if (i >= uCount) break;
    vec2 ptAspect = uPoints[i] * aspect;
    float dist = length(fragCoordAspect - ptAspect);
    if (dist < uRadius) {
      float falloff = pow(clamp(1.0 - dist / uRadius, 0.0, 1.0), uExponent);
      totalAlpha += falloff * uAlphas[i];
    }
  }

  totalAlpha = clamp(totalAlpha * uIntensity, 0.0, 1.0);

  if (totalAlpha <= 0.001) {
    discard;
  }

  float threshold = getBayerValue(gl_FragCoord.xy, uDitherSize);

  if (totalAlpha < threshold) {
    discard;
  }

  gl_FragColor = vec4(uColor, 1.0);
}
`;

function hexToRgb(hex: string): [number, number, number] {
  let cleaned = hex.replace("#", "").trim();
  if (cleaned.length === 3) {
    cleaned = cleaned.split("").map((c) => c + c).join("");
  }
  const intVal = parseInt(cleaned, 16);
  if (isNaN(intVal)) return [0.62, 0.85, 0.74]; // Default seafoam
  const r = ((intVal >> 16) & 255) / 255;
  const g = ((intVal >> 8) & 255) / 255;
  const b = (intVal & 255) / 255;
  return [r, g, b];
}

export const DitherCursor: React.FC<DitherCursorProps> = ({
  ditherSize = 4,
  radius = 0.08,
  exponent = 2.0,
  decay = 0.02,
  color = "#9fd8bd",
  intensity = 1.0,
  trailLength = 24,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl) return;

    // Compile Shaders
    function createShader(type: number, source: string) {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    }

    const vs = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Full-screen Quad Geometry
    const quadVertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform Locations
    const uResLoc = gl.getUniformLocation(program, "uResolution");
    const uColorLoc = gl.getUniformLocation(program, "uColor");
    const uDitherSizeLoc = gl.getUniformLocation(program, "uDitherSize");
    const uRadiusLoc = gl.getUniformLocation(program, "uRadius");
    const uExponentLoc = gl.getUniformLocation(program, "uExponent");
    const uIntensityLoc = gl.getUniformLocation(program, "uIntensity");
    const uCountLoc = gl.getUniformLocation(program, "uCount");
    const uPointsLoc = gl.getUniformLocation(program, "uPoints");
    const uAlphasLoc = gl.getUniformLocation(program, "uAlphas");

    // Trail State
    const maxPoints = Math.min(32, Math.max(4, trailLength));
    const points: { x: number; y: number; alpha: number }[] = [];
    const pointsData = new Float32Array(maxPoints * 2);
    const alphasData = new Float32Array(maxPoints);

    let mouseX = -1;
    let mouseY = -1;
    let isMoving = false;
    let moveTimeout: NodeJS.Timeout;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width;
      mouseY = 1.0 - (e.clientY - rect.top) / rect.height; // WebGL Y is inverted

      isMoving = true;
      clearTimeout(moveTimeout);
      moveTimeout = setTimeout(() => {
        isMoving = false;
      }, 80);

      // Add point
      points.unshift({ x: mouseX, y: mouseY, alpha: 1.0 });
      if (points.length > maxPoints) {
        points.pop();
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    // Resize Handler
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    // Render Loop
    let animId: number;
    const render = () => {
      // Decay existing points
      for (let i = points.length - 1; i >= 0; i--) {
        points[i].alpha -= decay;
        if (points[i].alpha <= 0) {
          points.splice(i, 1);
        }
      }

      // If mouse is moving, inject fresh point
      if (isMoving && mouseX >= 0) {
        if (points.length === 0 || Math.hypot(points[0].x - mouseX, points[0].y - mouseY) > 0.005) {
          points.unshift({ x: mouseX, y: mouseY, alpha: 1.0 });
          if (points.length > maxPoints) {
            points.pop();
          }
        }
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (points.length > 0) {
        gl.useProgram(program);

        // Upload uniforms
        gl.uniform2f(uResLoc, canvas.width, canvas.height);
        const [r, g, b] = hexToRgb(color);
        gl.uniform3f(uColorLoc, r, g, b);
        gl.uniform1f(uDitherSizeLoc, ditherSize);
        gl.uniform1f(uRadiusLoc, radius);
        gl.uniform1f(uExponentLoc, exponent);
        gl.uniform1f(uIntensityLoc, intensity);
        gl.uniform1i(uCountLoc, points.length);

        for (let i = 0; i < points.length; i++) {
          pointsData[i * 2] = points[i].x;
          pointsData[i * 2 + 1] = points[i].y;
          alphasData[i] = points[i].alpha;
        }

        gl.uniform2fv(uPointsLoc, pointsData);
        gl.uniform1fv(uAlphasLoc, alphasData);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(moveTimeout);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, [ditherSize, radius, exponent, decay, color, intensity, trailLength]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-50 w-full h-full ${className}`}
      style={{ pointerEvents: "none" }}
    />
  );
};

export default DitherCursor;
