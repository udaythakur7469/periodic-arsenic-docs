import type { Metadata } from "next";
import { CodeBlock } from "@/components/CodeBlock";
import { SignalCard } from "@/components/SignalCard";
import { Callout } from "@/components/Callout";

export const metadata: Metadata = { title: "read_heavy_hotspot signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="read_heavy_hotspot"
        severity="warning"
        summary="High-frequency reads on specific records"
        detail="Concentrated read activity on specific data points — a prime caching opportunity. The same records are fetched repeatedly, potentially overwhelming database replicas."
        causes={[
          "Popular content without caching",
          "Configuration or settings fetched per request",
          "User profile data fetched on every authenticated request",
          "Product catalog without CDN or cache",
        ]}
        fixes={[
          "Implement Redis caching with TTL",
          "Add read replicas for hot data",
          "Use CDN for static/semi-static data",
          "Denormalize hot data",
        ]}
      />

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// GOOD — cache hot records with TTL
async function getUser(id: string) {
  const cached = await redis.get(\`user:\${id}\`);
  if (cached) return JSON.parse(cached);

  const user = await User.findById(id).lean();
  await redis.setex(\`user:\${id}\`, 300, JSON.stringify(user));
  return user;
}`}
      />
      <Callout type="tip" title="Cache invalidation strategy matters">
        A TTL cache is simple but stale. Use event-driven invalidation (
        <code>redis.del</code> on write) for data that must be fresh.
      </Callout>

      <h2>Cache-aside with invalidation</h2>
      <CodeBlock
        language="typescript"
        code={`const CACHE_TTL = 300; // 5 minutes

async function getProduct(id: string) {
  const cached = await redis.get(\`product:\${id}\`);
  if (cached) return JSON.parse(cached);

  const product = await prisma.product.findUnique({ where: { id } });
  await redis.setex(\`product:\${id}\`, CACHE_TTL, JSON.stringify(product));
  return product;
}

// Invalidate on write — keep cache consistent
async function updateProduct(id: string, data: Partial<Product>) {
  const updated = await prisma.product.update({ where: { id }, data });
  await redis.del(\`product:\${id}\`); // bust cache immediately
  return updated;
}`}
      />
    </article>
  );
}
