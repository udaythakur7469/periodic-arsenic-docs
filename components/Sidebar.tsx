'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { navigation } from '@/lib/navigation'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      className="hidden lg:flex flex-col fixed left-0 top-16 bottom-0 w-64 border-r overflow-y-auto"
      style={{ background: 'var(--sidebar)', borderColor: 'var(--sidebar-border)' }}
    >
      <nav className="flex flex-col p-4 pb-12 gap-1" aria-label="Documentation navigation">
        {navigation.map((group, gi) => (
          <div key={group.section} className={gi > 0 ? 'mt-5' : ''}>
            <p
              className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest mb-1"
              style={{ color: 'var(--muted-foreground)', opacity: 0.55 }}
            >
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
                  style={!active ? { color: 'var(--sidebar-foreground)', opacity: 0.75 } : {}}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className="flex items-center gap-2">
                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--primary)' }} />
                    )}
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                      style={{ background: 'oklch(0.488 0.243 264.376 / 0.12)', color: 'var(--primary)' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}
