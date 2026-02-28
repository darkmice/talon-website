import zh from './zh';
import en from './en';

const translations: Record<string, typeof zh> = { zh, en };

export type Locale = 'zh' | 'en';
export type TranslationKeys = typeof zh;

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function getTranslations(locale: string): TranslationKeys {
  return translations[locale] ?? translations.zh;
}

export function getLocaleFromUrl(url: URL): Locale {
  const pathname = url.pathname.replace(base, '');
  const [, locale] = pathname.split('/');
  if (locale === 'en') return 'en';
  return 'zh';
}

export function getLocalizedPath(path: string, locale: Locale): string {
  if (locale === 'zh') return `${base}${path}`;
  return `${base}/en${path}`;
}

export function getAltPath(url: URL, locale: Locale): string {
  const pathname = url.pathname.replace(base, '');
  if (locale === 'zh') return `${base}/en${pathname}`;
  return `${base}${pathname.replace(/^\/en/, '') || '/'}`;
}

const DOCS_SITE = 'https://darkmice.github.io/talon-docs';

export function getDocsUrl(path: string, locale: Locale): string {
  const prefix = locale === 'zh' ? '/zh' : '';
  return `${DOCS_SITE}${prefix}${path}`;
}
