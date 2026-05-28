import { Info, AlertTriangle, AlertOctagon, Lightbulb } from 'lucide-react'
import { cn } from '@/lib/utils'

type CT = 'info' | 'warning' | 'danger' | 'tip'

const cfg = {
  tip:     { Icon: Lightbulb,     ring: 'border-l-blue-500',    wrap: 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/60 dark:border-blue-900/40',    icon: 'text-blue-600 dark:text-blue-400',    title: 'text-blue-700 dark:text-blue-300'   },
  info:    { Icon: Info,          ring: 'border-l-blue-400',    wrap: 'bg-slate-50/80 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-700/50', icon: 'text-slate-500 dark:text-slate-400',  title: 'text-slate-700 dark:text-slate-200' },
  warning: { Icon: AlertTriangle, ring: 'border-l-amber-500',   wrap: 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200/60 dark:border-amber-900/40', icon: 'text-amber-600 dark:text-amber-400',  title: 'text-amber-700 dark:text-amber-300' },
  danger:  { Icon: AlertOctagon,  ring: 'border-l-red-500',     wrap: 'bg-red-50/70 dark:bg-red-950/20 border-red-200/60 dark:border-red-900/40',         icon: 'text-red-600 dark:text-red-400',      title: 'text-red-700 dark:text-red-300'     },
} as const

export function Callout({ type, title, children }: { type: CT; title?: string; children: React.ReactNode }) {
  const c = cfg[type]
  return (
    <div className={cn('flex gap-3 rounded-r-xl border border-l-4 p-4 my-5 shadow-sm', c.wrap, c.ring)}>
      <c.Icon className={cn('h-4.5 w-4.5 shrink-0 mt-0.5 h-[18px] w-[18px]', c.icon)} />
      <div className="flex-1 min-w-0 text-[0.9375rem]">
        {title && <p className={cn('font-semibold mb-1 text-sm', c.title)}>{title}</p>}
        <div className="text-muted-foreground leading-relaxed [&_code]:font-mono [&_code]:text-xs [&_code]:bg-black/5 [&_code]:dark:bg-white/8 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded">
          {children}
        </div>
      </div>
    </div>
  )
}
