import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'high_memory signal' }

export default function Page() {
  return (
    <article className="prose-doc">
      <div className="mb-6">
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--primary)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Signals
        </Link>
      </div>

      <SignalCard
        name="high_memory"
        severity="warning"
        summary="Query or request caused high memory usage"
        detail="Elevated memory consumption — potentially large result sets, inefficient data structures, loading entire documents when only a few fields are needed."
        causes={["Fetching entire documents when few fields are needed","Large result sets without streaming","In-memory joins of large datasets","Missing projections"]}
        fixes={["Use field projections (SELECT field1, field2)","Implement streaming for large datasets","Add pagination for large result sets","Use .lean() in Mongoose for read-only results"]}
      />

      <h2>Example</h2>
      <CodeBlock language="typescript" code={`// BAD — loads entire documents including large blobs
const users = await User.find({ active: true });

// GOOD — project only needed fields
const users = await User.find({ active: true }).select('name email createdAt').lean();

// GOOD — stream large result sets
const cursor = User.find({ active: true }).cursor();
for await (const user of cursor) {
  await processUser(user);
}`} />

      <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to all signals
        </Link>
      </div>
    </article>
  )
}
