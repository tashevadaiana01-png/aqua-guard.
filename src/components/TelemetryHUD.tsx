import React from 'react';
import { SimulationMetrics } from '../types';
import { 
  Activity, 
  Droplets, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  Sparkles,
  Layers,
  FlaskConical
} from 'lucide-react';

interface TelemetryHUDProps {
  metrics: SimulationMetrics;
  isRunning: boolean;
  aeratorActive: boolean;
}

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({
  metrics,
  isRunning,
  aeratorActive,
}) => {
  const { dissolvedOxygen, bod, waterClarity } = metrics;

  // O2 Status determination
  // < 4.0: Critical (Hypoxia)
  // 4.0 - 6.0: Moderate / Suboptimal
  // >= 6.0: Optimal for fish and aquatic flora
  const isOxygenOptimal = dissolvedOxygen >= 6.0;
  const isOxygenModerate = dissolvedOxygen >= 4.0 && dissolvedOxygen < 6.0;

  // BOD Status determination
  // > 8.0: High organic pollution
  // 4.0 - 8.0: Moderate pollution
  // < 4.0: Clean / Favorable
  const isBodHigh = bod > 7.0;
  const isBodModerate = bod >= 4.0 && bod <= 7.0;

  return (
    <div className="w-full space-y-3">
      {/* Simulation Notice Disclaimer (Strict requirement) */}
      <div className="flex items-center justify-between px-3.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
        <div className="flex items-center gap-2">
          <FlaskConical className="w-4 h-4 shrink-0 text-amber-400" />
          <span className="font-medium">
            <strong className="font-semibold text-amber-200">Цифровая эко-модель / симуляция:</strong> расчёт динамики биофиторемедиации и поверхностной аэрации. Не является результатом натурного эксперимента.
          </span>
        </div>
        <span className="hidden md:inline-block font-mono text-[11px] text-amber-400/80 uppercase tracking-wider">
          v1.4 • Талдыколь
        </span>
      </div>

      {/* Main Two Telemetry Cards: O2 and BOD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* CARD 1: Растворённый кислород (O2) */}
        <div 
          id="metric-card-oxygen"
          className={`p-4 rounded-xl border transition-all duration-500 relative overflow-hidden backdrop-blur-md ${
            isOxygenOptimal 
              ? 'bg-slate-900/90 border-emerald-500/50 shadow-emerald-950/30' 
              : isOxygenModerate
              ? 'bg-slate-900/90 border-cyan-500/40 shadow-cyan-950/20'
              : 'bg-slate-900/90 border-rose-500/40 shadow-rose-950/20'
          } shadow-xl`}
        >
          {/* Subtle background glow */}
          <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-20 ${
            isOxygenOptimal ? 'bg-emerald-500' : 'bg-rose-500'
          }`} />

          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${
                isOxygenOptimal ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
              }`}>
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Растворённый кислород
                  <span className="text-xs font-mono font-normal text-slate-400">(O₂)</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Содержание свободного O₂ в воде озера
                </p>
              </div>
            </div>

            {/* Status chip */}
            <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              isOxygenOptimal 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                : isOxygenModerate
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            }`}>
              {isOxygenOptimal ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Норма (6–8)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Дефицит O₂</span>
                </>
              )}
            </div>
          </div>

          {/* Value Display */}
          <div className="flex items-baseline gap-3 my-3">
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
              {dissolvedOxygen.toFixed(1)}
            </span>
            <span className="text-sm font-mono text-slate-400">
              мг/л
            </span>

            {isRunning && aeratorActive && (
              <span className="ml-auto flex items-center text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                + насыщение
              </span>
            )}
          </div>

          {/* Progress bar gauge */}
          <div className="space-y-1.5">
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60 flex">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  isOxygenOptimal 
                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]' 
                    : isOxygenModerate
                    ? 'bg-gradient-to-r from-amber-500 to-cyan-400'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, (dissolvedOxygen / 9.0) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>0 (Замор)</span>
              <span className="text-rose-400">&lt; 4.0 Критич.</span>
              <span className="text-emerald-400 font-semibold">6.0 - 8.0 Оптимум</span>
              <span>10.0 мг/л</span>
            </div>
          </div>

          {/* Scientific summary note */}
          <p className="mt-2.5 text-[11px] text-slate-400 leading-snug border-t border-slate-800 pt-2">
            {isOxygenOptimal 
              ? 'Благоприятная среда: кислорода достаточно для ихтиофауны и активной биодеградации органики.'
              : 'Опасная гипоксия: при значениях ниже 4 мг/л рыба задыхается, преобладают процессы гниения.'}
          </p>
        </div>

        {/* CARD 2: БПК (Биохимическое потребление кислорода) */}
        <div 
          id="metric-card-bod"
          className={`p-4 rounded-xl border transition-all duration-500 relative overflow-hidden backdrop-blur-md ${
            !isBodHigh && !isBodModerate
              ? 'bg-slate-900/90 border-emerald-500/50 shadow-emerald-950/30'
              : isBodModerate
              ? 'bg-slate-900/90 border-amber-500/40 shadow-amber-950/20'
              : 'bg-slate-900/90 border-amber-600/50 shadow-amber-950/20'
          } shadow-xl`}
        >
          {/* Subtle background glow */}
          <div className={`absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-3xl pointer-events-none opacity-20 ${
            !isBodHigh ? 'bg-emerald-500' : 'bg-amber-600'
          }`} />

          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${
                !isBodHigh && !isBodModerate ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  БПК
                  <span className="text-xs font-mono font-normal text-slate-400">(БПК₅ / Органика)</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  Потребность бактерий в O₂ для разложения
                </p>
              </div>
            </div>

            {/* Status chip */}
            <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              !isBodHigh && !isBodModerate
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : isBodModerate
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {!isBodHigh && !isBodModerate ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Низкий (Чисто)</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Высокий (Загрязнено)</span>
                </>
              )}
            </div>
          </div>

          {/* Value Display */}
          <div className="flex items-baseline gap-3 my-3">
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
              {bod.toFixed(1)}
            </span>
            <span className="text-sm font-mono text-slate-400">
              мг O₂/л
            </span>

            {isRunning && (
              <span className="ml-auto flex items-center text-xs font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                <TrendingDown className="w-3.5 h-3.5 mr-1" />
                - снижение органики
              </span>
            )}
          </div>

          {/* Progress bar gauge (Inverted: lower is better!) */}
          <div className="space-y-1.5">
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60 flex">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  !isBodHigh && !isBodModerate
                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-400'
                    : isBodModerate
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500'
                    : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, (bod / 12.0) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span className="text-emerald-400 font-semibold">&lt; 3.0 Чистая вода</span>
              <span className="text-amber-400">4.0 - 7.0 Умерен.</span>
              <span className="text-rose-400">&gt; 8.0 Высокая органика</span>
            </div>
          </div>

          {/* Scientific summary note */}
          <p className="mt-2.5 text-[11px] text-slate-400 leading-snug border-t border-slate-800 pt-2">
            {!isBodHigh && !isBodModerate
              ? 'Органическая нагрузка минимальна: корни рогоза и микроорганизмы связали биогены.'
              : 'Высокий БПК означает, что гниющая органика забирает весь кислород из озера.'}
          </p>
        </div>
      </div>

      {/* Secondary Eco-Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 font-medium">Прозрачность воды:</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-mono text-sm font-bold text-slate-200">{waterClarity.toFixed(0)}%</span>
            <span className="text-[10px] text-slate-400">
              ({waterClarity > 70 ? 'Высокая' : waterClarity > 50 ? 'Средняя' : 'Мутная'})
            </span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 font-medium">Поглощение азота (N):</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-mono text-sm font-bold text-emerald-400">{metrics.nitrogenAbsorption.toFixed(0)}%</span>
            <span className="text-[10px] text-slate-400">(Ризосфера)</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 font-medium">Поглощение фосфора (P):</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-mono text-sm font-bold text-cyan-400">{metrics.phosphorusAbsorption.toFixed(0)}%</span>
            <span className="text-[10px] text-slate-400">(Биомасса)</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-[11px] text-slate-400 font-medium">Температура воды:</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="font-mono text-sm font-bold text-slate-200">19.2 °C</span>
            <span className="text-[10px] text-slate-400">(Летний режим)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
