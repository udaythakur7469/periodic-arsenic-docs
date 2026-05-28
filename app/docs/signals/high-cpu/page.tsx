import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'high_cpu signal' }

export default function Page() {
  return (
    <article className="prose-doc">
      <div className="mb-6">
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--primary)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Signals
        </Link>
      </div>

      <SignalCard
        name="high_cpu"
        severity="warning"
        summary="Query or request caused high CPU consumption"
        detail="Elevated CPU usage during query execution — often complex aggregations, sorts on large datasets, regex patterns, or missing indexes causing full scans."
        causes={["Complex aggregation pipelines","Regex queries without indexes","In-memory sorting of large result sets","Missing indexes causing full collection scans"]}
        fixes={["Optimize complex calculations","Push computation to database aggregation pipelines","Add indexes for sorting/filtering","Avoid regex queries; use text indexes"]}
      />

      <h2>Example</h2>
      <CodeBlock language="typescript" code={`// BAD — regex query causes full scan
const users = await User.find({ name: /^john/i });

// GOOD — text index for search
await User.collection.createIndex({ name: 'text' });
const users = await User.find({ $text: { $search: 'john' } });`} />

      <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to all signals
        </Link>
      </div>
    </article>
  )
}
