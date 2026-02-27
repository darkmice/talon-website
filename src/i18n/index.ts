import zh from './zh';
import en from './en';

const translations: Record<string, typeof zh> = { zh, en };

export type Locale = 'zh' | 'en';
export type TranslationKeys = typeof zh;

export function getTranslations(locale: string): TranslationKeys {
  return translations[locale] ?? translations.zh;
}

export function getLocaleFromUrl(url: URL): Locale {
  const [, locale] = url.pathname.split('/');
  if (locale === 'en') return 'en';
  return 'zh';
}

export function getLocalizedPath(path: string, locale: Locale): string {
  if (locale === 'zh') return path;
  return `/en${path}`;
}
