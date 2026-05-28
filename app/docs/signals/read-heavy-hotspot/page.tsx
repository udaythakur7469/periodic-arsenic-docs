import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'read_heavy_hotspot signal' }

export default function Page() {
  return (
    <article className="prose-doc">
      <div className="mb-6">
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--primary)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Signals
        </Link>
      </div>

      <SignalCard
        name="read_heavy_hotspot"
        severity="warning"
        summary="High-frequency reads on specific records"
        detail="Concentrated read activity on specific data points — a prime caching opportunity. The same records are fetched repeatedly, potentially overwhelming database replicas."
        causes={["Popular content without caching","Configuration or settings fetched per request","User profile data fetched on every authenticated request","Product catalog without CDN or cache"]}
        fixes={["Implement Redis caching with TTL","Add read replicas for hot data","Use CDN for static/semi-static data","Denormalize hot data"]}
      />

      <h2>Example</h2>
      <CodeBlock language="typescript" code={`// GOOD — cache hot records with TTL
async function getUser(id: string) {
  const cached = await redis.get(\`user:\${id}\`);
  if (cached) return JSON.parse(cached);

  const user = await User.findById(id).lean();
  await redis.setex(\`user:\${id}\`, 300, JSON.stringify(user));
  return user;
}`} />

      <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
        <Link href="/docs/signals" className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity" style={{ color: 'var(--muted-foreground)' }}>
          <ArrowLeft className="h-3.5 w-3.5" /> Back to all signals
        </Link>
      </div>
    </article>
  )
}
