import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'deprecated_api signal' }

export default function Page() {
  return (
    <article className="prose-doc">
      <div className="mb-6">
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--primary)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Signals
        </Link>
      </div>

      <SignalCard
        name="deprecated_api"
        severity="warning"
        summary="Query used deprecated database methods"
        detail="Deprecated database API detected. May cause compatibility issues in future database versions and often indicates missed migration opportunities."
        causes={["Using deprecated ORM methods","Legacy query patterns not updated","Old driver API versions"]}
        fixes={["Update to current API per migration guide","Check changelog for replacement methods","Test thoroughly after migration"]}
      />

      <h2>Example</h2>
      <CodeBlock language="typescript" code={`// BAD — deprecated MongoDB method
await collection.count({ active: true }); // deprecated

// GOOD — current equivalent
await collection.countDocuments({ active: true });`} />

      <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to all signals
        </Link>
      </div>
    </article>
  )
}
