import React, { useState, useEffect, useRef } from 'react';
import { 
  HeaderBanner, 
  QuickGuide 
} from './components/HeaderBanner';
import { LakeSimulationCanvas } from './components/LakeSimulationCanvas';
import { TelemetryHUD } from './components/TelemetryHUD';
import { DigitalControlPanel } from './components/DigitalControlPanel';
import { MechanismExplainer } from './components/MechanismExplainer';
import { WhyItMatters } from './components/WhyItMatters';
import { ResultComparisonModal } from './components/ResultComparisonModal';
import { INITIAL_METRICS, TARGET_METRICS } from './data/platformData';
import { HotspotId, SimulationMetrics } from './types';
import { 
  Sparkles, 
  BarChart3, 
  ShieldCheck, 
  Info, 
  Cpu, 
  Layers, 
  Droplets,
  ExternalLink
} from 'lucide-react';

export default function App() {
  // Main simulation state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [aeratorActive, setAeratorActive] = useState<boolean>(false);
  const [intensity, setIntensity] = useState<number>(65); // 10 to 100%
  const [metrics, setMetrics] = useState<SimulationMetrics>(INITIAL_METRICS);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotId | null>(null);
  const [isResultModalOpen, setIsResultModalOpen] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Simulation physics loop: runs when isRunning is true
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);

      setMetrics((prev) => {
        const factor = (intensity / 100);
        
        // If aerator is active: faster mass transfer of O2
        // Target O2 based on intensity
        const targetO2 = aeratorActive 
          ? 6.8 + (intensity / 100) * 0.9 // up to 7.7 mg/L
          : 4.8; // only bio-phyto transfer up to ~4.8 mg/L

        const targetBod = aeratorActive ? 2.6 : 4.5;
        const targetClarity = aeratorActive ? 89 : 65;

        // Smooth delta steps
        const stepRate = 0.05 * (0.6 + factor * 0.8);

        // O2 increment
        const nextO2 = prev.dissolvedOxygen < targetO2
          ? Math.min(targetO2, prev.dissolvedOxygen + stepRate)
          : Math.max(targetO2, prev.dissolvedOxygen - stepRate * 0.3);

        // BOD decrement (lower is better)
        const nextBod = prev.bod > targetBod
          ? Math.max(targetBod, prev.bod - stepRate * 1.1)
          : Math.min(targetBod, prev.bod + stepRate * 0.2);

        // Clarity increment
        const nextClarity = prev.waterClarity < targetClarity
          ? Math.min(targetClarity, prev.waterClarity + stepRate * 9)
          : prev.waterClarity;

        // Nutrients absorption
        const nextNitrogen = Math.min(86, prev.nitrogenAbsorption + stepRate * 8);
        const nextPhosphorus = Math.min(82, prev.phosphorusAbsorption + stepRate * 7.5);

        return {
          dissolvedOxygen: nextO2,
          bod: nextBod,
          waterClarity: nextClarity,
          nitrogenAbsorption: nextNitrogen,
          phosphorusAbsorption: nextPhosphorus,
        };
      });
    }, 250);

    return () => clearInterval(interval);
  }, [isRunning, aeratorActive, intensity]);

  // Handler: Main big button «ЗАПУСТИТЬ ПЛАТФОРМУ»
  const handleToggleRun = () => {
    if (!isRunning) {
      setIsRunning(true);
      setAeratorActive(true); // turning on platform also starts the aerator by default
    } else {
      setIsRunning(false);
    }
  };

  // Handler: Toggle aerator specifically
  const handleToggleAerator = () => {
    setAeratorActive(!aeratorActive);
    // If aerator turned on while idle, prompt simulation run
    if (!aeratorActive && !isRunning) {
      setIsRunning(true);
    }
  };

  // Handler: Reset simulation back to initial murky water state
  const handleReset = () => {
    setIsRunning(false);
    setAeratorActive(false);
    setMetrics({ ...INITIAL_METRICS });
    setElapsedSeconds(0);
    setSelectedHotspot(null);
  };

  // Handler: Quick-apply optimal results
  const handleApplyTargetResults = () => {
    setIsRunning(true);
    setAeratorActive(true);
    setMetrics({ ...TARGET_METRICS });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background ambient gradient glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* 1. Header & Intro */}
        <HeaderBanner />

        {/* 2. 45-Second Express Understanding (For quick evaluation by viewers/jury) */}
        <QuickGuide />

        {/* 3. Main Stage & Simulation Dashboard (Cross-section + Control + Telemetry) */}
        <section id="interactive-simulation-stage" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                Интерактивный срез озера и биоплатформы
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Нажмите «Запустить платформу» или выберите пронумерованные точки для изучения узлов
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="header-open-result-btn"
                onClick={() => setIsResultModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-bold font-mono transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
                <span>РЕЗУЛЬТАТЫ ДО/ПОСЛЕ</span>
              </button>
            </div>
          </div>

          {/* Lake Visual Canvas Viewport */}
          <LakeSimulationCanvas
            isRunning={isRunning}
            aeratorActive={aeratorActive}
            intensity={intensity}
            dissolvedOxygen={metrics.dissolvedOxygen}
            bod={metrics.bod}
            waterClarity={metrics.waterClarity}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={setSelectedHotspot}
          />

          {/* Controls + Telemetry Metrics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Digital Control Panel (Pulse) */}
            <div className="lg:col-span-5 w-full">
              <DigitalControlPanel
                isRunning={isRunning}
                aeratorActive={aeratorActive}
                intensity={intensity}
                onToggleRun={handleToggleRun}
                onToggleAerator={handleToggleAerator}
                onReset={handleReset}
                onChangeIntensity={setIntensity}
                onOpenResult={() => setIsResultModalOpen(true)}
              />
            </div>

            {/* Right Column: Telemetry & Scientific Indicators (O2 & BOD) */}
            <div className="lg:col-span-7 w-full">
              <TelemetryHUD
                metrics={metrics}
                isRunning={isRunning}
                aeratorActive={aeratorActive}
              />
            </div>
          </div>
        </section>

        {/* 4. Mechanism Explanation Block: «Как работает платформа?» */}
        <MechanismExplainer />

        {/* 5. Additional Block: «Почему это важно?» */}
        <WhyItMatters />

        {/* 6. Footer Call-to-Action to show comparison results */}
        <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-emerald-950/30 to-cyan-950/30 border border-slate-800 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Финальная верификация технологии</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-white max-w-xl mx-auto">
            Готовы оценить суммарный экологический эффект для озера Талдыколь?
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            Посмотрите детальное математическое сопоставление показателей гидрохимического режима водоема до и после применения фитоплатформы с аэрацией.
          </p>

          <div>
            <button
              id="cta-bottom-show-result-btn"
              onClick={() => setIsResultModalOpen(true)}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm sm:text-base tracking-wider uppercase transition-all shadow-xl shadow-emerald-950/40 hover:scale-105"
            >
              ПОКАЗАТЬ РЕЗУЛЬТАТ (ДО → ПОСЛЕ)
            </button>
          </div>

          <p className="text-[11px] font-mono text-slate-500">
            Симуляция на основе принципа работы прототипа. Не является результатом реального эксперимента.
          </p>
        </div>

        {/* Result Comparison Modal */}
        <ResultComparisonModal
          isOpen={isResultModalOpen}
          onClose={() => setIsResultModalOpen(false)}
          onApplyResultsToSimulation={handleApplyTargetResults}
        />

        {/* Global Footer */}
        <footer className="pt-8 border-t border-slate-900 text-center text-xs text-slate-500 space-y-2">
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono">
            <span>Экологический проект: Озеро Талдыколь</span>
            <span>•</span>
            <span>Технология: Плавающая фитоплатформа с рогозом и аэрацией</span>
            <span>•</span>
            <span>Астана, Казахстан</span>
          </div>
          <p className="text-[10px] text-slate-600 max-w-md mx-auto">
            Интерактивный цифровой веб-прототип разработан для наглядной демонстрации принципов биофиторемедиации, массообмена O₂ и снижения БПК.
          </p>
        </footer>
      </div>
    </div>
  );
}

