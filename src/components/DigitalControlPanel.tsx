import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Power, 
  Sliders, 
  Gauge, 
  Zap, 
  Sparkles,
  BarChart3
} from 'lucide-react';

interface DigitalControlPanelProps {
  isRunning: boolean;
  aeratorActive: boolean;
  intensity: number;
  onToggleRun: () => void;
  onToggleAerator: () => void;
  onReset: () => void;
  onChangeIntensity: (val: number) => void;
  onOpenResult: () => void;
}

export const DigitalControlPanel: React.FC<DigitalControlPanelProps> = ({
  isRunning,
  aeratorActive,
  intensity,
  onToggleRun,
  onToggleAerator,
  onReset,
  onChangeIntensity,
  onOpenResult,
}) => {
  return (
    <div 
      id="digital-control-panel"
      className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Sliders className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
            Digital-пульт управления
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Статус системы:</span>
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-semibold ${
            isRunning 
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
              : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
            {isRunning ? 'ОНЛАЙН' : 'ОЖИДАНИЕ'}
          </span>
        </div>
      </div>

      {/* Primary Big Action Button: «ЗАПУСТИТЬ ПЛАТФОРМУ» */}
      <div>
        <button
          id="main-toggle-platform-btn"
          onClick={onToggleRun}
          className={`w-full py-4 px-6 rounded-xl font-bold text-base sm:text-lg tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl ${
            isRunning
              ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 shadow-amber-900/40'
              : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 shadow-emerald-900/50 hover:scale-[1.01]'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
              <span>ПРИОСТАНОВИТЬ СИМУЛЯЦИЮ</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
              <span>ЗАПУСТИТЬ ПЛАТФОРМУ</span>
            </>
          )}
        </button>
      </div>

      {/* Sub-controls Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Toggle Aerator */}
        <button
          id="btn-toggle-aerator"
          onClick={onToggleAerator}
          className={`px-3 py-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            aeratorActive
              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-sm'
              : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-300'
          }`}
        >
          <Power className={`w-3.5 h-3.5 ${aeratorActive ? 'text-cyan-400' : 'text-slate-400'}`} />
          <span>{aeratorActive ? 'Выключить аэратор' : 'Включить аэратор'}</span>
        </button>

        {/* Toggle Simulation Run */}
        <button
          id="btn-toggle-sim"
          onClick={onToggleRun}
          className={`px-3 py-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            isRunning
              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              : 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 text-slate-300'
          }`}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isRunning ? 'Пауза' : 'Запустить симуляцию'}</span>
        </button>

        {/* Reset Button */}
        <button
          id="btn-reset-simulation"
          onClick={onReset}
          className="px-3 py-2.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-rose-950/40 hover:border-rose-700/60 text-slate-300 hover:text-rose-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Сбросить</span>
        </button>

        {/* Show Results Button */}
        <button
          id="btn-open-result-modal"
          onClick={onOpenResult}
          className="px-3 py-2.5 rounded-lg border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
        >
          <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
          <span>ПОКАЗАТЬ РЕЗУЛЬТАТ</span>
        </button>
      </div>

      {/* Aeration Intensity Slider */}
      <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label htmlFor="intensity-slider" className="font-semibold text-slate-200 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Интенсивность аэрации</span>
          </label>
          <div className="font-mono text-cyan-400 font-bold">
            {intensity}% 
            <span className="text-[10px] text-slate-400 font-normal ml-1.5">
              ({intensity < 35 ? 'Эконом' : intensity < 75 ? 'Стандарт' : 'Форсаж'})
            </span>
          </div>
        </div>

        <input
          id="intensity-slider"
          type="range"
          min="10"
          max="100"
          step="5"
          value={intensity}
          onChange={(e) => onChangeIntensity(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
        />

        <div className="flex justify-between text-[10px] font-mono text-slate-500">
          <span>10% (Минимальный расход)</span>
          <span>50% (Номинальный)</span>
          <span>100% (Макс. массообмен)</span>
        </div>
      </div>
    </div>
  );
};
