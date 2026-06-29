import { useState } from 'react';
import questionsData from '../data/questions.json';
import typesData from '../data/types.json';

interface Question {
  id: number;
  text: string;
  axis: string;
}

interface TypeReport {
  title: string;
  desc: string;
  strengths: string[];
  weaknesses: string[];
  relationships: string;
  jobs: string[];
}

const scaleOptions = [
  { score: 2,  size: 'w-14 h-14', color: 'bg-teal-500 hover:bg-teal-600 shadow-lg shadow-teal-200' },
  { score: 1,  size: 'w-11 h-11', color: 'bg-teal-300 hover:bg-teal-400 shadow-md shadow-teal-100' },
  { score: 0,  size: 'w-9 h-9',   color: 'bg-slate-300 hover:bg-slate-400 shadow-sm' },
  { score: -1, size: 'w-11 h-11', color: 'bg-rose-300 hover:bg-rose-400 shadow-md shadow-rose-100' },
  { score: -2, size: 'w-14 h-14', color: 'bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-200' },
];

const typeThemes: Record<string, { gradient: string; badge: string }> = {
  INTJ: { gradient: 'from-violet-600 to-indigo-700',   badge: 'bg-violet-100 text-violet-800' },
  INTP: { gradient: 'from-blue-600 to-cyan-700',        badge: 'bg-blue-100 text-blue-800' },
  ENTJ: { gradient: 'from-red-600 to-rose-700',         badge: 'bg-red-100 text-red-800' },
  ENTP: { gradient: 'from-orange-500 to-amber-600',     badge: 'bg-orange-100 text-orange-800' },
  INFJ: { gradient: 'from-teal-600 to-emerald-700',     badge: 'bg-teal-100 text-teal-800' },
  INFP: { gradient: 'from-emerald-500 to-teal-600',     badge: 'bg-emerald-100 text-emerald-800' },
  ENFJ: { gradient: 'from-pink-500 to-rose-600',        badge: 'bg-pink-100 text-pink-800' },
  ENFP: { gradient: 'from-fuchsia-500 to-pink-600',     badge: 'bg-fuchsia-100 text-fuchsia-800' },
  ISTJ: { gradient: 'from-slate-600 to-gray-700',       badge: 'bg-slate-100 text-slate-800' },
  ISFJ: { gradient: 'from-sky-500 to-blue-600',         badge: 'bg-sky-100 text-sky-800' },
  ESTJ: { gradient: 'from-amber-500 to-orange-600',     badge: 'bg-amber-100 text-amber-800' },
  ESFJ: { gradient: 'from-yellow-400 to-amber-500',     badge: 'bg-yellow-100 text-yellow-800' },
  ISTP: { gradient: 'from-cyan-600 to-sky-700',         badge: 'bg-cyan-100 text-cyan-800' },
  ISFP: { gradient: 'from-lime-500 to-green-600',       badge: 'bg-lime-100 text-lime-800' },
  ESTP: { gradient: 'from-rose-500 to-red-600',         badge: 'bg-rose-100 text-rose-800' },
  ESFP: { gradient: 'from-purple-500 to-violet-600',    badge: 'bg-purple-100 text-purple-800' },
};

const fallbackTheme = { gradient: 'from-indigo-600 to-violet-700', badge: 'bg-indigo-100 text-indigo-800' };

