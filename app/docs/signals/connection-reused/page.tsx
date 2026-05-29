import type { Metadata } from 'next'
import { SignalCard } from '@/components/SignalCard'
import { CodeBlock } from '@/components/CodeBlock'

export const metadata: Metadata = { title: 'connection_reused signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="connection_reused"
        severity="info"
        summary="Database connection reused from pool"
        detail="Connection pooling is working effectively, avoiding costly connection establishment overhead."
      />

      <div
        className="mt-8 pt-6 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <h2>What this signal means</h2>
        <CodeBlock
          language="typescript"
          code={`// connection_reused fires when your pool hands out an existing connection
// rather than opening a new TCP connection to the database.
//
// New connection: TCP handshake + TLS + auth = 20–100ms overhead
// Reused connection: 0ms overhead
//
// Configure your pool size to maximise reuse under your concurrency:

// Prisma
const prisma = new PrismaClient({
  datasources: {
    db: { url: process.env.DATABASE_URL + '?connection_limit=10&pool_timeout=5' },
  },
});

// Mongoose
mongoose.connect(uri, {
  maxPoolSize: 10,   // max concurrent connections
  minPoolSize: 2,    // keep warm connections alive
  socketTimeoutMS: 30_000,
});`}
        />
      </div>
    </article>
  );
}
