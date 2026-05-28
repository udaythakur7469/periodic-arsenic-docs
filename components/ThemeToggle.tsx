'use client'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return (
    <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors" aria-label="Toggle theme">
      <Sun className="h-4.5 w-4.5 h-[18px] w-[18px]" />
    </button>
  )

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="h-9 w-9 flex items-center justify-center rounded-lg border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark'
        ? <Sun  className="h-[18px] w-[18px] text-amber-400" />
        : <Moon className="h-[18px] w-[18px] text-slate-500" />}
    </button>
  )
}
