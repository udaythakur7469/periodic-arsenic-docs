'use client'

import { useState, useCallback } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  code: string
  language?: string
  filename?: string
  showLineNumbers?: boolean
}

/* Pure HTML-escape first, then apply token spans */
function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function highlight(raw: string, lang: string): string {
  const code = esc(raw)

  if (lang === 'bash' || lang === 'sh') {
    return code
      .split('\n')
      .map(line => {
        // comments
        if (/^\s*#/.test(line)) return `<span style="color:#6b7280;font-style:italic">${line}</span>`
        // $ prompt
        return line
          .replace(/^(\$\s)/, '<span style="color:#6b7280">$1</span>')
          .replace(/\b(npm|yarn|npx|pnpm|node)\b/g, '<span style="color:#93c5fd">$1</span>')
      })
      .join('\n')
  }

  if (lang === 'json') {
    return code
      .replace(/"([^"]+)"(\s*:)/g, '<span style="color:#93c5fd">"$1"</span>$2')
      .replace(/:\s*"([^"]*?)"/g, ': <span style="color:#86efac">"$1"</span>')
      .replace(/:\s*(true|false|null)\b/g, ': <span style="color:#f87171">$1</span>')
      .replace(/:\s*(-?\d+\.?\d*)/g, ': <span style="color:#fb923c">$1</span>')
  }

  /* TypeScript / JavaScript */
  // We'll do a multi-pass approach: protect strings first, then keywords, then restore
  const strings: string[] = []
  let c = code

  // Protect template literals
  c = c.replace(/`[^`]*`/g, m => { strings.push(m); return `\x00s${strings.length - 1}\x00` })
  // Protect single-quoted strings
  c = c.replace(/'[^'\n]*'/g, m => { strings.push(m); return `\x00s${strings.length - 1}\x00` })
  // Protect double-quoted strings
  c = c.replace(/"[^"\n]*"/g, m => { strings.push(m); return `\x00s${strings.length - 1}\x00` })

  // Comments
  c = c.replace(/(\/\/[^\n]*)/g, '<span style="color:#6b7280;font-style:italic">$1</span>')
  c = c.replace(/(\/\*[\s\S]*?\*\/)/g, '<span style="color:#6b7280;font-style:italic">$1</span>')

  // Keywords
  c = c.replace(/\b(import|export|from|default|const|let|var|function|async|await|return|if|else|switch|case|break|new|class|interface|type|extends|implements|void|string|number|boolean|null|true|false|for|of|in|throw|try|catch|finally|typeof|keyof|readonly|enum)\b/g,
    '<span style="color:#c084fc">$1</span>')

  // Known API names
  c = c.replace(/\b(createMonitor|mongooseAdapter|prismaAdapter|pgAdapter|redisAdapter|expressContext|fastifyContext|createOtelExporter|getRedisCommandInfo|SignalSeverity|SLOW_REDIS_COMMANDS|REDIS_COMMAND_INFO|ForgeEvent|ForgeSignal|Exporter|MonitorConfig)\b/g,
    '<span style="color:#60a5fa">$1</span>')

  // Numbers
  c = c.replace(/\b(\d+)\b/g, '<span style="color:#fb923c">$1</span>')

  // Restore strings
  c = c.replace(/\x00s(\d+)\x00/g, (_, i) => {
    const s = strings[parseInt(i)]
    return `<span style="color:#86efac">${s}</span>`
  })

  return c
}

export function CodeBlock({ code, language = 'typescript', filename, showLineNumbers = false }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [code])

  const highlighted = highlight(code, language)
  const lines = highlighted.split('\n')

  return (
    <div className="my-5 rounded-xl overflow-hidden border border-zinc-800 bg-[#0d1117] shadow-2xl">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28ca41]" />
          </div>
          {filename && (
            <span className="text-xs text-zinc-500 font-mono">{filename}</span>
          )}
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-mono">{language}</span>
          <button
            onClick={handleCopy}
            className={cn(
              'flex items-center gap-1 text-[11px] px-2 py-1 rounded border transition-all font-mono',
              copied
                ? 'text-blue-400 bg-blue-500/10 border-blue-500/30'
                : 'text-zinc-500 hover:text-zinc-300 border-zinc-700/50 hover:border-zinc-600 bg-transparent'
            )}
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Code area */}
      <div className="overflow-x-auto">
        <pre className="p-5 text-[0.8125rem] leading-[1.85] m-0" style={{ fontFamily: 'var(--font-mono)' }}>
          {showLineNumbers ? (
            <table className="border-collapse w-full">
              <tbody>
                {lines.map((line, i) => (
                  <tr key={i}>
                    <td
                      className="pr-5 select-none text-zinc-700 text-right w-8 align-top"
                      style={{ fontSize: '0.75rem', lineHeight: '1.85' }}
                    >
                      {i + 1}
                    </td>
                    <td>
                      <span
                        className="text-zinc-200"
                        dangerouslySetInnerHTML={{ __html: line || '\u00a0' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <code
              className="text-zinc-200"
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          )}
        </pre>
      </div>
    </div>
  )
}
