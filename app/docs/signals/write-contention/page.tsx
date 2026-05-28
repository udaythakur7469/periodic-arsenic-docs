import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'write_contention signal' }

export default function Page() {
  return (
    <article className="prose-doc">
      <div className="mb-6">
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--primary)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Signals
        </Link>
      </div>

      <SignalCard
        name="write_contention"
        severity="critical"
        summary="High-frequency writes to the same record detected"
        detail="High-frequency writes to the same record may cause lock contention, serialization issues, and performance degradation. Common with counters, metrics, and leaderboards updated on every request."
        causes={["Counters or metrics updated on every request","Session data written to the same record","Rate limiting state stored in a single document","Leaderboard or ranking updates at high frequency"]}
        fixes={["Batch updates using $inc or equivalent atomic operations","Use Redis for high-frequency counters","Implement write buffering / debounce","Consider event sourcing for counters"]}
      />

      <h2>Example</h2>
      <CodeBlock language="typescript" code={`// BAD — write contention on counter
await Counter.updateOne({ type: 'pageviews' }, { $inc: { count: 1 } });
// Every request hits the same document

// GOOD — buffer in Redis, flush periodically
await redis.incr('counter:pageviews');

// Flush to DB every 60s
setInterval(async () => {
  const count = await redis.getdel('counter:pageviews');
  if (count) await Counter.updateOne(
    { type: 'pageviews' },
    { $inc: { count: parseInt(count) } },
    { upsert: true }
  );
}, 60000);`} />
    </article>
  )
}
