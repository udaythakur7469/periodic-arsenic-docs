import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'

type Sev = 'critical' | 'warning' | 'info'

interface Props {
  name: string
  severity: Sev
  summary: string
  detail?: string
  causes?: string[]
  fixes?: string[]
  compact?: boolean
  showLink?: boolean
  href?: string
}

const leftBorder: Record<Sev, string> = {
  critical: 'border-l-red-500',
  warning:  'border-l-amber-500',
  info:     'border-l-blue-400',
}

const dot: Record<Sev, string> = {
  critical: 'bg-red-500 shadow-[0_0_8px_oklch(0.7_0.21_22)]',
  warning:  'bg-amber-400 shadow-[0_0_8px_oklch(0.8_0.18_80)]',
  info:     'bg-blue-400 shadow-[0_0_8px_oklch(0.7_0.15_260)]',
}

const badgeStyle: Record<Sev, string> = {
  critical: 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200/60 dark:border-red-900/50',
  warning:  'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/50',
  info:     'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/50',
}

const sevLabel: Record<Sev, string> = {
  critical: '🔴 Critical',
  warning:  '⚠️ Warning',
  info:     'ℹ️ Info',
}

export function SignalCard({ name, severity, summary, detail, causes, fixes, compact, showLink, href }: Props) {
  const content = (
    <div className={cn(
      'border border-l-4 rounded-r-xl bg-card shadow-sm',
      'hover:shadow-md transition-all duration-200 hover:translate-x-0.5',
      compact ? 'p-3.5' : 'p-5',
      'my-3',
      leftBorder[severity]
    )}>
      <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
        <div className="flex items-center gap-2.5">
          <span className={cn('w-2.5 h-2.5 rounded-full shrink-0 mt-0.5', dot[severity])} />
          <code
            className="text-sm font-semibold bg-muted px-2 py-0.5 rounded-md border text-foreground"
            style={{ fontFamily: 'var(--font-mono)' }}
          >
            {name}
          </code>
        </div>
        <span className={cn('text-xs font-semibold px-2.5 py-0.5 rounded-full border', badgeStyle[severity])}>
          {sevLabel[severity]}
        </span>
      </div>

      <p className="text-[0.9375rem] font-medium text-foreground mb-1">{summary}</p>

      {!compact && detail && (
        <p className="text-[0.9375rem] text-muted-foreground leading-relaxed">{detail}</p>
      )}

      {!compact && causes && causes.length > 0 && (
        <div className="mt-3.5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-2">Common Causes</p>
          <ul className="space-y-1.5">
            {causes.map((c, i) => (
              <li key={i} className="text-[0.9rem] text-muted-foreground flex gap-2">
                <span className="text-primary shrink-0 font-bold">—</span>{c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!compact && fixes && fixes.length > 0 && (
        <div className="mt-3.5">
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/50 mb-2">How to Fix</p>
          <ol className="space-y-1.5 list-none pl-0" style={{ counterReset: 'fc' }}>
            {fixes.map((f, i) => (
              <li key={i} className="text-[0.9rem] text-muted-foreground flex gap-2">
                <span className="text-primary font-mono shrink-0" style={{ fontFamily: 'var(--font-mono)' }}>{i + 1}.</span>{f}
              </li>
            ))}
          </ol>
        </div>
      )}

      {showLink && href && (
        <div className="mt-3 pt-3 border-t border-border/60 flex items-center gap-1 text-xs text-primary font-medium">
          View full documentation <ChevronRight className="h-3 w-3" />
        </div>
      )}
    </div>
  )

  if (showLink && href) {
    return <Link href={href}>{content}</Link>
  }
  return content
}
