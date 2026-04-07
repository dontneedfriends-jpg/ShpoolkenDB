import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { en } from './en'
import { ru } from './ru'

export type Language = 'ru' | 'en'

const translations: Record<Language, typeof en> = { en, ru }

interface I18nContextType {
  lang: Language
  setLang: (lang: Language) => void
  t: typeof en
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('shpoolken-lang')
    return (saved === 'ru' || saved === 'en') ? saved : 'ru'
  })

  const setLang = useCallback((l: Language) => {
    setLangState(l)
    localStorage.setItem('shpoolken-lang', l)
  }, [])

  const t = translations[lang]

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useTranslation() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider')
  return ctx
}
