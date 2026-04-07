import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

interface ThemeContextType {
  dark: boolean
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('shpoolken-theme')
    if (saved === 'dark' || saved === 'light') return saved === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('shpoolken-theme', dark ? 'dark' : 'light')
  }, [dark])

  const toggle = useCallback(() => setDark(d => !d), [])

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
