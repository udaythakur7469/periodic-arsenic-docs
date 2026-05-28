import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'large_payload signal' }

export default function Page() {
  return (
    <article className="prose-doc">
      <div className="mb-6">
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--primary)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Signals
        </Link>
      </div>

      <SignalCard
        name="large_payload"
        severity="warning"
        summary="Query returned an excessively large dataset"
        detail="The result set size is unusually large, suggesting overfetching, missing pagination, or inefficient data retrieval. Large payloads increase memory usage, serialization time, and network transfer costs."
        causes={["Missing pagination on list endpoints","No field projection","Eager loading too many relations","No size limits on result sets"]}
        fixes={["Add pagination — cursor-based preferred","Use field projection to select only needed fields","Implement lazy loading","Add result size limits"]}
      />

      <h2>Example</h2>
      <CodeBlock language="typescript" code={`// BAD — loads all orders including line items
const orders = await prisma.order.findMany({
  include: { items: true, customer: true, payments: true }
});

// GOOD — paginate and select fields
const orders = await prisma.order.findMany({
  take: 20,
  cursor: { id: lastId },
  select: { id: true, total: true, status: true, createdAt: true },
});`} />

      <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to all signals
        </Link>
      </div>
    </article>
  )
}
