export interface MagicSwapResult {
  code: string;
  changes: string[];
}

export function createMagicSwap(code: string): MagicSwapResult {
  const improvedButton = `<button className="bg-zinc-900 text-zinc-100 hover:bg-zinc-800 active:scale-[0.98] border border-white/10 px-6 py-3 rounded-xl transition-all duration-200 shadow-xl shadow-black/40 font-medium text-sm tracking-wide">
  Explore Dashboard
</button>`;

  const changes = [
    'Replaced bg-yellow-400 with bg-zinc-900 for a more premium dark surface.',
    'Expanded tight px-4 py-2 spacing into a more comfortable px-6 py-3 target area.',
    'Upgraded rounded and shadow-lg into rounded-xl with a restrained shadow-black/40 depth system.',
    'Added hover, active, and duration classes to make the button feel interactive.',
    'Added font-medium text-sm tracking-wide to give the CTA stronger typographic intent.',
  ];

  if (code.includes('<button')) {
    return { code: improvedButton, changes };
  }

  return {
    code: `${code}

{/* Taste Engine premium CTA recommendation */}
${improvedButton}`,
    changes: ['Added a premium CTA recommendation to the existing code.', ...changes],
  };
}
