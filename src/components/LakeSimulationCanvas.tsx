import React, { useEffect, useRef, useState } from 'react';
import { HotspotId } from '../types';
import { HOTSPOTS } from '../data/platformData';
import { 
  Sparkles, 
  Wind, 
  Droplets, 
  Layers, 
  Activity, 
  Info, 
  Eye, 
  EyeOff, 
  Zap,
  Gauge
} from 'lucide-react';

interface LakeSimulationCanvasProps {
  isRunning: boolean;
  aeratorActive: boolean;
  intensity: number; // 0 to 100
  dissolvedOxygen: number; // 3.1 to 7.5
  bod: number; // 9.8 to 2.8
  waterClarity: number; // 34% to 89%
  selectedHotspot: HotspotId | null;
  onSelectHotspot: (id: HotspotId | null) => void;
}

interface Particle {
  x: number;
  y: number;
  speedY: number;
  speedX: number;
  size: number;
  opacity: number;
  isOxygen: boolean;
}

export const LakeSimulationCanvas: React.FC<LakeSimulationCanvasProps> = ({
  isRunning,
  aeratorActive,
  intensity,
  dissolvedOxygen,
  bod,
  waterClarity,
  selectedHotspot,
  onSelectHotspot,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showHotspots, setShowHotspots] = useState(true);
  const [viewAngle, setViewAngle] = useState<'profile' | 'flow'>('profile');

  // Animation frame tracker
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    // Particles (Oxygen bubbles + suspended organic matter)
    const bubbles: Particle[] = [];
    const pollutants: Particle[] = [];

    // Initialize initial pollutant particles
    for (let i = 0; i < 45; i++) {
      pollutants.push({
        x: Math.random() * 800,
        y: 220 + Math.random() * 260,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.2,
        size: 1.5 + Math.random() * 2.5,
        opacity: 0.3 + Math.random() * 0.5,
        isOxygen: false,
      });
    }

    const resizeCanvas = () => {
      if (containerRef.current && canvas) {
        const rect = containerRef.current.getBoundingClientRect();
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(() => resizeCanvas());
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    const render = () => {
      time += 0.03 * (aeratorActive ? 1 + (intensity / 100) : 0.6);
      const w = canvas.width / (window.devicePixelRatio || 1);
      const h = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, w, h);

      // 1. SKY GRADIENT (Atmosphere above Lake Taldykol)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.38);
      skyGrad.addColorStop(0, '#091322');
      skyGrad.addColorStop(0.7, '#0f243a');
      skyGrad.addColorStop(1, '#1b3b52');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * 0.38);

      // Distant steppe shoreline / reeds silhouette of Lake Taldykol
      ctx.fillStyle = '#0a1d2e';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.38);
      for (let x = 0; x <= w; x += 25) {
        const hillY = h * 0.35 + Math.sin(x * 0.015) * 6 + Math.cos(x * 0.04) * 3;
        ctx.lineTo(x, hillY);
      }
      ctx.lineTo(w, h * 0.38);
      ctx.closePath();
      ctx.fill();

      // Atmospheric telemetry grid in the sky (HUD aesthetic)
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h * 0.38);
        ctx.stroke();
      }

      // 2. WATER COLOR DYNAMICS BASED ON SIMULATION
      // Uncleaned: Turbid murky yellowish-olive (#374627 / #29381e)
      // Cleaned: Crisp luminous emerald-cyan (#0b424e / #072a38)
      const cleanFactor = Math.min(1, Math.max(0, (dissolvedOxygen - 3.1) / (7.5 - 3.1)));
      
      const waterGrad = ctx.createLinearGradient(0, h * 0.38, 0, h);
      // Surface tint
      const rSurface = Math.round(28 * (1 - cleanFactor) + 8 * cleanFactor);
      const gSurface = Math.round(56 * (1 - cleanFactor) + 68 * cleanFactor);
      const bSurface = Math.round(44 * (1 - cleanFactor) + 94 * cleanFactor);
      
      // Bottom deep tint
      const rDeep = Math.round(18 * (1 - cleanFactor) + 4 * cleanFactor);
      const gDeep = Math.round(34 * (1 - cleanFactor) + 38 * cleanFactor);
      const bDeep = Math.round(24 * (1 - cleanFactor) + 54 * cleanFactor);

      waterGrad.addColorStop(0, `rgb(${rSurface}, ${gSurface}, ${bSurface})`);
      waterGrad.addColorStop(1, `rgb(${rDeep}, ${gDeep}, ${bDeep})`);

      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, h * 0.38, w, h * 0.62);

      // Lake Bed Sediment
      const bedGrad = ctx.createLinearGradient(0, h - 35, 0, h);
      bedGrad.addColorStop(0, 'rgba(15, 23, 42, 0.3)');
      bedGrad.addColorStop(1, 'rgba(8, 14, 26, 0.95)');
      ctx.fillStyle = bedGrad;
      ctx.beginPath();
      ctx.moveTo(0, h - 30);
      for (let x = 0; x <= w; x += 30) {
        const bedY = h - 25 + Math.sin(x * 0.02) * 5;
        ctx.lineTo(x, bedY);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // 3. WATER SURFACE WAVES (Animated)
      const waterline = h * 0.38;
      const waveAmp = aeratorActive ? 3.5 + (intensity / 100) * 3 : 2;
      const waveFreq = aeratorActive ? 0.03 : 0.015;

      ctx.beginPath();
      ctx.moveTo(0, waterline);
      for (let x = 0; x <= w; x += 8) {
        const y = waterline + Math.sin(x * waveFreq + time * 2) * waveAmp;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.fill();

      // Surface highlight shimmer
      ctx.beginPath();
      ctx.moveTo(0, waterline);
      for (let x = 0; x <= w; x += 8) {
        const y = waterline + Math.sin(x * waveFreq + time * 2) * waveAmp;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = cleanFactor > 0.5 ? 'rgba(125, 211, 252, 0.45)' : 'rgba(163, 230, 53, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 4. PLATFORM POSITION (Center anchored)
      const platformX = w * 0.5;
      const platformY = waterline + Math.sin(time) * 2; // subtle buoyancy bobbing
      const platformWidth = Math.min(w * 0.52, 380);
      const platformHeight = 24;

      // Under-water Circulation Current Arrows (if aerator is active)
      if (aeratorActive) {
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 6]);
        ctx.lineDashOffset = -time * 20;

        // Current from bottom up to intake
        ctx.beginPath();
        ctx.moveTo(platformX - 40, h - 50);
        ctx.quadraticCurveTo(platformX - 30, platformY + 120, platformX, platformY + 80);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(platformX + 40, h - 50);
        ctx.quadraticCurveTo(platformX + 30, platformY + 120, platformX, platformY + 80);
        ctx.stroke();

        // Current radiating outward from aeration contact point
        ctx.beginPath();
        ctx.moveTo(platformX - 70, platformY + 15);
        ctx.quadraticCurveTo(platformX - 160, platformY + 35, platformX - 220, platformY + 85);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(platformX + 70, platformY + 15);
        ctx.quadraticCurveTo(platformX + 160, platformY + 35, platformX + 220, platformY + 85);
        ctx.stroke();

        ctx.restore();
      }

      // 5. UNDERWATER ROOTS (Ризосфера рогоза)
      // Hanging roots with filtration hair clusters
      const rootClusters = [
        { offsetX: -platformWidth * 0.38, depth: 95, spread: 28 },
        { offsetX: -platformWidth * 0.22, depth: 130, spread: 35 },
        { offsetX: -platformWidth * 0.08, depth: 110, spread: 30 },
        { offsetX: platformWidth * 0.12, depth: 105, spread: 32 },
        { offsetX: platformWidth * 0.26, depth: 135, spread: 36 },
        { offsetX: platformWidth * 0.40, depth: 90, spread: 25 },
      ];

      rootClusters.forEach((cluster, idx) => {
        const rootX = platformX + cluster.offsetX;
        const rootBaseY = platformY + platformHeight * 0.7;
        const rootLength = cluster.depth;

        // Main root strands
        for (let r = -2; r <= 2; r++) {
          const sway = Math.sin(time + idx + r * 0.5) * (aeratorActive ? 6 : 2.5);
          ctx.beginPath();
          ctx.moveTo(rootX + r * 5, rootBaseY);
          
          const midX = rootX + r * 7 + sway * 0.5;
          const midY = rootBaseY + rootLength * 0.5;
          const endX = rootX + r * 10 + sway;
          const endY = rootBaseY + rootLength;

          ctx.quadraticCurveTo(midX, midY, endX, endY);
          
          // Color based on filtration activity
          ctx.strokeStyle = isRunning 
            ? 'rgba(74, 222, 128, 0.4)' 
            : 'rgba(163, 163, 163, 0.3)';
          ctx.lineWidth = 1.6 - Math.abs(r) * 0.2;
          ctx.stroke();

          // Root micro-hairs (Ризодерма)
          if (r === 0 || r === 1) {
            for (let hIndex = 0; hIndex < 4; hIndex++) {
              const hairY = rootBaseY + 25 + hIndex * 22;
              const hairSway = Math.cos(time * 1.5 + hIndex) * 3;
              ctx.beginPath();
              ctx.moveTo(midX - 2, hairY);
              ctx.lineTo(midX + (hIndex % 2 === 0 ? 12 : -12) + hairSway, hairY + 6);
              ctx.strokeStyle = 'rgba(134, 239, 172, 0.25)';
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }

        // Bio-absorption glow around roots when active
        if (isRunning) {
          const pulse = (Math.sin(time * 3 + idx) + 1) * 0.5;
          ctx.fillStyle = `rgba(34, 197, 94, ${0.05 + pulse * 0.07})`;
          ctx.beginPath();
          ctx.ellipse(rootX, rootBaseY + rootLength * 0.5, cluster.spread, rootLength * 0.55, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 6. SUBMERGED INTAKE PIPE & SENSOR PROBE
      // Suction Pipe (Center)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(platformX - 6, platformY + platformHeight, 12, 95);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(platformX - 6, platformY + platformHeight, 12, 95);

      // Intake Strainer / Bell at the bottom of the tube
      ctx.beginPath();
      ctx.moveTo(platformX - 14, platformY + platformHeight + 95);
      ctx.lineTo(platformX + 14, platformY + platformHeight + 95);
      ctx.lineTo(platformX + 8, platformY + platformHeight + 82);
      ctx.lineTo(platformX - 8, platformY + platformHeight + 82);
      ctx.closePath();
      ctx.fillStyle = '#334155';
      ctx.fill();
      ctx.stroke();

      // Intake suction animation (micro-arrows inside pipe if aerator active)
      if (aeratorActive) {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
        const arrowOffset = (time * 40) % 25;
        for (let a = 0; a < 3; a++) {
          const ay = platformY + platformHeight + 80 - a * 25 - arrowOffset;
          if (ay > platformY + platformHeight && ay < platformY + platformHeight + 90) {
            ctx.beginPath();
            ctx.arc(platformX, ay, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Sensor Probe cable and submerged electrode head
      const sensorX = platformX + platformWidth * 0.32;
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sensorX, platformY + platformHeight);
      ctx.lineTo(sensorX, platformY + platformHeight + 65);
      ctx.stroke();

      // Sensor head capsule
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(sensorX - 5, platformY + platformHeight + 65, 10, 18);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.strokeRect(sensorX - 5, platformY + platformHeight + 65, 10, 18);

      // Sensor LED pulse
      const sensorPulse = (Math.sin(time * 5) + 1) * 0.5;
      ctx.fillStyle = isRunning ? `rgba(56, 189, 248, ${0.4 + sensorPulse * 0.6})` : 'rgba(239, 68, 68, 0.7)';
      ctx.beginPath();
      ctx.arc(sensorX, platformY + platformHeight + 74, 2, 0, Math.PI * 2);
      ctx.fill();

      // 7. PLATFORM HULL & DECKING
      // Underwater pontoon hull blocks
      const pontoonCount = 4;
      const pontoonWidth = platformWidth / pontoonCount - 6;
      for (let p = 0; p < pontoonCount; p++) {
        const px = platformX - platformWidth * 0.5 + p * (pontoonWidth + 6) + 3;
        // Submerged buoyancy chamber
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(px, platformY + 8, pontoonWidth, platformHeight);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(px, platformY + 8, pontoonWidth, platformHeight);

        // Hydrodynamic chamber markings
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(px + 4, platformY + 12, pontoonWidth - 8, 3);
      }

      // Main Deck (Eco-composite structural frame)
      const deckGrad = ctx.createLinearGradient(0, platformY - 6, 0, platformY + 10);
      deckGrad.addColorStop(0, '#334155');
      deckGrad.addColorStop(0.5, '#1e293b');
      deckGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = deckGrad;
      ctx.beginPath();
      ctx.roundRect(platformX - platformWidth * 0.5 - 6, platformY - 6, platformWidth + 12, 16, [4, 4, 2, 2]);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Safety perimeter bumper & tie-downs
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(platformX - platformWidth * 0.5 - 4, platformY + 2);
      ctx.lineTo(platformX - platformWidth * 0.5 + 14, platformY + 2);
      ctx.moveTo(platformX + platformWidth * 0.5 - 14, platformY + 2);
      ctx.lineTo(platformX + platformWidth * 0.5 + 4, platformY + 2);
      ctx.stroke();

      // Solar Panel on one side of platform (Telemetry autonomous power)
      const solarX = platformX - platformWidth * 0.44;
      const solarY = platformY - 14;
      ctx.save();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(solarX, solarY, 44, 8);
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(solarX + 2, solarY + 1, 40, 6);
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(solarX + 2, solarY + 1, 40, 6);
      ctx.restore();

      // 8. CATTAILS (Рогоз широколистный / Typha)
      // Render dense reeds on the platform deck
      const cattailStalks = [
        // Left planter bed
        { ox: -platformWidth * 0.42, h: 74, lean: -0.06, spike: true },
        { ox: -platformWidth * 0.36, h: 88, lean: -0.03, spike: true },
        { ox: -platformWidth * 0.31, h: 65, lean: -0.08, spike: false },
        { ox: -platformWidth * 0.25, h: 96, lean: 0.02, spike: true },
        { ox: -platformWidth * 0.20, h: 82, lean: -0.02, spike: true },
        { ox: -platformWidth * 0.15, h: 68, lean: 0.05, spike: false },
        // Right planter bed
        { ox: platformWidth * 0.15, h: 72, lean: -0.04, spike: false },
        { ox: platformWidth * 0.21, h: 92, lean: 0.03, spike: true },
        { ox: platformWidth * 0.26, h: 84, lean: -0.02, spike: true },
        { ox: platformWidth * 0.31, h: 98, lean: 0.05, spike: true },
        { ox: platformWidth * 0.36, h: 76, lean: 0.02, spike: false },
        { ox: platformWidth * 0.42, h: 86, lean: 0.08, spike: true },
      ];

      cattailStalks.forEach((stalk, sIdx) => {
        const sx = platformX + stalk.ox;
        const sy = platformY - 6;
        const windSway = Math.sin(time * 0.8 + sIdx * 0.7) * (stalk.h * 0.07);
        const topX = sx + stalk.lean * stalk.h + windSway;
        const topY = sy - stalk.h;

        // Leaf / Stalk
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.quadraticCurveTo(sx + windSway * 0.4, sy - stalk.h * 0.5, topX, topY);
        ctx.strokeStyle = sIdx % 2 === 0 ? '#15803d' : '#166534';
        ctx.lineWidth = 2.4;
        ctx.stroke();

        // Characteristic brown seed spike of cattails (Рогозовый початок)
        if (stalk.spike) {
          const spikeStartY = topY + 12;
          const spikeEndY = topY + 36;
          const spikeMidX = (topX + (sx + windSway * 0.4)) * 0.5;

          ctx.beginPath();
          ctx.moveTo(topX, spikeStartY);
          ctx.lineTo(topX - windSway * 0.1, spikeEndY);
          ctx.strokeStyle = '#78350f'; // Dark velvet brown
          ctx.lineWidth = 4.8;
          ctx.lineCap = 'round';
          ctx.stroke();

          // Spike apex tip
          ctx.beginPath();
          ctx.moveTo(topX, topY);
          ctx.lineTo(topX, spikeStartY);
          ctx.strokeStyle = '#15803d';
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });

      // 9. AERATOR UNIT & NOZZLE
      // Center Housing
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(platformX - 18, platformY - 24, 36, 20, [5, 5, 0, 0]);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Aerator Nozzle Pipe
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(platformX - 4, platformY - 34, 8, 12);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(platformX - 4, platformY - 34, 8, 12);

      // Status indicator ring on aerator housing
      ctx.beginPath();
      ctx.arc(platformX, platformY - 14, 4, 0, Math.PI * 2);
      ctx.fillStyle = aeratorActive ? '#10b981' : '#64748b';
      ctx.fill();

      // 10. AERATOR FOUNTAIN SPRAY (When active)
      if (aeratorActive) {
        const sprayPower = (intensity / 100);
        const sprayHeight = 45 + sprayPower * 45;
        const spraySpread = 60 + sprayPower * 55;

        // Dual fountain arches (Left & Right spray jets)
        const sides = [-1, 1];
        sides.forEach((side) => {
          for (let arc = 0; arc < 4; arc++) {
            const arcVariance = 0.8 + arc * 0.15;
            const jetEndX = platformX + side * (spraySpread * arcVariance) + Math.sin(time * 6 + arc) * 4;
            const jetEndY = waterline + Math.sin(time * 3) * 2;
            const apexY = platformY - 34 - (sprayHeight * arcVariance);

            ctx.beginPath();
            ctx.moveTo(platformX, platformY - 34);
            ctx.quadraticCurveTo(
              platformX + side * (spraySpread * 0.45),
              apexY,
              jetEndX,
              jetEndY
            );

            // Water arc stroke
            ctx.strokeStyle = arc === 0 
              ? 'rgba(255, 255, 255, 0.75)' 
              : `rgba(186, 230, 253, ${0.45 - arc * 0.08})`;
            ctx.lineWidth = 2.2 - arc * 0.3;
            ctx.stroke();

            // Water droplet splashes at the contact ring
            ctx.beginPath();
            ctx.ellipse(jetEndX, jetEndY, 9 + arc * 2, 3, 0, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(224, 242, 254, 0.6)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });

        // Airborne water mist particles
        const mistCount = 12 + Math.floor(sprayPower * 14);
        for (let m = 0; m < mistCount; m++) {
          const mistSide = m % 2 === 0 ? -1 : 1;
          const progress = ((time * 3 + m * 0.4) % 1);
          const mx = platformX + mistSide * (spraySpread * progress) + (Math.sin(m) * 8);
          const my = platformY - 34 - Math.sin(progress * Math.PI) * sprayHeight + (progress * 15);
          
          ctx.beginPath();
          ctx.arc(mx, my, 1 + Math.random() * 1.5, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(240, 249, 255, 0.8)';
          ctx.fill();
        }

        // Spawn dynamic oxygen bubbles from splash contact zones into water
        if (Math.random() < 0.45 * (0.5 + sprayPower)) {
          const spawnSide = Math.random() < 0.5 ? -1 : 1;
          bubbles.push({
            x: platformX + spawnSide * (30 + Math.random() * spraySpread),
            y: waterline + 5 + Math.random() * 15,
            speedY: -(0.6 + Math.random() * 1.2),
            speedX: spawnSide * (0.3 + Math.random() * 0.8),
            size: 1.5 + Math.random() * 3.5,
            opacity: 0.8,
            isOxygen: true,
          });
        }
      }

      // 11. BUBBLES SIMULATION (Rising O2 bubbles in the water column)
      for (let b = bubbles.length - 1; b >= 0; b--) {
        const bubble = bubbles[b];
        bubble.y += bubble.speedY;
        bubble.x += bubble.speedX + Math.sin(time * 3 + b) * 0.4;
        bubble.opacity -= 0.003;

        // Render bubble
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${bubble.opacity * 0.7})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(255, 255, 255, ${bubble.opacity * 0.9})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Small highlight glint
        ctx.beginPath();
        ctx.arc(bubble.x - bubble.size * 0.3, bubble.y - bubble.size * 0.3, bubble.size * 0.3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fill();

        // Remove bubble when reaches surface or fades
        if (bubble.y < waterline || bubble.opacity <= 0 || bubble.x < 0 || bubble.x > w) {
          bubbles.splice(b, 1);
        }
      }

      // Limit max bubbles
      if (bubbles.length > 90) {
        bubbles.splice(0, bubbles.length - 90);
      }

      // 12. SUSPENDED PARTICULATE / ORGANIC MATTER (Visual representation of BOD & Turbidity)
      // When platform runs, pollutants get drawn towards roots and decrease
      const currentPollutantCount = Math.floor(45 * (bod / 9.8));
      for (let p = 0; p < pollutants.length; p++) {
        if (p >= currentPollutantCount) continue;
        const part = pollutants[p];

        if (isRunning) {
          // Attracted to roots
          const targetX = platformX + (p % 2 === 0 ? -40 : 40);
          const targetY = platformY + 70;
          const dx = targetX - part.x;
          const dy = targetY - part.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 25) {
            part.x += (dx / dist) * 0.4;
            part.y += (dy / dist) * 0.3;
          } else {
            // Re-spawn from sides
            part.x = Math.random() < 0.5 ? Math.random() * (platformX - 120) : platformX + 120 + Math.random() * (w - platformX - 120);
            part.y = waterline + 30 + Math.random() * (h - waterline - 60);
          }
        } else {
          part.x += part.speedX;
          part.y += part.speedY;
          if (part.y < waterline + 20) part.y = waterline + 20;
          if (part.y > h - 40) part.y = h - 40;
          if (part.x < 10) part.x = w - 10;
          if (part.x > w - 10) part.x = 10;
        }

        ctx.beginPath();
        ctx.arc(part.x, part.y, part.size, 0, Math.PI * 2);
        ctx.fillStyle = cleanFactor > 0.6 
          ? `rgba(163, 230, 53, ${part.opacity * 0.2})` 
          : `rgba(161, 98, 7, ${part.opacity * 0.6})`;
        ctx.fill();
      }

      // 13. DEPTH SCALE LABELS & HUD CALIBRATION (Scientific HUD style)
      ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'left';

      const depthSteps = [
        { label: '0.0 м (Поверхность)', y: waterline + 2 },
        { label: '-0.8 м (Фито-горизонт)', y: waterline + 80 },
        { label: '-1.6 м (Зона аэрации)', y: waterline + 160 },
        { label: '-2.4 м (Придонный ил)', y: h - 35 },
      ];

      depthSteps.forEach((step) => {
        if (step.y < h - 15) {
          ctx.fillText(step.label, 14, step.y);
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(8, step.y - 3);
          ctx.lineTo(w - 8, step.y - 3);
          ctx.stroke();
        }
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
    };
  }, [isRunning, aeratorActive, intensity, dissolvedOxygen, bod, waterClarity]);

  return (
    <div 
      id="lake-simulation-viewport" 
      ref={containerRef}
      className="relative w-full h-[440px] sm:h-[500px] lg:h-[540px] rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-950 shadow-2xl select-none"
    >
      {/* 2D Animated Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full block" 
      />

      {/* Floating HUD Top Overlay: Scientific Status Badges */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-10">
        <div className="flex items-center gap-2">
          <div className="px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-700/80 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            <span className="font-mono text-xs font-semibold tracking-wider text-slate-200">
              {isRunning ? 'СИМУЛЯЦИЯ: АКТИВНА' : 'РЕЖИМ: ОЖИДАНИЕ'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 border border-slate-700/80 backdrop-blur-md text-xs font-mono text-slate-300">
            <Droplets className="w-3.5 h-3.5 text-cyan-400" />
            <span>Озеро Талдыколь</span>
          </div>
        </div>

        {/* Hotspot toggle and aerator live status */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {aeratorActive && (
            <div className="px-2.5 py-1 rounded-md bg-cyan-950/80 border border-cyan-700/70 backdrop-blur-md flex items-center gap-1.5 text-xs font-mono text-cyan-300">
              <Zap className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span>Аэрация: {intensity}%</span>
            </div>
          )}

          <button
            id="toggle-hotspots-btn"
            onClick={() => setShowHotspots(!showHotspots)}
            className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5 backdrop-blur-md transition-colors shadow"
            title="Показать/скрыть точки интерактивного осмотра"
          >
            {showHotspots ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            <span className="hidden xs:inline">Точки узлов</span>
          </button>
        </div>
      </div>

      {/* Interactive Hotspots Layer */}
      {showHotspots && (
        <div className="absolute inset-0 pointer-events-none z-20">
          {HOTSPOTS.map((hotspot, index) => {
            const isSelected = selectedHotspot === hotspot.id;
            return (
              <div
                key={hotspot.id}
                style={{ left: `${hotspot.coordinates.x}%`, top: `${hotspot.coordinates.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              >
                <button
                  id={`hotspot-btn-${hotspot.id}`}
                  onClick={() => onSelectHotspot(isSelected ? null : hotspot.id)}
                  className={`group relative flex items-center justify-center w-7 h-7 rounded-full transition-all duration-300 shadow-lg ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 scale-125 ring-4 ring-emerald-400/40'
                      : 'bg-slate-900/90 text-emerald-400 border border-emerald-500/60 hover:scale-110 hover:bg-emerald-600 hover:text-white'
                  }`}
                  aria-label={`Осмотреть узел: ${hotspot.title}`}
                >
                  <span className="text-xs font-bold font-mono">{index + 1}</span>
                  
                  {/* Pulse ring */}
                  <span className={`absolute inset-0 rounded-full bg-emerald-400/30 -z-10 ${isSelected ? 'animate-ping' : 'animate-pulse'}`} />

                  {/* Tooltip on hover */}
                  <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block whitespace-nowrap px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-[11px] text-slate-200 shadow-xl pointer-events-none z-30 font-medium">
                    {hotspot.title.split(' ')[0]} {hotspot.title.split(' ')[1] || ''}
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Hotspot Inspector Modal / Popover (when a point is selected) */}
      {selectedHotspot && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-30 pointer-events-auto">
          {(() => {
            const spot = HOTSPOTS.find((h) => h.id === selectedHotspot);
            if (!spot) return null;
            return (
              <div 
                id={`hotspot-detail-card-${spot.id}`}
                className="p-4 rounded-xl bg-slate-900/95 border border-emerald-500/40 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 duration-200"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wide uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-1">
                      {spot.badge}
                    </span>
                    <h4 className="text-sm font-bold text-white leading-snug">
                      {spot.title}
                    </h4>
                  </div>
                  <button
                    id="close-hotspot-card-btn"
                    onClick={() => onSelectHotspot(null)}
                    className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    aria-label="Закрыть описание узла"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                  {spot.description}
                </p>
                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <div className="text-[11px] text-emerald-400 font-medium">
                    <span className="text-slate-400 font-normal">Функция: </span>
                    {spot.role}
                  </div>
                  <div className="text-[11px] text-cyan-300">
                    <span className="text-slate-400 font-normal">Эко-эффект: </span>
                    {spot.scientificBenefit}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Legend at bottom right */}
      <div className="absolute bottom-3 right-3 hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 font-mono backdrop-blur-md pointer-events-none z-10">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Рогоз & корни</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Аэрация O₂</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>БПК (органика)</span>
        </div>
      </div>
    </div>
  );
};
