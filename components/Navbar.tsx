'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, Github, SearchIcon } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { MobileSidebar } from './MobileSidebar'
import { Search } from "./Search";

const links = [
  { href: '/docs',            label: 'Docs' },
  { href: '/docs/signals',    label: 'Signals' },
  { href: '/docs/adapters/redis', label: 'Redis' },
  { href: '/docs/api-reference',  label: 'API' },
  { href: '/ecosystem',       label: 'Ecosystem' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b"
        style={{
          background: "var(--background)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-[1400px] mx-auto flex h-16 items-center gap-4 px-4 lg:px-6">
          <button
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group flex-shrink-0"
          >
            <div
              className="w-9 h-9 rounded-xl flex flex-col items-center justify-center border-2 transition-all group-hover:shadow-lg"
              style={{
                borderColor: "var(--primary)",
                background: "oklch(0.488 0.243 264.376 / 0.12)",
              }}
            >
              <span
                className="text-[10px] font-black leading-none"
                style={{
                  color: "var(--primary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                As
              </span>
              <span
                className="text-[7px] leading-none opacity-50"
                style={{
                  color: "var(--primary)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                33
              </span>
            </div>
            <div>
              <div
                className="text-[10px] leading-none opacity-50"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--primary)",
                }}
              >
                @periodic/
              </div>
              <div
                className="text-[15px] font-bold leading-none tracking-tight"
                style={{ fontFamily: "var(--font-display)" }}
              >
                arsenic
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3.5 py-2 rounded-lg text-sm font-medium transition-colors text-muted-foreground hover:text-foreground hover:bg-accent"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-2">
            <Search />
            <a
              href="https://github.com/udaythakur7469/periodic-arsenic"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-[18px] w-[18px]" />
            </a>
            <ThemeToggle />
            <Link
              href="/docs/quickstart"
              className="hidden sm:flex items-center gap-1.5 h-9 px-4 rounded-lg text-sm font-semibold transition-all hover:opacity-90"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <MobileSidebar open={open} onClose={() => setOpen(false)} />
    </>
  );
}
