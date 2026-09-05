import React from 'react';
import { 
  AlertOctagon, 
  Fish, 
  HelpCircle, 
  TrendingDown, 
  Flame, 
  Compass, 
  MapPin, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const WhyItMatters: React.FC = () => {
  return (
    <section 
      id="why-it-matters-section"
      className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 text-sm">⚠️</span>
            Почему это важно?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Экологическая цепочка: от органических сбросов до замора водоема
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono text-cyan-300">
          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
          <span>Экосистема оз. Талдыколь</span>
        </div>
      </div>

      {/* Logical Causality Chain (Requested by prompt) */}
      <div className="p-4 sm:p-5 rounded-xl bg-slate-950/90 border border-amber-500/30 space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider font-semibold text-amber-300 flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-amber-400" />
          Цепочка деградации водоема при недостатке кислорода
        </h3>

        {/* The required causality path */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 pt-1">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs font-mono text-slate-500 block">Шаг 1</span>
            <span className="text-xs font-semibold text-rose-300 block mt-0.5">
              Больше органического загрязнения
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">
              Донный ил, стоки, отмершие водоросли
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs font-mono text-slate-500 block">Шаг 2</span>
            <span className="text-xs font-semibold text-amber-300 block mt-0.5">
              Выше БПК
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">
              Растет потребность в кислороде
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs font-mono text-slate-500 block">Шаг 3</span>
            <span className="text-xs font-semibold text-orange-300 block mt-0.5">
              Бактериям нужно больше O₂
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">
              Микроорганизмы «выжигают» кислород
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
            <span className="text-xs font-mono text-slate-500 block">Шаг 4</span>
            <span className="text-xs font-semibold text-rose-400 block mt-0.5">
              Растворённого O₂ меньше
            </span>
            <span className="text-[10px] text-slate-400 block mt-1">
              Падение ниже критических 3–4 мг/л
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-900 border border-rose-500/40 text-center bg-rose-950/20">
            <span className="text-xs font-mono text-rose-400 block">Шаг 5</span>
            <span className="text-xs font-bold text-rose-200 block mt-0.5">
              Водным организмам сложно выживать
            </span>
            <span className="text-[10px] text-rose-300/80 block mt-1">
              Замор рыбы, потеря биоразнообразия
            </span>
          </div>
        </div>
      </div>

      {/* Benchmark Highlight Box (Exact quote requested) */}
      <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            <Fish className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-1">
              Экологический ориентир нормы
            </div>
            <blockquote className="text-sm sm:text-base font-bold text-white leading-snug">
              «Растворённый O₂: около 6–8 мг/л — благоприятный диапазон для многих рыб, в зависимости от вида и условий».
            </blockquote>
          </div>
        </div>

        <div className="shrink-0 px-3 py-2 rounded-lg bg-slate-900/80 border border-slate-700/80 text-center">
          <span className="text-[11px] font-mono text-slate-400 block">Целевой уровень</span>
          <span className="text-lg font-bold font-mono text-emerald-400">≥ 6.5 мг/л</span>
        </div>
      </div>

      {/* Local Context: Lake Taldykol (Астана) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
          <h4 className="font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            Специфика озера Талдыколь
          </h4>
          <p className="leading-relaxed text-slate-400">
            Талдыколь — уникальный водно-болотный массив в черте Астаны, место остановки сотен видов перелетных птиц (включая фламинго). Мелководность водоема ускоряет прогрев летом и образование застойных бескислородных зон с резким неприятным запахом.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
          <h4 className="font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Преимущество плавающих фитоплатформ
          </h4>
          <p className="leading-relaxed text-slate-400">
            В отличие от бетонирования или химической обработки, плавающая биоплатформа не нарушает природное дно. Корневая масса рогоза работает как живой фильтр, а фонтанная аэрация возвращает жизнь и кислород даже в самые застойные участки озера.
          </p>
        </div>
      </div>
    </section>
  );
};
