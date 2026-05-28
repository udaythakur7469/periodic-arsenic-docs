'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { navigation } from '@/lib/navigation'
import { cn } from '@/lib/utils'

interface Props { open: boolean; onClose: () => void }

export function MobileSidebar({ open, onClose }: Props) {
  const pathname = usePathname()
  useEffect(() => { onClose() }, [pathname]) // eslint-disable-line
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'oklch(0 0 0 / 0.5)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
      )}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 lg:hidden shadow-2xl transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ background: 'var(--card)', borderRight: '1px solid var(--border)' }}
        role="dialog" aria-modal="true"
      >
        <div className="flex items-center justify-between h-16 px-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="font-mono text-sm font-semibold" style={{ color: 'var(--primary)', fontFamily: 'var(--font-mono)' }}>@periodic/arsenic</span>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-border hover:bg-accent transition-colors"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-1 overflow-y-auto h-[calc(100%-4rem)]">
          {navigation.map((group, gi) => (
            <div key={group.section} className={gi > 0 ? 'mt-4' : ''}>
              <p className="px-3 py-1 text-[11px] font-bold uppercase tracking-widest mb-0.5" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }}>
                {group.section}
              </p>
              {group.items.map(item => {
                const active = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center justify-between px-3 py-2 rounded-lg text-[0.9375rem] transition-all',
                      active ? 'nav-active' : ''
                    )}
                    style={!active ? { color: 'var(--foreground)', opacity: 0.7 } : {}}
                    aria-current={active ? 'page' : undefined}
                  >
                    {item.label}
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: 'oklch(0.488 0.243 264.376 / 0.12)', color: 'var(--primary)' }}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>
      </div>
    </>
  )
}
