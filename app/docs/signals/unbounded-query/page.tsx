import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'unbounded_query signal' }

export default function Page() {
  return (
    <article className="prose-doc">
      <div className="mb-6">
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--primary)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Signals
        </Link>
      </div>

      <SignalCard
        name="unbounded_query"
        severity="critical"
        summary="Query missing LIMIT — potential unbounded data fetch"
        detail="This query does not include a LIMIT clause and may return an unexpectedly large dataset, causing memory spikes and performance degradation. On large collections, this can return millions of records."
        causes={["Missing LIMIT clause on find/select queries","No default limit set at ORM level","Pagination not implemented"]}
        fixes={["Always add LIMIT clauses to find queries","Implement cursor-based pagination","Add default limits at ORM level","Use .lean() in Mongoose for read-only queries"]}
      />

      <h2>Example</h2>
      <CodeBlock language="typescript" code={`// BAD — unbounded query
const users = await User.find({ status: 'active' });

// GOOD — always limit
const users = await User.find({ status: 'active' }).limit(100);

// GOOD — cursor-based pagination
const users = await User.find({
  status: 'active',
  _id: { $gt: lastSeenId }
}).limit(20);`} />
    </article>
  )
}
