import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'overfetching signal' }

export default function Page() {
  return (
    <article className="prose-doc">
      <div className="mb-6">
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--primary)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Signals
        </Link>
      </div>

      <SignalCard
        name="overfetching"
        severity="warning"
        summary="Query selects more fields than necessary"
        detail="Query retrieves more data than needed — common with SELECT * or missing projections. Increases memory usage, serialization cost, and network transfer."
        causes={["SELECT * without projection","Missing .select() in Mongoose","No Prisma select field list","GraphQL resolvers not using field selection"]}
        fixes={["Use SELECT field1, field2 instead of SELECT *","Add Mongoose .select() calls","Use Prisma select object","Implement GraphQL field selection"]}
      />

      <h2>Example</h2>
      <CodeBlock language="typescript" code={`// BAD — fetches all user fields including password hash, large bio, etc.
const user = await User.findById(id);

// GOOD — only fetch what you need
const user = await User.findById(id).select('name email avatar createdAt');

// Prisma equivalent
const user = await prisma.user.findUnique({
  where: { id },
  select: { name: true, email: true, avatar: true, createdAt: true },
});`} />

      <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to all signals
        </Link>
      </div>
    </article>
  )
}
