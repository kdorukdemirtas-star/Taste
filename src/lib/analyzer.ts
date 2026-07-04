export interface TasteMetrics {
  contrast: number;
  spacing: number;
  premiumFeel: number;
  typography: number;
  hierarchy: number;
}

export interface TasteFinding {
  category: keyof TasteMetrics;
  title: string;
  reason: string;
  suggestion: string;
  impact: string;
  severity: 'low' | 'medium' | 'high';
}

export interface TasteReport {
  score: number;
  metrics: TasteMetrics;
  findings: TasteFinding[];
  summary: string;
}

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
const hasAny = (code: string, tokens: string[]) => tokens.some((token) => code.includes(token));

export function analyzeTaste(code: string, provider = 'OpenRouter'): TasteReport {
  const findings: TasteFinding[] = [];
  const normalized = code.toLowerCase();
  const metrics: TasteMetrics = {
    contrast: 88,
    spacing: 84,
    premiumFeel: 82,
    typography: 80,
    hierarchy: 82,
  };

  if (hasAny(normalized, ['bg-yellow-400', 'bg-yellow-300', 'bg-lime-300', 'bg-orange-400'])) {
    metrics.contrast -= 30;
    metrics.premiumFeel -= 34;
    findings.push({
      category: 'premiumFeel',
      title: 'Over-saturated accent color',
      reason: 'Bright yellow or orange surfaces can feel noisy and cheap inside a dark premium interface.',
      suggestion: 'Use controlled zinc, emerald, or indigo surfaces with a subtle border and shadow system.',
      impact: 'The component feels calmer, more expensive, and more intentional.',
      severity: 'high',
    });
  }

  if (hasAny(normalized, ['text-black', 'text-white']) && hasAny(normalized, ['bg-yellow', 'bg-lime', 'bg-orange'])) {
    metrics.contrast -= 18;
    findings.push({
      category: 'contrast',
      title: 'Contrast context is too harsh',
      reason: 'Pure black or white text on a saturated background often creates eye strain and weakens theme consistency.',
      suggestion: 'Move the text color closer to the surface palette, such as text-zinc-100 or a controlled dark neutral.',
      impact: 'Readability improves while the visual system feels more coherent.',
      severity: 'medium',
    });
  }

  if (!hasAny(normalized, ['px-5', 'px-6', 'px-7', 'px-8']) || !hasAny(normalized, ['py-3', 'py-3.5', 'py-4'])) {
    metrics.spacing -= 24;
    findings.push({
      category: 'spacing',
      title: 'The call-to-action needs more breathing room',
      reason: 'Tight padding makes the component feel like a prototype instead of a polished product control.',
      suggestion: 'Use a more comfortable target area around px-6 py-3 for primary actions.',
      impact: 'The button becomes easier to scan, click, and trust.',
      severity: 'medium',
    });
  }

  if (!hasAny(normalized, ['rounded-xl', 'rounded-2xl', 'rounded-full'])) {
    metrics.premiumFeel -= 12;
    metrics.hierarchy -= 8;
    findings.push({
      category: 'premiumFeel',
      title: 'Corner radius feels under-designed',
      reason: 'A generic rounded class can look unfinished in modern SaaS and dashboard interfaces.',
      suggestion: 'Use rounded-xl or rounded-2xl to create a more deliberate surface language.',
      impact: 'The component reads as part of a modern design system.',
      severity: 'low',
    });
  }

  if (!hasAny(normalized, ['transition', 'duration-', 'hover:', 'active:'])) {
    metrics.hierarchy -= 18;
    metrics.premiumFeel -= 14;
    findings.push({
      category: 'hierarchy',
      title: 'Missing micro-interaction states',
      reason: 'Without hover, active, and transition states, the UI feels static instead of responsive.',
      suggestion: 'Add hover, active, and duration classes to make the action feel tactile.',
      impact: 'The interface feels more alive and product-grade.',
      severity: 'medium',
    });
  }

  if (!hasAny(normalized, ['font-medium', 'font-semibold', 'tracking-', 'text-sm'])) {
    metrics.typography -= 18;
    findings.push({
      category: 'typography',
      title: 'Typography lacks clear intent',
      reason: 'Without a clear size and weight, the CTA hierarchy becomes less confident.',
      suggestion: 'Use font-medium, text-sm, and tracking-wide when the button needs a premium CTA feel.',
      impact: 'The label becomes more deliberate and easier to recognize as a primary action.',
      severity: 'medium',
    });
  }

  if (!hasAny(normalized, ['border', 'ring-', 'shadow-black', 'shadow-xl', 'backdrop-blur'])) {
    metrics.hierarchy -= 12;
    metrics.premiumFeel -= 12;
    findings.push({
      category: 'hierarchy',
      title: 'Surface depth is too flat',
      reason: 'Premium dark UI needs subtle separation through borders, rings, or controlled shadows.',
      suggestion: 'Use classes like border-white/10 and shadow-black/40 to create restrained depth.',
      impact: 'The component separates from the background and feels more refined.',
      severity: 'low',
    });
  }

  const finalMetrics = Object.fromEntries(
    Object.entries(metrics).map(([key, value]) => [key, clamp(value)]),
  ) as unknown as TasteMetrics;

  const score = clamp(
    finalMetrics.contrast * 0.24 +
      finalMetrics.spacing * 0.2 +
      finalMetrics.premiumFeel * 0.28 +
      finalMetrics.typography * 0.13 +
      finalMetrics.hierarchy * 0.15,
  );

  return {
    score,
    metrics: finalMetrics,
    findings,
    summary:
      findings.length > 0
        ? `${provider} analysis found ${findings.length} design risk${findings.length === 1 ? '' : 's'}.`
        : `${provider} analysis found no obvious risks. This component is close to premium standard.`,
  };
}
