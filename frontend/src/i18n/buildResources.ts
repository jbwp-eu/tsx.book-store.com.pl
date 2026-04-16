import type { Dictionary } from "@/dictionaries/dictionary";

function polishKeyForEnglish(enKey: string): string {
  const m = enKey.match(/^(.*)_(\d+)$/);
  if (m) {
    return `${m[1]}PL_${m[2]}`;
  }
  return `${enKey}PL`;
}

type CheckoutStep = { link: string; text: string; textPL: string };

export function dictionaryToI18nResources(dict: Dictionary) {
  const enCommon: Record<string, unknown> = {};
  const plCommon: Record<string, unknown> = {};

  for (const [section, entries] of Object.entries(dict)) {
    if (Array.isArray(entries)) {
      const steps = entries as CheckoutStep[];
      enCommon[section] = steps.map(({ link, text }) => ({ link, text }));
      plCommon[section] = steps.map(({ link, textPL }) => ({
        link,
        text: textPL,
      }));
      continue;
    }

    const enObj: Record<string, string> = {};
    const plObj: Record<string, string> = {};
    const obj = entries as Record<string, string>;

    for (const k of Object.keys(obj)) {
      if (k.endsWith("PL")) {
        continue;
      }
      const plK = polishKeyForEnglish(k);
      enObj[k] = obj[k];
      plObj[k] = obj[plK] ?? obj[k];
    }
    enCommon[section] = enObj;
    plCommon[section] = plObj;
  }

  return {
    en: { common: enCommon },
    pl: { common: plCommon },
  } as const;
}
