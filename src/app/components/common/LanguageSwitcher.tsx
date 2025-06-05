'use client'

import React from 'react';
import { useLocale } from '../../contexts/LocaleContext';
import { Locale } from '../../lib/i18n';
import { Globe, Check, Loader2 } from 'lucide-react';

export default function LanguageSwitcher() {
  const {
    locale,
    setLocale,
    isTransitioning,
    availableLocales,
    getLocaleDisplayName
  } = useLocale();

  const languageFlags: Record<Locale, string> = {
    en: '🇺🇸',
    de: '🇩🇪'
  };

  return (
    <div className="relative group">
      <button
        className="flex items-center space-x-2 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-200 font-medium"
        aria-label="Language switcher"
        disabled={isTransitioning}
      >
        {isTransitioning ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Globe className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">
          {languageFlags[locale]} {getLocaleDisplayName(locale)}
        </span>
        <span className="sm:hidden">{languageFlags[locale]}</span>
      </button>
      
      <div className="absolute top-full right-0 mt-2 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {availableLocales.map((lang: Locale) => (
          <button
            key={lang}
            onClick={() => setLocale(lang)}
            disabled={isTransitioning}
            className={`w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 first:rounded-t-lg last:rounded-b-lg transition-colors duration-200 flex items-center justify-between ${
              locale === lang ? 'bg-slate-100 dark:bg-slate-700 font-medium' : ''
            } ${isTransitioning ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={`Switch to ${getLocaleDisplayName(lang)}`}
          >
            <div className="flex items-center space-x-2">
              <span>{languageFlags[lang]}</span>
              <span className="text-sm">{getLocaleDisplayName(lang)}</span>
            </div>
            {locale === lang && (
              <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}