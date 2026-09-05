import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Droplets, 
  Target, 
  Layers, 
  Activity, 
  Cpu, 
  ChevronDown, 
  ChevronUp,
  ExternalLink
} from 'lucide-react';

export const QuickGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  const pillars = [
    {
      num: '1',
      title: 'Проблема',
      text: 'Эвтрофикация оз. Талдыколь: избыток органики, дефицит кислорода (O₂ < 4 мг/л), риск замора рыбы.',
      color: 'border-rose-500/40 text-rose-300',
    },
    {
      num: '2',
      title: 'Платформа',
      text: 'Автономный плавающий модуль с посадками рогоза, мощной ризосферой и центральным аэратором.',
      color: 'border-emerald-500/40 text-emerald-300',
    },
    {
      num: '3',
      title: 'Очистка воды',
      text: 'Корни поглощают N и P, аэратор распыляет воду, насыщая O₂ и разрушая застойные слои.',
      color: 'border-cyan-500/40 text-cyan-300',
    },
    {
      num: '4',
      title: 'O₂ и БПК',
      text: 'O₂ — дыхание фауны (цель: 6–8 мг/л). БПК — показатель органической грязи (снижаем в 3 раза).',
      color: 'border-teal-500/40 text-teal-300',
    },
    {
      num: '5',
      title: 'Digital-модель',
      text: 'Интерактивная физико-биологическая симуляция реакции экосистемы при регулировке аэрации.',
      color: 'border-amber-500/40 text-amber-300',
    },
  ];

  return (
    <div 
      id="quick-guide-widget"
      className="rounded-xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md"
    >
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-emerald-500/20 text-emerald-400">
            <Target className="w-3.5 h-3.5" />
          </span>
          <span className="text-xs font-bold text-slate-200 tracking-wide uppercase font-mono">
            Экспресс-понимание проекта за 45 секунд
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
            5 ключевых тезисов
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
          <span>{isOpen ? 'Свернуть' : 'Развернуть'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {isOpen && (
        <div className="p-3.5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-5 gap-2.5 bg-slate-950/40">
          {pillars.map((p) => (
            <div key={p.num} className={`p-2.5 rounded-lg border bg-slate-900/60 ${p.color} space-y-1`}>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold">
                <span className="w-4 h-4 rounded-full bg-slate-800 flex items-center justify-center text-[10px]">
                  {p.num}
                </span>
                <span>{p.title}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                {p.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const HeaderBanner: React.FC = () => {
  return (
    <header className="w-full flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            Экологический Digital-прототип
          </span>
          <span className="text-xs font-mono text-slate-400">
            • Озеро Талдыколь (Астана)
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          Фитоплатформа Талдыколь{' '}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            с рогозом и аэрацией
          </span>
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          Интерактивная научная модель восстановления гидрохимического режима: биологическая ризофильтрация загрязняющих веществ и поверхностное насыщение воды кислородом.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="px-3.5 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-right">
          <span className="text-[10px] font-mono text-slate-400 block uppercase">
            Технологическая концепция
          </span>
          <span className="text-xs font-bold font-mono text-cyan-300">
            Плавающее биоплато + Аэратор
          </span>
        </div>
      </div>
    </header>
  );
};
