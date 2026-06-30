import { useState, useEffect } from 'react';
import macbooks from '../data/macbooks.json';

const MAX_CPU = 35000;
const MAX_GPU = 150000;

type Macbook = typeof macbooks[number];

const displayRank = (d: string) =>
  d.includes('XDR') ? 2 : d.includes('Liquid') ? 1 : 0;

function isUpgrade(field: keyof Macbook, a: Macbook, b: Macbook): boolean {
  if (field === 'weight')  return parseFloat(b.weight)   < parseFloat(a.weight);
  if (field === 'display') return displayRank(b.display) > displayRank(a.display);
  return false;
}

function isChanged<K extends keyof Macbook>(field: K, a: Macbook, b: Macbook): boolean {
  return String(a[field]) !== String(b[field]);
}

// ── BarRow ────────────────────────────────────────────────────────────────────

interface BarRowProps {
  label: string;
  score: number;
  pct: number;
  barClass: string;
  isNew?: boolean;
}

function BarRow({ label, score, pct, barClass, isNew }: BarRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline gap-2">
        <span className={`text-sm ${isNew ? 'font-semibold text-[#1D1D1F]' : 'text-[#6E6E73]'}`}>
          {label}
        </span>
        <span className={`text-sm tabular-nums ${isNew ? 'font-semibold text-[#1D1D1F]' : 'text-[#6E6E73]'}`}>
          {score.toLocaleString()}
        </span>
      </div>
      <div className="w-full bg-[#E5E5EA] rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full ${barClass}`}
          style={{
            width: `${pct}%`,
            transition: 'width 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'width',
          }}
        />
      </div>
    </div>
  );
}

// ── SpecRow ───────────────────────────────────────────────────────────────────

interface SpecRowProps {
  label: string;
  valueA: string;
  valueB: string;
  changed: boolean;
  upgraded: boolean;
}