export default function MBTITest() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ axis: string; score: number }[]>([]);
  const [resultType, setResultType] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const currentQuestion = (questionsData as Question[])[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questionsData.length) * 100);

  const handleSelectAnswer = (score: number) => {
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = { axis: currentQuestion.axis, score };
    setAnswers(nextAnswers);

    if (currentIndex < questionsData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        calculateFinalResult(nextAnswers);
      }, 2500);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const calculateFinalResult = (finalAnswers: { axis: string; score: number }[]) => {
    const scores: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    finalAnswers.forEach((ans) => {
      if (ans.score > 0) {
        scores[ans.axis] += ans.score;
      } else if (ans.score < 0) {
        const opposite: Record<string, string> = { E: 'I', I: 'E', S: 'N', N: 'S', T: 'F', F: 'T', J: 'P', P: 'J' };
        scores[opposite[ans.axis]] += Math.abs(ans.score);
      }
    });
    const typeE_I = scores.E > scores.I ? 'E' : 'I';
    const typeS_N = scores.S > scores.N ? 'S' : 'N';
    const typeT_F = scores.T > scores.F ? 'T' : 'F';
    const typeJ_P = scores.J > scores.P ? 'J' : 'P';
    setResultType(`${typeE_I}${typeS_N}${typeT_F}${typeJ_P}`);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setResultType(null);
  };

  /* ── Analyzing screen ── */
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-rose-50 flex flex-col items-center justify-center p-6">
        <div className="relative w-16 h-16 mb-6">
          <div className="absolute inset-0 border-4 border-teal-100 rounded-full" />
          <div className="absolute inset-0 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-lg font-bold text-slate-700 animate-pulse">回答を分析中...</p>
        <p className="text-sm text-slate-400 mt-2">あなたのパーソナリティを計算しています</p>
      </div>
    );
  }

  /* ── Results screen ── */
  if (resultType && (typesData as Record<string, TypeReport>)[resultType]) {
    const report = (typesData as Record<string, TypeReport>)[resultType];
    const theme = typeThemes[resultType] ?? fallbackTheme;

    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-rose-50">
        {/* Hero */}
        <div className={`bg-gradient-to-br ${theme.gradient} px-6 pt-16 pb-24 text-center text-white`}>
          <p className="text-xs font-bold tracking-[0.35em] uppercase opacity-60 mb-4">Your Personality Type</p>
          <h1 className="text-8xl font-black tracking-tight leading-none mb-3">{resultType}</h1>
          <p className="text-xl font-semibold opacity-90">{report.title}</p>
        </div>

        <div className="max-w-2xl mx-auto px-4 -mt-10 pb-20 space-y-5">
          {/* Description */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-7">
            <p className="text-slate-600 text-sm leading-relaxed">{report.desc}</p>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-6 space-y-4">
              <h3 className="text-sm font-bold text-emerald-600 flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-black">✓</span>
                強み
              </h3>
              <ul className="space-y-2.5">
                {report.strengths.map((s, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="mt-0.5 w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-6 space-y-4">
              <h3 className="text-sm font-bold text-rose-500 flex items-center gap-2">
                <span className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-black">!</span>
                課題
              </h3>
              <ul className="space-y-2.5">
                {report.weaknesses.map((w, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                    <span className="mt-0.5 w-5 h-5 bg-rose-400 text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      {idx + 1}
                    </span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Relationships */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="text-base">💞</span> 対人関係
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">{report.relationships}</p>
          </div>

          {/* Jobs */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="text-base">💼</span> 適職環境
            </h3>
            <div className="flex flex-wrap gap-2">
              {report.jobs.map((job, idx) => (
                <span key={idx} className={`${theme.badge} px-3.5 py-1.5 rounded-full text-xs font-bold`}>
                  {job}
                </span>
              ))}
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="w-full py-4 bg-white border-2 border-slate-200 text-slate-700 font-bold text-sm rounded-2xl hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all"
          >
            もう一度診断する
          </button>
        </div>
      </div>
    );
  }

  /* ── Quiz screen ── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-rose-50 flex flex-col">
      {/* Progress header */}
      <div className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-sm border-b border-slate-100 z-50 px-5 py-3 flex items-center gap-4">
        <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-400 via-teal-500 to-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="text-xs font-bold text-slate-400 whitespace-nowrap tabular-nums">
          {currentIndex + 1} / {questionsData.length}
        </span>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 pt-20 pb-8">
        <div className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 p-8 sm:p-10 space-y-10">
          {/* Question text */}
          <div className="min-h-[8rem] flex items-center justify-center text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 leading-snug">
              {currentQuestion.text}
            </h2>
          </div>

          {/* Scale */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-bold px-1">
              <span className="text-teal-500">同意する</span>
              <span className="text-rose-400">反対する</span>
            </div>
            <div className="flex justify-between items-center px-1">
              {scaleOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(opt.score)}
                  className={`${opt.size} ${opt.color} rounded-full flex-shrink-0 active:scale-90 hover:scale-110 transition-all duration-150`}
                />
              ))}
            </div>
          </div>

          {/* Back nav */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className={`text-xs font-semibold transition-colors ${currentIndex === 0 ? 'text-slate-200 cursor-not-allowed' : 'text-slate-400 hover:text-slate-600'}`}
            >
              ← 前の質問
            </button>
            <span className="text-[10px] font-black tracking-widest text-slate-200 uppercase">MBTI TEST</span>
          </div>
        </div>
      </div>
    </div>
  );
}
