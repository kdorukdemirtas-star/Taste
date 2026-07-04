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

export function analyzeTaste(code: string, provider: string): TasteReport {
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
      title: 'Ham ve fazla doygun vurgu rengi',
      reason: 'Parlak sarı/turuncu tonları koyu premium yüzeylerde ucuz alarm hissi oluşturur.',
      suggestion: 'Daha kontrollü zinc, emerald veya indigo tonlarını border ve subtle shadow ile kullan.',
      impact: 'Görsel kalite yükselir, ürün daha sofistike görünür.',
      severity: 'high',
    });
  }

  if (hasAny(normalized, ['text-black', 'text-white']) && hasAny(normalized, ['bg-yellow', 'bg-lime', 'bg-orange'])) {
    metrics.contrast -= 18;
    findings.push({
      category: 'contrast',
      title: 'Kontrast bağlamı kontrolsüz',
      reason: 'Sert siyah/beyaz metin parlak arka planla birleşince göz yorar ve temaya yabancılaşır.',
      suggestion: 'Metin rengini yüzey paletine yaklaştır; örneğin text-zinc-100 veya text-zinc-950 kontrollü kullanılmalı.',
      impact: 'Okunabilirlik ve erişilebilirlik algısı güçlenir.',
      severity: 'medium',
    });
  }

  if (!hasAny(normalized, ['px-5', 'px-6', 'px-7', 'px-8']) || !hasAny(normalized, ['py-3', 'py-3.5', 'py-4'])) {
    metrics.spacing -= 24;
    findings.push({
      category: 'spacing',
      title: 'Buton nefes alanına ihtiyaç duyuyor',
      reason: 'Dar padding değerleri bileşeni demo/prototip seviyesinde bırakır.',
      suggestion: 'Ana aksiyonlar için px-6 py-3 civarında daha rahat bir touch target kullan.',
      impact: 'Tıklanabilirlik ve modern ürün hissi artar.',
      severity: 'medium',
    });
  }

  if (!hasAny(normalized, ['rounded-xl', 'rounded-2xl', 'rounded-full'])) {
    metrics.premiumFeel -= 12;
    metrics.hierarchy -= 8;
    findings.push({
      category: 'premiumFeel',
      title: 'Köşe yarıçapı modern sistemle uyumsuz',
      reason: 'Sadece rounded kullanımı güncel dashboard ve SaaS bileşenlerinde zayıf kalır.',
      suggestion: 'rounded-xl veya rounded-2xl ile daha bilinçli bir yüzey dili kur.',
      impact: 'Bileşen daha güncel ve sistematik görünür.',
      severity: 'low',
    });
  }

  if (!hasAny(normalized, ['transition', 'duration-', 'hover:', 'active:'])) {
    metrics.hierarchy -= 18;
    metrics.premiumFeel -= 14;
    findings.push({
      category: 'hierarchy',
      title: 'Mikro etkileşim eksik',
      reason: 'Hover ve transition yoksa kullanıcı bileşenin canlı bir sistem parçası olduğunu hissetmez.',
      suggestion: 'hover, active ve duration sınıflarıyla etkileşimi görünür kıl.',
      impact: 'Arayüz daha dokunsal ve premium hissedilir.',
      severity: 'medium',
    });
  }

  if (!hasAny(normalized, ['font-medium', 'font-semibold', 'tracking-', 'text-sm'])) {
    metrics.typography -= 18;
    findings.push({
      category: 'typography',
      title: 'Tipografik niyet belirsiz',
      reason: 'Font ağırlığı ve boyut net değilse CTA hiyerarşisi zayıflar.',
      suggestion: 'font-medium text-sm ve gerektiğinde tracking-wide kullan.',
      impact: 'Metin daha kasıtlı ve ürün standardına yakın görünür.',
      severity: 'medium',
    });
  }

  if (!hasAny(normalized, ['border', 'ring-', 'shadow-black', 'shadow-xl', 'backdrop-blur'])) {
    metrics.hierarchy -= 12;
    metrics.premiumFeel -= 12;
    findings.push({
      category: 'hierarchy',
      title: 'Katman derinliği zayıf',
      reason: 'Premium koyu temalarda yüzeyi ayırmak için border, ring veya kontrollü gölge gerekir.',
      suggestion: 'border-white/10 ve shadow-black/40 gibi düşük opaklıklı derinlik kullan.',
      impact: 'Bileşen arka plandan ayrılır ve daha pahalı görünür.',
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
        ? `${provider.toUpperCase()} destekli Taste Engine ${findings.length} tasarım riski buldu.`
        : `${provider.toUpperCase()} destekli Taste Engine belirgin risk bulmadı; bileşen premium standarda yakın.`,
  };
}
