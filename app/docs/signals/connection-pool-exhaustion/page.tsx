import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'connection_pool_exhaustion signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="connection_pool_exhaustion"
        severity="critical"
        summary="Database connection pool nearing or at capacity"
        detail="The connection pool is under pressure. This leads to connection timeouts, failed requests, and cascading failures. Under high load, this can bring down an entire service."
        causes={[
          "Too many concurrent requests for pool size",
          "Connection leaks — connections not returned to pool",
          "Slow queries holding connections too long",
          "Misconfigured pool size for workload",
        ]}
        fixes={[
          "Increase pool size in DB config",
          "Investigate connection leaks",
          "Add connection timeout configuration",
          "Use PgBouncer or equivalent pooler",
        ]}
      />

      <Callout type="danger" title="Cascading failure risk">
        Pool exhaustion causes all new requests to queue or timeout
        simultaneously. One slow upstream query can exhaust the pool and take
        down your entire service.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// Mongoose — configure pool size
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
});`}
      />
      <h2>Monitoring pool health</h2>
      <CodeBlock
        language="typescript"
        code={`const monitor = createMonitor({
  exporter: (event) => {
    if (event.signals.includes('connection_pool_exhaustion')) {
      metrics.gauge('db.pool.utilization', event.metadata?.poolUtilization);
      if (event.metadata?.poolUtilization > 0.8) {
        alertOncall('DB pool above 80% — risk of exhaustion');
      }
    }
  },
});

// Prisma — configure pool size explicitly
const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL + '?connection_limit=20&pool_timeout=10' },
  },
});`}
      />
    </article>
  );
}
