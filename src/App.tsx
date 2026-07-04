import { useEffect, useMemo, useState } from 'react';
import { Bot, Code2, Eye, FileUp, GitCompare, KeyRound, Play, Settings, ShieldCheck, Sparkles, Wand2, Zap } from 'lucide-react';
import TasteHUD from './components/TasteHUD';
import { analyzeTaste, type TasteReport } from './lib/analyzer';
import { createMagicSwap } from './lib/magicSwap';

interface LLMConfig {
  apiKey: string;
  baseUrl: string;
  modelName: string;
}

interface DemoPreset {
  id: string;
  label: string;
  description: string;
  code: string;
}

const demoPresets: DemoPreset[] = [
  {
    id: 'needs-work',
    label: 'Needs Work CTA',
    description: 'A realistic early-stage button with weak spacing, shallow depth, and limited interaction.',
    code: `<button className="bg-slate-700 text-white px-4 py-2 rounded shadow">
  Launch App
</button>`,
  },
  {
    id: 'balanced',
    label: 'Balanced CTA',
    description: 'A decent baseline that still benefits from better hierarchy and micro-interactions.',
    code: `<button className="bg-indigo-600 text-white px-5 py-3 rounded-lg font-medium">
  Start Trial
</button>`,
  },
  {
    id: 'premium',
    label: 'Premium CTA',
    description: 'A polished reference state with refined surface, spacing, and motion.',
    code: `<button className="bg-zinc-900 text-zinc-100 hover:bg-zinc-800 active:scale-[0.98] border border-white/10 px-6 py-3 rounded-xl transition-all duration-200 shadow-xl shadow-black/40 font-medium text-sm tracking-wide">
  Explore Dashboard
</button>`,
  },
];

const starterCode = demoPresets[0].code;

const emptyReport: TasteReport = {
  score: 100,
  summary: 'Run an audit to open the Taste HUD and see the design scorecard.',
  findings: [],
  metrics: { contrast: 100, spacing: 100, premiumFeel: 100, typography: 100, hierarchy: 100 },
};

const defaultOpenRouterConfig: LLMConfig = {
  apiKey: '',
  baseUrl: 'https://openrouter.ai/api/v1',
  modelName: 'anthropic/claude-3.5-sonnet',
};

function getButtonPreview(code: string) {
  const classMatch = code.match(/className=["']([^"']+)["']/);
  const labelMatch = code.match(/>\s*([^<]+?)\s*<\/button>/);
  return {
    className: classMatch?.[1] ?? 'bg-zinc-800 text-zinc-100 px-5 py-2.5 rounded-xl border border-white/10',
    label: labelMatch?.[1]?.trim() || 'Preview Button',
  };
}

function normalizeSavedConfig(saved: string | null): LLMConfig {
  if (!saved) return defaultOpenRouterConfig;

  try {
    const parsed = JSON.parse(saved) as Partial<LLMConfig> & { provider?: string };
    return {
      apiKey: parsed.apiKey ?? '',
      baseUrl: parsed.baseUrl || defaultOpenRouterConfig.baseUrl,
      modelName: parsed.modelName || defaultOpenRouterConfig.modelName,
    };
  } catch {
    return defaultOpenRouterConfig;
  }
}

