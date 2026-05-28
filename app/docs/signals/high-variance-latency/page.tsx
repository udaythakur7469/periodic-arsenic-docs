import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'high_variance_latency signal' }

export default function Page() {
  return (
    <article className="prose-doc">
      <div className="mb-6">
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--primary)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Signals
        </Link>
      </div>

      <SignalCard
        name="high_variance_latency"
        severity="warning"
        summary="Query latency is inconsistent across executions"
        detail="High variance in execution time suggests unpredictable performance — often caused by cache misses, resource contention, or cold starts."
        causes={["Inconsistent cache hit rates","Resource contention at peak load","GC pressure affecting query timing","Index selectivity issues"]}
        fixes={["Check for cache misses and warm caches","Investigate index selectivity","Analyze data distribution","Look for resource contention"]}
      />

      <h2>Example</h2>
      <CodeBlock language="typescript" code={`// Monitor latency distribution
const times = [];
const monitor = createMonitor({
  exporter: (event) => {
    if (event.model === 'User' && event.operation === 'findOne') {
      times.push(event.durationMs);
      const variance = calculateVariance(times);
      if (variance > 1000) sendAlert('high_variance', { variance, times });
    }
  }
});`} />

      <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to all signals
        </Link>
      </div>
    </article>
  )
}
