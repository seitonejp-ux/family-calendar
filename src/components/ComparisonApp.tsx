import { useState } from 'react';
import macbooks from '../data/macbooks.json';

export default function ComparisonApp() {
  const [modelA, setModelA] = useState(macbooks[0]);
  const [modelB, setModelB] = useState(macbooks[3]);

  // Fixed ceiling so bars scale consistently even if more models are added later
  const maxCpu = 20000;
  const maxGpu = 70000;

  const cpuRatio = (modelB.cpuScore / modelA.cpuScore).toFixed(1);
  const gpuRatio = (modelB.gpuScore / modelA.gpuScore).toFixed(1);

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#000000] text-[#1D1D1F] dark:text-[#F5F5F7] p-8 font-sans tracking-tight">
      <div className="max-w-4xl mx-auto space-y-12">

        {/* Header + selectors */}
        <header className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">Mac Upgrade Simulator</h1>
          <div className="flex flex-col md:flex-row justify-center gap-4 items-center">
            <select
              className="px-4 py-2 rounded-xl bg-white dark:bg-[#1C1C1E] border border-gray-200 dark:border-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={modelA.id}
              onChange={(e) => setModelA(macbooks.find(m => m.id === e.target.value)!)}
            >
              {macbooks.map(m => <option key={m.id} value={m.id}>{m.year} {m.name} ({m.chip})</option>)}
            </select>
            <span className="text-gray-400 font-medium">VS</span>
            <select
              className="px-4 py-2 rounded-xl bg-white dark:bg-[#1C1C1E] border border-gray-200 dark:border-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={modelB.id}
              onChange={(e) => setModelB(macbooks.find(m => m.id === e.target.value)!)}
            >
              {macbooks.map(m => <option key={m.id} value={m.id}>{m.year} {m.name} ({m.chip})</option>)}
            </select>
          </div>
        </header>

        {/* CPU comparison */}
        <section className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-none space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">CPU Performance</h2>
            <div className="text-6xl font-bold text-blue-600 dark:text-blue-500 tracking-tighter">
              {cpuRatio}x <span className="text-2xl text-gray-500 dark:text-gray-400 font-medium tracking-normal">Faster</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-gray-500">
                <span>{modelA.chip}</span>
                <span>{modelA.cpuScore.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden">
                <div className="bg-gray-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${(modelA.cpuScore / maxCpu) * 100}%` }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-gray-500">
                <span>{modelB.chip}</span>
                <span>{modelB.cpuScore.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${(modelB.cpuScore / maxCpu) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* GPU comparison */}
        <section className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-none space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold">GPU Performance</h2>
            <div className="text-6xl font-bold text-purple-600 dark:text-purple-500 tracking-tighter">
              {gpuRatio}x <span className="text-2xl text-gray-500 dark:text-gray-400 font-medium tracking-normal">Faster</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-gray-500">
                <span>{modelA.chip}</span>
                <span>{modelA.gpuScore.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden">
                <div className="bg-gray-400 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${(modelA.gpuScore / maxGpu) * 100}%` }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium text-gray-500">
                <span>{modelB.chip}</span>
                <span>{modelB.gpuScore.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4 overflow-hidden">
                <div className="bg-purple-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${(modelB.gpuScore / maxGpu) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </section>

        {/* Specs table */}
        <section className="bg-white dark:bg-[#1C1C1E] rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-none">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800">
                <th className="py-4 font-semibold text-gray-400 w-1/3">Specs</th>
                <th className="py-4 font-semibold w-1/3">{modelA.name} ({modelA.year})</th>
                <th className="py-4 font-semibold w-1/3 text-blue-600 dark:text-blue-500">{modelB.name} ({modelB.year})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm md:text-base">
              <tr>
                <td className="py-4 text-gray-500">Ports</td>
                <td className="py-4 pr-4">{modelA.ports}</td>
                <td className="py-4 font-medium">{modelB.ports}</td>
              </tr>
              <tr>
                <td className="py-4 text-gray-500">Charging</td>
                <td className="py-4 pr-4">{modelA.watts}</td>
                <td className="py-4 font-medium">{modelB.watts}</td>
              </tr>
              <tr>
                <td className="py-4 text-gray-500">Weight</td>
                <td className="py-4 pr-4">{modelA.weight}</td>
                <td className="py-4 font-medium">{modelB.weight}</td>
              </tr>
            </tbody>
          </table>
        </section>

      </div>
    </div>
  );
}