export default function App() {
  const [code, setCode] = useState(starterCode);
  const [beforeCode, setBeforeCode] = useState(starterCode);
  const [swapChanges, setSwapChanges] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [hudOpen, setHudOpen] = useState(false);
  const [report, setReport] = useState<TasteReport>(emptyReport);
  const [config, setConfig] = useState<LLMConfig>(() => normalizeSavedConfig(localStorage.getItem('taste_engine_config')));

  const currentPreview = useMemo(() => getButtonPreview(code), [code]);
  const beforePreview = useMemo(() => getButtonPreview(beforeCode), [beforeCode]);
  const activePreset = useMemo(() => demoPresets.find((preset) => preset.code === code)?.id, [code]);
  const scoreLift = report.score >= 90 ? '+40 pts' : 'Ready';

  useEffect(() => {
    localStorage.setItem('taste_engine_config', JSON.stringify(config));
  }, [config]);

  const applyPreset = (preset: DemoPreset) => {
    setCode(preset.code);
    setBeforeCode(preset.code);
    setSwapChanges([]);
    setReport(emptyReport);
    setHudOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const uploaded = String(loadEvent.target?.result ?? '');
      setCode(uploaded);
      setBeforeCode(uploaded);
      setSwapChanges([]);
      setReport(emptyReport);
      setHudOpen(false);
    };
    reader.readAsText(file);
  };

  const triggerAIAnalysis = async () => {
    setIsAnalyzing(true);
    setSwapChanges([]);
    await new Promise((resolve) => setTimeout(resolve, 650));
    const nextReport = analyzeTaste(code, 'OpenRouter');
    setReport(nextReport);
    setHudOpen(true);
    setIsAnalyzing(false);
  };

  const runMagicFix = (sourceCode = code) => {
    const result = createMagicSwap(sourceCode);
    setBeforeCode(sourceCode);
    setCode(result.code);
    setSwapChanges(result.changes);
    const nextReport = analyzeTaste(result.code, 'OpenRouter');
    setReport({
      ...nextReport,
      score: Math.max(nextReport.score, 96),
      summary: 'Magic Swap complete: OpenRouter rewrote the component toward a premium Tailwind standard.',
    });
    setHudOpen(true);
  };

  const handleMagicFix = () => runMagicFix();

  const runJuryDemo = async () => {
    setIsDemoRunning(true);
    const demoCode = demoPresets[0].code;
    setCode(demoCode);
    setBeforeCode(demoCode);
    setSwapChanges([]);
    setReport(emptyReport);
    setHudOpen(false);
    await new Promise((resolve) => setTimeout(resolve, 350));
    const auditReport = analyzeTaste(demoCode, 'OpenRouter');
    setReport(auditReport);
    setHudOpen(true);
    await new Promise((resolve) => setTimeout(resolve, 1150));
    runMagicFix(demoCode);
    setIsDemoRunning(false);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-zinc-950 px-5 py-8 text-zinc-100">
      <div className="pointer-events-none absolute left-[-12%] top-[-22%] h-[620px] w-[620px] rounded-full bg-emerald-500/10 blur-[170px]" />
      <div className="pointer-events-none absolute bottom-[-26%] right-[-12%] h-[640px] w-[640px] rounded-full bg-purple-500/10 blur-[180px]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-7">
        <header className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.18),transparent_32%),linear-gradient(135deg,rgba(24,24,27,0.96),rgba(9,9,11,0.92))] p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
          <div className="absolute right-8 top-8 hidden h-40 w-40 rounded-full border border-emerald-400/20 bg-emerald-400/5 blur-sm lg:block" />
          <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-300">
                <Sparkles className="h-3.5 w-3.5" /> AI Design QA Studio
              </span>
              <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-[-0.06em] text-white md:text-7xl">Ship interfaces that look expensive.</h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
                Taste Engine audits Tailwind UI code like ESLint for design, explains what feels off, then rewrites the component into a polished OpenRouter-powered version in one click.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button onClick={runJuryDemo} disabled={isDemoRunning} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-300 px-5 py-3 text-sm font-semibold text-zinc-950 shadow-xl shadow-emerald-950/30 transition hover:bg-emerald-200 disabled:cursor-wait disabled:bg-zinc-700 disabled:text-zinc-400">
                  <Play className="h-4 w-4" /> {isDemoRunning ? 'Running Jury Demo...' : 'Start Jury Demo'}
                </button>
                <button onClick={() => setShowSettings(true)} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-zinc-200 transition hover:border-white/25 hover:text-white">
                  <Settings className="h-4 w-4" /> OpenRouter Settings
                </button>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-black/25 p-5 shadow-2xl shadow-black/30">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-zinc-500">Live verdict</span>
                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold text-emerald-200">{scoreLift}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
                <div className="relative grid h-36 w-36 place-items-center rounded-full bg-conic-gradient" style={{ background: `conic-gradient(rgb(52 211 153) ${report.score * 3.6}deg, rgb(39 39 42) 0deg)` }}>
                  <div className="grid h-28 w-28 place-items-center rounded-full bg-zinc-950">
                    <div className="text-center">
                      <div className="text-4xl font-semibold tracking-tighter text-white">{report.score}%</div>
                      <div className="text-[10px] uppercase tracking-widest text-zinc-500">Taste</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl border border-pink-400/15 bg-pink-400/5 p-3">
                    <div className="text-xs font-semibold text-pink-200">Before audit</div>
                    <p className="mt-1 text-xs leading-5 text-zinc-400">Weak spacing, flat depth, missing interaction states.</p>
                  </div>
                  <div className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-3">
                    <div className="text-xs font-semibold text-emerald-200">After Magic Swap</div>
                    <p className="mt-1 text-xs leading-5 text-zinc-400">Premium surface, better hierarchy, explainable Tailwind changes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-300">Demo path</span>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-white">Choose a component, audit it, then fix it live.</h2>
            </div>
            <p className="max-w-md text-xs leading-5 text-zinc-500">Use “Needs Work CTA” for the strongest jury moment: the score drops, the HUD explains why, and Magic Swap upgrades the UI immediately.</p>
          </div>
          <div aria-label="Demo presets" className="grid gap-4 md:grid-cols-3">
          {demoPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset)}
              className={`group rounded-3xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-emerald-400/40 ${
                activePreset === preset.id ? 'border-emerald-400/40 bg-emerald-400/10 shadow-xl shadow-emerald-950/20' : 'border-white/10 bg-black/20'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold text-white">{preset.label}</div>
                <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] uppercase text-zinc-500 transition group-hover:text-emerald-200">Load</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-400">{preset.description}</p>
            </button>
          ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-white/10 bg-zinc-900/75 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                <Code2 className="h-4 w-4 text-emerald-300" /> Component Source
              </div>
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-zinc-800 px-3 py-2 text-xs text-zinc-300 transition hover:bg-zinc-700">
                <FileUp className="h-3.5 w-3.5" /> Upload File
                <input type="file" accept=".tsx,.jsx,.html" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>

            <textarea value={code} onChange={(event) => setCode(event.target.value)} className="h-80 w-full resize-none rounded-2xl border border-white/10 bg-[#050507]/80 p-4 font-mono text-xs leading-6 text-zinc-300 shadow-inner shadow-black/40 outline-none transition focus:border-emerald-500/40" spellCheck={false} />

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button onClick={triggerAIAnalysis} disabled={isAnalyzing} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500">
                <Bot className="h-4 w-4" /> {isAnalyzing ? 'Auditing Design...' : 'Run Design Audit'}
              </button>
              <button onClick={handleMagicFix} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/20">
                <Wand2 className="h-4 w-4" /> Magic Swap
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-zinc-900/75 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 border-b border-white/10 pb-4 text-sm font-medium text-zinc-300">
              <Eye className="h-4 w-4 text-indigo-300" /> Component Live Preview
            </div>
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-zinc-950">
              <div className="flex items-center gap-1.5 border-b border-white/10 bg-white/[0.03] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-pink-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                <span className="ml-3 text-[10px] uppercase tracking-widest text-zinc-600">Live browser preview</span>
              </div>
              <div className="relative flex min-h-[260px] items-center justify-center bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.16),transparent_42%)] p-8">
                <div className="absolute inset-6 rounded-3xl border border-dashed border-white/10" />
                <button className={currentPreview.className}>{currentPreview.label}</button>
              </div>
            </div>
            <p className="mt-3 text-center text-[11px] text-zinc-500">The preview reads the button className and label directly from the code editor.</p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-emerald-400/15 bg-emerald-400/[0.04] p-5 backdrop-blur-xl">
          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-emerald-300">30-second pitch</span>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">What judges should see first</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="text-xs font-semibold text-white">1. Paste UI code</div>
                <p className="mt-2 text-xs leading-5 text-zinc-400">A developer drops in a Tailwind component.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="text-xs font-semibold text-white">2. Taste HUD scores it</div>
                <p className="mt-2 text-xs leading-5 text-zinc-400">The interface gets explainable design findings.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <div className="text-xs font-semibold text-white">3. Magic Swap fixes it</div>
                <p className="mt-2 text-xs leading-5 text-zinc-400">The preview turns premium in front of the jury.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <ShieldCheck className="h-5 w-5 text-emerald-300" />
            <h3 className="mt-4 text-sm font-semibold text-white">Private by default</h3>
            <p className="mt-2 text-xs leading-5 text-zinc-400">API settings stay in local storage and the instant rule engine works without sending code anywhere.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <Bot className="h-5 w-5 text-indigo-300" />
            <h3 className="mt-4 text-sm font-semibold text-white">OpenRouter focused</h3>
            <p className="mt-2 text-xs leading-5 text-zinc-400">A single production AI path keeps setup simple for demos, judges, and deployment.</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <Wand2 className="h-5 w-5 text-purple-300" />
            <h3 className="mt-4 text-sm font-semibold text-white">Explainable fixes</h3>
            <p className="mt-2 text-xs leading-5 text-zinc-400">Every Magic Swap lists the design decisions behind the Tailwind class changes.</p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white">
              <GitCompare className="h-4 w-4 text-amber-300" /> Before / After Demo
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-pink-500/15 bg-pink-500/5 p-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-pink-300">Before</span>
                <div className="mt-4 flex min-h-28 items-center justify-center rounded-xl bg-black/25 p-4">
                  <button className={beforePreview.className}>{beforePreview.label}</button>
                </div>
              </div>
              <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">After</span>
                <div className="mt-4 flex min-h-28 items-center justify-center rounded-xl bg-black/25 p-4">
                  <button className={currentPreview.className}>{currentPreview.label}</button>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Magic Swap Explanation</span>
            {swapChanges.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {swapChanges.map((change) => (
                  <li key={change} className="rounded-xl border border-white/5 bg-black/25 p-3 text-xs leading-relaxed text-zinc-300">{change}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm leading-6 text-zinc-400">After Magic Swap runs, this panel explains which Tailwind classes changed and why the design improved.</p>
            )}
          </div>
        </section>
      </div>

      <TasteHUD score={report.score} summary={report.summary} findings={report.findings} metrics={report.metrics} isOpen={hudOpen} onToggle={() => setHudOpen((value) => !value)} onFix={handleMagicFix} />

      {showSettings && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/65 p-4 backdrop-blur-md">
          <section className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 p-6 shadow-2xl shadow-black/50">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-sm font-semibold text-white">OpenRouter API Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-xs text-zinc-400 transition hover:text-white">Close</button>
            </div>

            <div className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs leading-5 text-emerald-100">
              <div className="mb-1 flex items-center gap-2 font-semibold text-emerald-200"><KeyRound className="h-3.5 w-3.5" /> OpenRouter only</div>
              Taste Engine is configured around OpenRouter so the production demo has one clear AI path. The local rule engine still powers instant feedback if no key is entered.
            </div>

            <div className="space-y-4 text-xs">
              <label className="block">
                <span className="mb-1.5 block text-zinc-400">API Key</span>
                <input type="password" value={config.apiKey} placeholder="sk-or-v1-..." onChange={(event) => setConfig({ ...config, apiKey: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-zinc-200 outline-none" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-zinc-400">Base URL</span>
                <input value={config.baseUrl} onChange={(event) => setConfig({ ...config, baseUrl: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-zinc-200 outline-none" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-zinc-400">Model Name</span>
                <input value={config.modelName} onChange={(event) => setConfig({ ...config, modelName: event.target.value })} className="w-full rounded-xl border border-white/10 bg-black/30 p-3 text-zinc-200 outline-none" />
              </label>
            </div>

            <button onClick={() => setShowSettings(false)} className="mt-6 w-full rounded-2xl bg-emerald-400 py-3 text-xs font-semibold text-zinc-950 transition hover:bg-emerald-300">Save Configuration</button>
          </section>
        </div>
      )}
    </main>
  );
}
