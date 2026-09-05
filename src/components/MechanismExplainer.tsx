import React, { useState } from 'react';
import { 
  Leaf, 
  Droplets, 
  Sparkles, 
  ArrowRight, 
  Waves, 
  ShieldCheck, 
  CheckCircle,
  FlaskConical,
  Activity
} from 'lucide-react';

interface MechanismExplainerProps {
  currentStepIndex?: number;
}

export const MechanismExplainer: React.FC<MechanismExplainerProps> = () => {
  const [activeTab, setActiveTab] = useState<number>(0);

  const steps = [
    {
      id: 1,
      number: '01',
      title: 'Растения (Рогоз)',
      icon: Leaf,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 border-emerald-500/30',
      subtitle: 'Фиторемедиация и ризосфера',
      summary: 'Корни рогоза и микроорганизмы вокруг них помогают поглощать часть загрязняющих и органических веществ.',
      details: [
        'Корневая система образует развитый субстрат для полезных аэробных бактерий-деструкторов.',
        'Рогоз связывает избыточный азот (N) и фосфор (P), лишая сине-зеленые водоросли питания.',
        'Микропоры в корнях механически задерживают взвешенные частицы и осветляют воду озера.',
      ],
    },
    {
      id: 2,
      number: '02',
      title: 'Аэрация',
      icon: Droplets,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/10 border-cyan-500/30',
      subtitle: 'Массообмен кислорода',
      summary: 'Помпа забирает воду снизу и разбрызгивает её сверху. При контакте с воздухом вода насыщается кислородом.',
      details: [
        'Придонный забор ликвидирует застойные анаэробные линзы на дне озера Талдыколь.',
        'Диспергирование капель на факеле фонтана увеличивает удельную поверхность контакта «вода-воздух» в сотни раз.',
        'Одновременно происходит естественная дегазация токсичных газов (метан, сероводород).',
      ],
    },
    {
      id: 3,
      number: '03',
      title: 'Улучшение условий',
      icon: Sparkles,
      iconColor: 'text-teal-300',
      iconBg: 'bg-teal-500/10 border-teal-500/30',
      subtitle: 'Аэробное самоочищение',
      summary: 'Повышение доступного кислорода помогает поддерживать водную экосистему.',
      details: [
        'Растворённый кислород стимулирует микроорганизмы активно окислять органику (снижается БПК).',
        'Создаётся благоприятная зона обитания (6–8 мг/л O₂) для рыб, ракообразных и зоопланктона.',
        'Устраняются неприятные запахи гниения и восстанавливается природный биобаланс водоема.',
      ],
    },
  ];

  // 5-step animated flow pipeline requested by user:
  // Загрязнённая вода → растения + корни → аэрация → больше O₂ → улучшение качества воды
  const flowNodes = [
    { label: 'Загрязнённая вода', sub: 'Высокий БПК, мутность', icon: '⚠️', color: 'border-amber-600/50 bg-amber-950/30 text-amber-300' },
    { label: 'Растения + корни', sub: 'Поглощение биогенов', icon: '🌿', color: 'border-emerald-500/50 bg-emerald-950/30 text-emerald-300' },
    { label: 'Аэрация', sub: 'Фонтанное распыление', icon: '💦', color: 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300' },
    { label: 'Больше O₂', sub: 'Насыщение кислородом', icon: '🫧', color: 'border-sky-400/50 bg-sky-950/30 text-sky-300' },
    { label: 'Улучшение качества воды', sub: 'Здоровая экосистема', icon: '✨', color: 'border-teal-400/50 bg-teal-950/30 text-teal-300' },
  ];

  return (
    <section 
      id="mechanism-explanation-section"
      className="p-5 sm:p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-6"
    >
      <div>
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm">🌿</span>
            Как работает платформа?
          </h2>
          <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full">
            3 ключевых этапа
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400">
          Синтез фитомелиорации и принудительной циркуляционной оксигенации
        </p>
      </div>

      {/* Interactive Scheme Pipeline (Загрязнённая вода → растения + корни → аэрация → больше O₂ → улучшение качества воды) */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            Анимированная схема процесса
          </span>
          <span className="text-[11px] font-mono text-slate-400">Непрерывный биоцикл</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
          {flowNodes.map((node, i) => (
            <div key={i} className="flex sm:flex-col items-center">
              <div className={`w-full p-2.5 rounded-lg border ${node.color} flex sm:flex-col items-center sm:text-center gap-2.5 transition-transform hover:scale-102`}>
                <span className="text-xl sm:text-2xl">{node.icon}</span>
                <div className="min-w-0">
                  <div className="text-xs font-bold leading-tight truncate sm:whitespace-normal">
                    {node.label}
                  </div>
                  <div className="text-[10px] text-slate-400 leading-tight">
                    {node.sub}
                  </div>
                </div>
              </div>

              {/* Arrow separator (hidden after last item) */}
              {i < flowNodes.length - 1 && (
                <div className="sm:hidden text-slate-500 px-1">
                  ↓
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* The 3 Core Steps Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((step, idx) => {
          const IconComp = step.icon;
          const isSelected = activeTab === idx;
          return (
            <div
              key={step.id}
              onClick={() => setActiveTab(idx)}
              className={`p-4 sm:p-5 rounded-xl border cursor-pointer transition-all duration-300 ${
                isSelected
                  ? 'bg-slate-800/90 border-emerald-500/60 shadow-lg shadow-emerald-950/30 scale-[1.02]'
                  : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2.5 rounded-lg border ${step.iconBg}`}>
                  <IconComp className={`w-5 h-5 ${step.iconColor}`} />
                </div>
                <span className="text-xl font-mono font-black text-slate-700">
                  {step.number}
                </span>
              </div>

              <div className="mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                  {step.subtitle}
                </span>
                <h3 className="text-base font-bold text-white">
                  {step.title}
                </h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {step.summary}
              </p>

              <div className="border-t border-slate-800/80 pt-2.5 space-y-1.5">
                {step.details.map((detail, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
