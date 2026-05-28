import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'fan_out signal' }

export default function Page() {
  return (
    <article className="prose-doc">
      <div className="mb-6">
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--primary)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Signals
        </Link>
      </div>

      <SignalCard
        name="fan_out"
        severity="warning"
        summary="Single request triggered too many database queries"
        detail="Request fans out into many DB queries, indicating architectural issues or missing data aggregation. High query fan-out increases latency and puts pressure on connection pools."
        causes={["Missing aggregation — data fetched piecemeal","No DataLoader for nested resolvers","Redundant queries for the same data","Missing joins or batch operations"]}
        fixes={["Use batch queries or DataLoader","Implement response caching","Aggregate data on the backend","Redesign data model for fewer round-trips"]}
      />

      <h2>Example</h2>
      <CodeBlock language="typescript" code={`// BAD — fan-out: one query per post author
const posts = await Post.find({ published: true });
const postsWithAuthors = await Promise.all(
  posts.map(post => User.findById(post.authorId))
);

// GOOD — single joined query
const posts = await Post.find({ published: true }).populate('author');`} />

      <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to all signals
        </Link>
      </div>
    </article>
  )
}
