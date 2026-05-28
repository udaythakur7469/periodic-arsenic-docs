import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'retry_loop signal' }

export default function Page() {
  return (
    <article className="prose-doc">
      <div className="mb-6">
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--primary)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Signals
        </Link>
      </div>

      <SignalCard
        name="retry_loop"
        severity="critical"
        summary="Excessive retries detected on query execution"
        detail="Query is being retried multiple times, indicating transient failures, deadlocks, or connectivity issues. Excessive retries cause latency spikes and may mask underlying infrastructure problems."
        causes={["Database connectivity issues","Deadlocks in transactions","Connection pool exhaustion causing timeouts","Optimistic locking conflicts"]}
        fixes={["Investigate database connectivity and logs","Check for deadlocks in transaction logs","Implement exponential backoff with jitter","Add circuit breakers to prevent cascading failures"]}
      />

      <h2>Example</h2>
      <CodeBlock language="typescript" code={`// GOOD — exponential backoff with jitter
async function withRetry(fn, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) throw error;
      const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
      const jitter = Math.random() * 1000;
      await new Promise(r => setTimeout(r, delay + jitter));
    }
  }
}`} />
    </article>
  )
}
