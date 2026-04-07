import { useTranslation } from '../i18n'
import type { Language } from '../i18n'

interface Props {
  lang: Language
  setLang: (lang: Language) => void
}

export default function LanguageSwitcher({ lang, setLang }: Props) {
  const { t } = useTranslation()

  return (
    <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
      <button
        onClick={() => setLang('ru')}
        className={`px-3 py-1.5 text-sm font-medium transition-colors ${
          lang === 'ru'
            ? 'bg-violet-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        {t.lang.ru}
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-3 py-1.5 text-sm font-medium transition-colors ${
          lang === 'en'
            ? 'bg-violet-600 text-white'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
      >
        {t.lang.en}
      </button>
    </div>
  )
}
