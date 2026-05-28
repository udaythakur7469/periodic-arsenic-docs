import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'connection_pool_exhaustion signal' }

export default function Page() {
  return (
    <article className="prose-doc">
      <div className="mb-6">
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--primary)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Signals
        </Link>
      </div>

      <SignalCard
        name="connection_pool_exhaustion"
        severity="critical"
        summary="Database connection pool nearing or at capacity"
        detail="The connection pool is under pressure. This leads to connection timeouts, failed requests, and cascading failures. Under high load, this can bring down an entire service."
        causes={["Too many concurrent requests for pool size","Connection leaks — connections not returned to pool","Slow queries holding connections too long","Misconfigured pool size for workload"]}
        fixes={["Increase pool size in DB config","Investigate connection leaks","Add connection timeout configuration","Use PgBouncer or equivalent pooler"]}
      />

      <h2>Example</h2>
      <CodeBlock language="typescript" code={`// Mongoose — configure pool size
mongoose.connect(uri, {
  maxPoolSize: 20,        // Increase from default 5
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});

// pg — configure pool
const pool = new Pool({
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});`} />
    </article>
  )
}
