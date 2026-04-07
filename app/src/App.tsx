import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { I18nProvider } from './i18n'
import { ThemeProvider } from './hooks/useTheme'
import Header from './components/Header'
import FilamentCatalog from './components/FilamentCatalog'
import AddFilamentForm from './components/AddFilamentForm'

function App() {
  return (
    <ThemeProvider>
      <I18nProvider>
        <BrowserRouter basename="/ShpoolkenDB">
          <Header />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<FilamentCatalog />} />
              <Route path="/add" element={<AddFilamentForm />} />
            </Routes>
          </main>
          <footer className="border-t border-gray-200 dark:border-gray-800 py-6 mt-auto">
            <p className="text-center text-sm text-gray-400 dark:text-gray-500">
              ShpoolkenDB &copy; 2026
            </p>
          </footer>
        </BrowserRouter>
      </I18nProvider>
    </ThemeProvider>
  )
}

export default App