function SpecRow({ label, valueA, valueB, changed, upgraded }: SpecRowProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-[160px_1fr_1fr] px-6 md:px-12 py-5 gap-x-4 gap-y-1.5 border-b border-[#F5F5F7] last:border-0">
      {/* label — spans full width on mobile, first col on desktop */}
      <span className="col-span-2 md:col-span-1 text-[10.5px] font-semibold tracking-[0.14em] text-[#AEAEB2] uppercase md:flex md:items-center">
        {label}
      </span>
      {/* modelA value */}
      <span className="text-sm text-[#6E6E73] md:flex md:items-center">{valueA}</span>
      {/* modelB value — bold when changed, green arrow when upgraded */}
      <span className={`text-sm flex items-start gap-1 md:items-center ${changed ? 'font-semibold text-[#1D1D1F]' : 'text-[#1D1D1F]'}`}>
        {upgraded && (
          <span className="flex-shrink-0 text-[#34C759] text-[11px] font-bold mt-0.5 md:mt-0">↑</span>
        )}
        {valueB}
      </span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function ComparisonApp() {
  const [modelA, setModelA] = useState<Macbook>(macbooks[0]);
  const [modelB, setModelB] = useState<Macbook>(macbooks[macbooks.length - 1]);
  const [bars, setBars] = useState({ cpuA: 0, cpuB: 0, gpuA: 0, gpuB: 0 });

  useEffect(() => {
    setBars({ cpuA: 0, cpuB: 0, gpuA: 0, gpuB: 0 });
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() =>
        setBars({
          cpuA: (modelA.cpuScore / MAX_CPU) * 100,
          cpuB: (modelB.cpuScore / MAX_CPU) * 100,
          gpuA: (modelA.gpuScore / MAX_GPU) * 100,
          gpuB: (modelB.gpuScore / MAX_GPU) * 100,
        })
      )
    );
    return () => cancelAnimationFrame(id);
  }, [modelA, modelB]);

  // Show "slower" correctly when modelB is actually older/weaker
  const cpuDelta = modelB.cpuScore / modelA.cpuScore;
  const gpuDelta = modelB.gpuScore / modelA.gpuScore;
  const cpuRatio = cpuDelta >= 1 ? cpuDelta.toFixed(1) : (1 / cpuDelta).toFixed(1);
  const gpuRatio = gpuDelta >= 1 ? gpuDelta.toFixed(1) : (1 / gpuDelta).toFixed(1);
  const cpuFaster = cpuDelta >= 1;
  const gpuFaster = gpuDelta >= 1;

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans text-[#1D1D1F] antialiased">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="text-center px-6 pt-24 pb-20">
        <p className="text-[10.5px] font-semibold tracking-[0.22em] text-[#6E6E73] uppercase mb-5">
          Mac 比較
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-[3.5rem] font-bold tracking-tight leading-[1.06] text-[#1D1D1F] mb-5 [word-break:keep-all]">
          Mac 買い替えコンパニオン
        </h1>
        <p className="text-lg md:text-xl text-[#6E6E73] max-w-lg mx-auto leading-relaxed [word-break:keep-all]">
          チップ世代を選んで、あなたの次の Mac を見つけよう。
        </p>
      </section>

      <div className="max-w-3xl mx-auto px-5 md:px-8 space-y-4 pb-28">

        {/* ── Selector ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-[0_1px_16px_rgba(0,0,0,0.07)] px-6 py-7 md:px-10 md:py-9">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-3 sm:items-end">

            <div className="flex-1">
              <label className="block text-[10.5px] font-semibold tracking-[0.16em] text-[#AEAEB2] uppercase mb-2.5">
                現在のモデル
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-[#F5F5F7] text-[#1D1D1F] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071E3] appearance-none cursor-pointer"
                value={modelA.id}
                onChange={(e) => setModelA(macbooks.find(m => m.id === e.target.value)!)}
              >
                {macbooks.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.year} {m.name} — {m.chip}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-center sm:pb-3 sm:px-1">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#C7C7CC]">VS</span>
            </div>

            <div className="flex-1">
              <label className="block text-[10.5px] font-semibold tracking-[0.16em] text-[#AEAEB2] uppercase mb-2.5">
                比較するモデル
              </label>
              <select
                className="w-full px-4 py-3 rounded-xl bg-[#F5F5F7] text-[#1D1D1F] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0071E3] appearance-none cursor-pointer"
                value={modelB.id}
                onChange={(e) => setModelB(macbooks.find(m => m.id === e.target.value)!)}
              >
                {macbooks.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.year} {m.name} — {m.chip}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── CPU Card ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-[0_1px_16px_rgba(0,0,0,0.07)] px-8 py-12 md:px-14 md:py-16">
          <p className="text-[10.5px] font-semibold tracking-[0.22em] text-[#0071E3] uppercase text-center mb-4">
            CPU Performance
          </p>
          <p className="text-center font-bold tracking-tighter text-[#1D1D1F] leading-none mb-1 text-7xl md:text-8xl">
            {cpuRatio}<span className="text-3xl font-semibold align-baseline ml-0.5">x</span>
          </p>
          <p className="text-center text-[#6E6E73] text-base mb-12">
            {cpuFaster ? '高速' : '低速'}
          </p>
          <div className="space-y-6">
            <BarRow label={modelA.chip} score={modelA.cpuScore} pct={bars.cpuA} barClass="bg-[#C7C7CC]" />
            <BarRow label={modelB.chip} score={modelB.cpuScore} pct={bars.cpuB} barClass="bg-[#0071E3]" isNew />
          </div>
        </div>

        {/* ── GPU Card ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-[0_1px_16px_rgba(0,0,0,0.07)] px-8 py-12 md:px-14 md:py-16">
          <p className="text-[10.5px] font-semibold tracking-[0.22em] text-[#BF5AF2] uppercase text-center mb-4">
            GPU Performance
          </p>
          <p className="text-center font-bold tracking-tighter text-[#1D1D1F] leading-none mb-1 text-7xl md:text-8xl">
            {gpuRatio}<span className="text-3xl font-semibold align-baseline ml-0.5">x</span>
          </p>
          <p className="text-center text-[#6E6E73] text-base mb-12">
            {gpuFaster ? '高速' : '低速'}
          </p>
          <div className="space-y-6">
            <BarRow label={modelA.chip} score={modelA.gpuScore} pct={bars.gpuA} barClass="bg-[#C7C7CC]" />
            <BarRow label={modelB.chip} score={modelB.gpuScore} pct={bars.gpuB} barClass="bg-[#BF5AF2]" isNew />
          </div>
        </div>

        {/* ── Specs Card ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-3xl shadow-[0_1px_16px_rgba(0,0,0,0.07)] overflow-hidden">

          {/* Card header */}
          <div className="px-6 md:px-12 pt-10 pb-6">
            <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight mb-5">スペック比較</h2>
            {/* Column headers — hidden on narrow mobile, visible sm+ */}
            <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-[160px_1fr_1fr] gap-x-4 text-xs">
              <span className="hidden md:block" />
              <span className="font-semibold text-[#6E6E73]">
                {modelA.name}<br />
                <span className="font-normal">{modelA.year} · {modelA.chip}</span>
              </span>
              <span className="font-semibold text-[#0071E3]">
                {modelB.name}<br />
                <span className="font-normal text-[#6E6E73]">{modelB.year} · {modelB.chip}</span>
              </span>
            </div>
          </div>

          <div className="border-t border-[#F5F5F7]">
            <SpecRow
              label="ディスプレイ"
              valueA={modelA.display}
              valueB={modelB.display}
              changed={isChanged('display', modelA, modelB)}
              upgraded={isUpgrade('display', modelA, modelB)}
            />
            <SpecRow
              label="ポート"
              valueA={modelA.ports}
              valueB={modelB.ports}
              changed={isChanged('ports', modelA, modelB)}
              upgraded={false}
            />
            <SpecRow
              label="充電"
              valueA={modelA.watts}
              valueB={modelB.watts}
              changed={isChanged('watts', modelA, modelB)}
              upgraded={false}
            />
            <SpecRow
              label="重量"
              valueA={modelA.weight}
              valueB={modelB.weight}
              changed={isChanged('weight', modelA, modelB)}
              upgraded={isUpgrade('weight', modelA, modelB)}
            />
          </div>
          <div className="h-8" />
        </div>

      </div>
    </div>
  );
}
