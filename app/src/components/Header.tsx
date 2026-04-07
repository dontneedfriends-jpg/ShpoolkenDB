import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from '../i18n'
import { useTheme } from '../hooks/useTheme'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const { t, lang, setLang } = useTranslation()
  const { dark, toggle } = useTheme()
  const location = useLocation()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7c-2 0-3 1-3 3z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M12 9v6" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              ShpoolkenDB
            </span>
          </Link>

          <nav className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <Link
              to="/"
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                location.pathname === '/'
                  ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {t.nav.catalog}
            </Link>
            <Link
              to="/add"
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                location.pathname === '/add'
                  ? 'bg-white dark:bg-gray-700 text-violet-600 dark:text-violet-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {t.nav.add}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher lang={lang} setLang={setLang} />
            <button
              onClick={toggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={dark ? t.theme.light : t.theme.dark}
            >
              {dark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
