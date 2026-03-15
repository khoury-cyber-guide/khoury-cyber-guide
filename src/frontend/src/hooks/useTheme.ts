import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { createElement } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue>({ theme: 'dark', toggle: () => {} })

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      return (localStorage.getItem('theme') as Theme) ?? 'dark'
    } catch {
      return 'dark'
    }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    try {
      localStorage.setItem('theme', theme)
    } catch {}
  }, [theme])

  return createElement(
    ThemeContext.Provider,
    { value: { theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) } },
    children,
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
