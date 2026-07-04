export interface MagicSwapResult {
  code: string;
  changes: string[];
}

export function createMagicSwap(code: string): MagicSwapResult {
  const improvedButton = `<button className="bg-zinc-900 text-zinc-100 hover:bg-zinc-800 active:scale-[0.98] border border-white/10 px-6 py-3 rounded-xl transition-all duration-200 shadow-xl shadow-black/40 font-medium text-sm tracking-wide">
  Explore Dashboard
</button>`;

  const changes = [
    'bg-yellow-400 yerine koyu premium yüzey için bg-zinc-900 kullanıldı.',
    'Dar px-4 py-2 spacing, daha rahat px-6 py-3 touch target ile değiştirildi.',
    'rounded yerine rounded-xl, shadow-lg yerine shadow-black/40 ile kontrollü derinlik verildi.',
    'hover, active ve duration sınıfları eklenerek mikro etkileşim güçlendirildi.',
    'font-medium text-sm tracking-wide ile CTA tipografisi netleştirildi.',
  ];

  if (code.includes('<button')) {
    return { code: improvedButton, changes };
  }

  return {
    code: `${code}

{/* Taste Engine premium CTA önerisi */}
${improvedButton}`,
    changes: ['Mevcut koda premium CTA önerisi eklendi.', ...changes],
  };
}
