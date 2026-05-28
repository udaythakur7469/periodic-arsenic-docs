import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'hot_path signal' }

export default function Page() {
  return (
    <article className="prose-doc">
      <div className="mb-6">
        <Link
          href="/docs/signals"
          className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity"
          style={{ color: "var(--primary)" }}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Signals
        </Link>
      </div>

      <SignalCard
        name="hot_path"
        severity="critical"
        summary="Slow query on a frequently hit execution path"
        detail="This query appears on a hot execution path and contributes significantly to overall request latency. It is a high-priority optimization target because it is both slow AND frequently executed — a compound problem."
        causes={[
          "Missing indexes on frequently queried fields",
          "Inefficient query structure executed at high frequency",
          "Large dataset without pagination on a popular route",
          "Complex joins on unindexed columns in hot paths",
        ]}
        fixes={[
          "Add appropriate indexes for the queried fields",
          "Implement caching (Redis, Memcached) for this result",
          "Optimize the query structure or use projections",
          "Add pagination/limits to bound result size",
        ]}
      />

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — slow findOne on every GET /users/:id
app.get('/users/:id', async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  res.json(user);
});

// GOOD — add index on _id (already indexed) and cache the result
app.get('/users/:id', async (req, res) => {
  const cached = await redis.get(\`user:\${req.params.id}\`);
  if (cached) return res.json(JSON.parse(cached));

  const user = await User.findOne({ _id: \${req.params.id} }).select('-__v');
  await redis.setex(\`user:\${req.params.id}\`, 300, JSON.stringify(user));
  res.json(user);
});`}
      />
    </article>
  );
}
