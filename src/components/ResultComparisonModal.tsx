import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Droplets, 
  ShieldAlert, 
  FlaskConical,
  Scale
} from 'lucide-react';

interface ResultComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyResultsToSimulation: () => void;
}

export const ResultComparisonModal: React.FC<ResultComparisonModalProps> = ({
  isOpen,
  onClose,
  onApplyResultsToSimulation,
}) => {
  const [activeView, setActiveView] = useState<'side-by-side' | 'slider'>('side-by-side');

  if (!isOpen) return null;

  return (
    <div 
      id="result-comparison-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-5 sm:p-7 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                <Scale className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
                Digital-демонстрация эффективности
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Сравнение показателей: ДО → ПОСЛЕ
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Моделирование эффекта работы плавающей платформы с рогозом и аэратором на озере Талдыколь
            </p>
          </div>

          <button
            id="close-modal-x-btn"
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Закрыть окно"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mandatory Scientific Disclaimer Banner (Prompt strict requirement) */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-200 text-xs flex items-start gap-2.5">
          <FlaskConical className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-amber-300">ВАЖНОЕ ПРИМЕЧАНИЕ:</strong>{' '}
            <span>Симуляция на основе принципа работы прототипа. Не является результатом реального эксперимента.</span>
            <span className="block text-[11px] text-amber-400/80 mt-0.5">
              Расчет иллюстрирует теоретический массообмен кислорода и биопоглощение азота/фосфора ризосферой рогоза.
            </span>
          </div>
        </div>

        {/* 3 Core Results Cards (O2, BOD, Water State) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. O2 Metric */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                Растворённый O₂
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                УВЕЛИЧИЛСЯ (+142%)
              </span>
            </div>

            <div className="flex items-center justify-between text-center py-2 bg-slate-900/60 rounded-lg px-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 block">ДО</span>
                <span className="text-xl font-mono font-black text-rose-400">3.1</span>
                <span className="text-[10px] font-mono text-slate-500 block">мг/л</span>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[10px] font-mono text-slate-500 block">ПОСЛЕ</span>
                <span className="text-xl font-mono font-black text-emerald-400">7.5</span>
                <span className="text-[10px] font-mono text-slate-500 block">мг/л</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Кислород поднялся до оптимального коридора (6–8 мг/л). Ликвидирован риск замора рыбы в озере.
            </p>
          </div>

          {/* 2. BOD Metric */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                БПК (Органика)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                СНИЗИЛСЯ (-71%)
              </span>
            </div>

            <div className="flex items-center justify-between text-center py-2 bg-slate-900/60 rounded-lg px-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 block">ДО</span>
                <span className="text-xl font-mono font-black text-amber-400">9.8</span>
                <span className="text-[10px] font-mono text-slate-500 block">мг/л</span>
              </div>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-[10px] font-mono text-slate-500 block">ПОСЛЕ</span>
                <span className="text-xl font-mono font-black text-cyan-300">2.8</span>
                <span className="text-[10px] font-mono text-slate-500 block">мг/л</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Биохимическое потребление кислорода упало до уровня чистых водоемов: органика связана корнями и бактериями.
            </p>
          </div>

          {/* 3. Water Condition */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                Состояние воды
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                УЛУЧШИЛОСЬ
              </span>
            </div>

            <div className="flex items-center justify-between text-center py-2 bg-slate-900/60 rounded-lg px-3">
              <div>
                <span className="text-[10px] font-mono text-slate-500 block">ДО</span>
                <span className="text-xs font-bold text-rose-400 block">Мутная</span>
                <span className="text-[10px] text-slate-500 block">Запах, ил</span>
              </div>
              <ArrowRight className="w-4 h-4 text-teal-400" />
              <div>
                <span className="text-[10px] font-mono text-slate-500 block">ПОСЛЕ</span>
                <span className="text-xs font-bold text-teal-300 block">Прозрачная</span>
                <span className="text-[10px] text-slate-500 block">Аэробная</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Прозрачность выросла с 34% до 89%. Устранены застойные газы, восстановлена естественная среда Талдыколя.
            </p>
          </div>
        </div>

        {/* Detailed Side-by-Side Comparison Matrix */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 overflow-hidden">
          <h4 className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-300 mb-3">
            Сводная таблица параметров экосистемы озера
          </h4>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="py-2 px-3">Параметр</th>
                  <th className="py-2 px-3 text-rose-400">ДО работы платформы</th>
                  <th className="py-2 px-3 text-emerald-400">ПОСЛЕ работы платформы</th>
                  <th className="py-2 px-3">Экологический эффект</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-white">Растворённый кислород (O₂)</td>
                  <td className="py-2.5 px-3 font-mono text-rose-400">3.1 мг/л (Дефицит)</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">7.5 мг/л (Оптимум)</td>
                  <td className="py-2.5 px-3 text-slate-400">Предотвращение замора рыбы, дыхание гидробионтов</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-white">БПК (БПК₅)</td>
                  <td className="py-2.5 px-3 font-mono text-amber-400">9.8 мг/л (Высокое)</td>
                  <td className="py-2.5 px-3 font-mono text-cyan-400 font-bold">2.8 мг/л (Чистая вода)</td>
                  <td className="py-2.5 px-3 text-slate-400">Бактерии переработали органические отложения</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-white">Прозрачность воды</td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">34% (Взвесь, водоросли)</td>
                  <td className="py-2.5 px-3 font-mono text-teal-400 font-bold">89% (Осветление)</td>
                  <td className="py-2.5 px-3 text-slate-400">Глубокое проникновение солнечного света</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-white">Усвоение азота и фосфора</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">&lt; 15% (Накопление)</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-400 font-bold">84% биопоглощение</td>
                  <td className="py-2.5 px-3 text-slate-400">Блокирование цветения сине-зеленых водорослей</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-white">Запах и газы (H₂S, CH₄)</td>
                  <td className="py-2.5 px-3 text-rose-400">Выраженный гнилостный</td>
                  <td className="py-2.5 px-3 text-emerald-400 font-bold">Отсутствует (Дегазация)</td>
                  <td className="py-2.5 px-3 text-slate-400">Комфортная рекреационная среда для города</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            id="apply-simulation-target-btn"
            onClick={() => {
              onApplyResultsToSimulation();
              onClose();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-xs sm:text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Применить эти показатели в интерактивный холст</span>
          </button>

          <button
            id="close-modal-bottom-btn"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition-colors"
          >
            Закрыть просмотр
          </button>
        </div>
      </div>
    </div>
  );
};
