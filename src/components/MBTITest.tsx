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

export default function MBTITest() {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<{ axis: string; score: number }[]>([]);
  const [resultType, setResultType] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const scaleOptions = [
    { label: "同意", subLabel: "強く", score: 2, color: "bg-indigo-600 text-white hover:bg-indigo-700" },
    { label: "同意", subLabel: "少し", score: 1, color: "bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100" },
    { label: "中立", subLabel: "", score: 0, color: "bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100" },
    { label: "反対", subLabel: "少し", score: -1, color: "bg-orange-50/50 border border-orange-200 text-orange-700 hover:bg-orange-100/60" },
    { label: "反対", subLabel: "強く", score: -2, color: "bg-orange-600 text-white hover:bg-orange-700" },
  ];

  const currentQuestion = (questionsData as Question[])[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / questionsData.length) * 100);

  const handleSelectAnswer = (score: number) => {
    const nextAnswers = [...answers];
    nextAnswers[currentIndex] = { axis: currentQuestion.axis, score: score };
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
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const calculateFinalResult = (finalAnswers: { axis: string; score: number }[]) => {
    const scores: Record<string, number> = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    finalAnswers.forEach((ans) => {
      if (ans.score > 0) {
        scores[ans.axis] += ans.score;
      } else if (ans.score < 0) {
        const opposite: Record<string, string> = { E: 'I', I: 'E', S: 'N', N: 'S', T: 'F', F: 'T', J: 'P', P: 'J' };
        const oppAxis = opposite[ans.axis];
        scores[oppAxis] += Math.abs(ans.score);
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

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-6">
        <div className="w-12 h-12 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-lg font-medium text-slate-800 tracking-tight animate-pulse">回答を分析中...</h2>
      </div>
    );
  }

  if (resultType && (typesData as Record<string, TypeReport>)[resultType]) {
    const report = (typesData as Record<string, TypeReport>)[resultType];
    return (
      <div className="min-h-screen bg-[#faf8f5] text-slate-900 py-16 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold tracking-widest text-indigo-600 uppercase">Personality Report</span>
            <h1 className="text-5xl font-bold tracking-tight text-slate-900">{resultType}</h1>
            <p className="text-xl font-medium text-slate-700">{report.title}</p>
            <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed pt-2">{report.desc}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl space-y-3">
              <h3 className="text-sm font-semibold text-emerald-900 flex items-center gap-2">● 強み</h3>
              <ul className="space-y-2 text-slate-700 text-xs">
                {report.strengths.map((s, idx) => <li key={idx}>✓ {s}</li>)}
              </ul>
            </div>
            <div className="bg-rose-50/50 border border-rose-100 p-6 rounded-2xl space-y-3">
              <h3 className="text-sm font-semibold text-rose-900 flex items-center gap-2">● 課題</h3>
              <ul className="space-y-2 text-slate-700 text-xs">
                {report.weaknesses.map((w, idx) => <li key={idx}>・ {w}</li>)}
              </ul>
            </div>
          </div>

          <div className="space-y-6 border-t border-slate-200/60 pt-8">
            <div className="space-y-2">
              <h3 className="text-md font-semibold text-slate-900">対人関係</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{report.relationships}</p>
            </div>
            <div className="space-y-3">
              <h3 className="text-md font-semibold text-slate-900">適職環境</h3>
              <div className="flex flex-wrap gap-2">
                {report.jobs.map((job, idx) => (
                  <span key={idx} className="bg-white border border-slate-200 px-3 py-1 rounded-full text-slate-600 text-xs font-medium shadow-sm">
                    {job}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-200/60">
            <button className="flex-1 py-3 bg-indigo-600 text-white font-medium text-xs rounded-full hover:bg-indigo-700 transition">
              結果をシェアする
            </button>
            <button onClick={handleReset} className="flex-1 py-3 bg-white border border-slate-300 text-slate-600 font-medium text-xs rounded-full hover:bg-slate-50 transition">
              もう一度診断する
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-4">
      <div className="fixed top-0 left-0 w-full bg-white border-b border-slate-100 z-50 px-6 py-4 flex items-center justify-between">
        <div className="w-full max-w-md bg-slate-100 h-1 rounded-full overflow-hidden">
          <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
        </div>
        <span className="text-xs font-medium text-slate-400 ml-4 whitespace-nowrap">
          {currentIndex + 1} / {questionsData.length}
        </span>
      </div>

      <div className="w-full max-w-xl bg-white border border-slate-100 rounded-3xl shadow-sm p-8 sm:p-12 mt-12 space-y-10">
        <div className="text-center min-h-[4rem] flex items-center justify-center">
          <h2 className="text-lg sm:text-xl font-medium text-slate-800 leading-relaxed">
            {currentQuestion.text}
          </h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center max-w-sm mx-auto gap-1">
            {scaleOptions.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(opt.score)}
                className={`${opt.color} h-11 w-11 rounded-full flex flex-col items-center justify-center text-xs font-medium transition duration-150 transform hover:scale-105 active:scale-95 shadow-sm`}
              >
                <span className="text-[9px] opacity-80">{opt.subLabel}</span>
                <span className="text-[10px] font-bold">{opt.label}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-semibold text-slate-400 px-4 max-w-sm mx-auto">
            <span>同意する</span>
            <span>反対する</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className={`text-xs font-medium transition ${currentIndex === 0 ? "text-slate-200 cursor-not-allowed" : "text-slate-400 hover:text-slate-600"}`}
          >
            ← 前の質問
          </button>
          <span className="text-[10px] tracking-widest text-slate-300 uppercase font-bold">MBTI WIZARD</span>
        </div>
      </div>
    </div>
  );
}
