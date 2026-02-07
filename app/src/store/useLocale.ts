import { create } from 'zustand'
import { en, type Translations } from '../locales/en'
import { uk } from '../locales/uk'

type Locale = 'en' | 'uk'

const STORAGE_KEY = 'retrostamp-lang'

const translations: Record<Locale, Translations> = { en, uk }

function detectLocale(): Locale {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'en' || saved === 'uk') return saved
  
  const browserLang = navigator.language.toLowerCase()
  if (browserLang.startsWith('uk') || browserLang.startsWith('ru')) return 'uk'
  return 'en'
}

interface LocaleState {
  locale: Locale
  t: Translations
  setLocale: (locale: Locale) => void
}

export const useLocale = create<LocaleState>((set) => {
  const initial = detectLocale()
  return {
    locale: initial,
    t: translations[initial],
    setLocale: (locale) => {
      localStorage.setItem(STORAGE_KEY, locale)
      set({ locale, t: translations[locale] })
    },
  }
})
