import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'n_plus_one signal' }

export default function Page() {
  return (
    <article className="prose-doc">
      <div className="mb-6">
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--primary)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Signals
        </Link>
      </div>

      <SignalCard
        name="n_plus_one"
        severity="critical"
        summary="Multiple queries detected where a single query should suffice"
        detail="Data is fetched in a loop instead of a single batch query. This is the classic N+1 problem — 1 query to fetch N items, then N queries to fetch related data for each. Performance degrades linearly with dataset size."
        causes={["Iterating a result set and querying related data per item","Missing ORM populate/include (.populate in Mongoose, include in Prisma)","No DataLoader pattern for nested resolvers","Lazy loading without eager loading configured"]}
        fixes={["Use batch queries or joins","Use Mongoose .populate() or Prisma include","Implement DataLoader pattern","Cache frequently accessed related data"]}
      />

      <h2>Example</h2>
      <CodeBlock language="typescript" code={`// BAD — N+1 query
const users = await User.find();
for (const user of users) {
  const posts = await Post.find({ userId: user._id }); // N queries
}

// GOOD — single batch query with populate
const users = await User.find().populate('posts');

// GOOD — Prisma equivalent
const users = await prisma.user.findMany({
  include: { posts: true },
});`} />
    </article>
  )
}
