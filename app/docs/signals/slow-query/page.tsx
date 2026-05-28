import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'slow_query signal' }

export default function Page() {
  return (
    <article className="prose-doc">
      <div className="mb-6">
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--primary)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Signals
        </Link>
      </div>

      <SignalCard
        name="slow_query"
        severity="warning"
        summary="Query exceeded configured slowQueryThresholdMs"
        detail="This query took longer than expected based on your configured threshold and may impact request latency. Review query execution plan and consider adding indexes."
        causes={["Missing indexes","Large result set without pagination","Complex aggregation without optimization","Network latency to database"]}
        fixes={["Analyze with EXPLAIN/explain()","Add appropriate indexes","Optimize query structure","Implement caching for stable data"]}
      />

      <h2>Example</h2>
      <CodeBlock language="typescript" code={`// Analyze slow Mongoose query
const user = await User.findOne({ email }).explain('executionStats');
console.log(user.executionStats); // shows COLLSCAN vs IXSCAN`} />

      <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to all signals
        </Link>
      </div>
    </article>
  )
}
