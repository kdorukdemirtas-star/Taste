import { Sparkles, Wand2, X } from 'lucide-react';
import type { TasteFinding, TasteMetrics } from '../lib/analyzer';

interface TasteHUDProps {
  score: number;
  summary: string;
  findings: TasteFinding[];
  metrics: TasteMetrics;
  isOpen: boolean;
  onToggle: () => void;
  onFix?: () => void;
}

const labels: Record<keyof TasteMetrics, string> = {
  contrast: 'Contrast & Readability',
  spacing: 'Alignment & Spacing',
  premiumFeel: 'Premium Feel',
  typography: 'Typography',
  hierarchy: 'Visual Hierarchy',
};

const barColors: Record<keyof TasteMetrics, string> = {
  contrast: 'bg-indigo-400',
  spacing: 'bg-purple-400',
  premiumFeel: 'bg-emerald-400',
  typography: 'bg-sky-400',
  hierarchy: 'bg-amber-400',
};

export default function TasteHUD({ score, summary, findings, metrics, isOpen, onToggle, onFix }: TasteHUDProps) {
  const status =
    score >= 85
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
      : score >= 60
        ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
        : 'border-pink-500/30 bg-pink-500/10 text-pink-300';

  const dot = score >= 85 ? 'bg-emerald-400' : score >= 60 ? 'bg-amber-400' : 'bg-pink-400';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      {isOpen && (
        <section className="w-[min(92vw,390px)] rounded-3xl border border-white/10 bg-zinc-950/90 p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl">
          <div className="mb-4 flex items-start justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" /> Taste HUD
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">{summary}</p>
            </div>
            <button type="button" onClick={onToggle} className="rounded-full p-1.5 text-zinc-500 transition hover:bg-white/10 hover:text-white" aria-label="Close HUD panel">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-5 flex items-end justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-widest text-zinc-500">Design Score</span>
              <div className="score-pop mt-1 text-5xl font-semibold tracking-tighter text-white">{score}%</div>
            </div>
            <div className={`rounded-2xl border px-3 py-2 text-xs font-semibold ${status}`}>
              {score >= 85 ? 'Premium' : score >= 60 ? 'At Risk' : 'Critical'}
            </div>
          </div>

          <div className="space-y-3">
            {(Object.keys(metrics) as Array<keyof TasteMetrics>).map((key) => (
              <div key={key}>
                <div className="mb-1.5 flex justify-between text-[11px] text-zinc-400">
                  <span>{labels[key]}</span>
                  <span>{metrics[key]}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
                  <div className={`h-full ${barColors[key]} transition-all duration-700`} style={{ width: `${metrics[key]}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 max-h-64 space-y-3 overflow-auto rounded-2xl border border-white/5 bg-black/30 p-3">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500">Explainable AI Review</span>
            {findings.length > 0 ? (
              findings.map((finding, index) => (
                <article key={`${finding.title}-${index}`} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold text-zinc-100">{finding.title}</h4>
                    <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[10px] uppercase text-zinc-400">{finding.severity}</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-zinc-400">{finding.reason}</p>
                  <p className="mt-2 text-[11px] leading-relaxed text-emerald-300">Suggestion: {finding.suggestion}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">Impact: {finding.impact}</p>
                </article>
              ))
            ) : (
              <p className="text-xs italic text-zinc-400">Excellent. No obvious design issues were detected.</p>
            )}
          </div>

          {score < 90 && onFix && (
            <button type="button" onClick={onFix} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3 text-xs font-semibold text-zinc-950 shadow-lg shadow-white/5 transition hover:bg-zinc-200 active:scale-[0.99]">
              <Wand2 className="h-4 w-4" /> Improve Design with AI
            </button>
          )}
        </section>
      )}

      <button type="button" onClick={onToggle} className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold tracking-wide shadow-xl backdrop-blur-md transition hover:scale-105 active:scale-95 ${status}`}>
        <span className={`h-2 w-2 animate-pulse rounded-full ${dot}`} />
        TASTE ENGINE {score}%
      </button>
    </div>
  );
}
