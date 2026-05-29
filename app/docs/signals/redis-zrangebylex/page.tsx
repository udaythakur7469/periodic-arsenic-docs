import type { Metadata } from 'next'
import Link from 'next/link'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = { title: 'redis_zrangebylex signal' }

export default function Page() {
  return (
    <article className="prose-doc">
      <div className="mb-6">
        <Link
          href="/docs/signals"
          className="inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity"
          style={{ color: 'var(--primary)' }}
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Signals
        </Link>
      </div>

      <SignalCard
        name="redis_zrangebylex"
        severity="warning"
        summary="Sorted set lexicographic range — O(log N + M), unbounded without LIMIT"
        detail="ZRANGEBYLEX returns members between two lexicographic boundaries in a sorted set where all members have equal scores. It enables efficient prefix queries and autocomplete patterns. Without a LIMIT clause, a wide lex range (e.g. [a to [z or - to +) can return an unbounded number of members. The command is O(log N + M) where M is the number of elements in the lex range."
        causes={[
          'Autocomplete implementations without result count limits',
          'Alphabetical range scans across large lexicographic sets without pagination',
          'Full-alphabet prefix queries on large datasets',
          'Using - to + lex range to retrieve all members sorted alphabetically',
        ]}
        fixes={[
          'Always include LIMIT offset count to cap the result size',
          'Narrow the lex range to the minimum prefix needed',
          'Use ZLEXCOUNT to count matching members without fetching them',
          'Migrate to ZRANGE with BYLEX for Redis 6.2+ codebases',
        ]}
      />

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// Context: all members have score 0, sorted lexicographically
// Useful for: autocomplete, alphabetical indexes, prefix search

// BAD — unbounded lex range, no LIMIT
const allProducts = await redis.zrangebylex('products:index', '-', '+');

// BAD — prefix query without result cap (could match thousands)
const aProducts = await redis.zrangebylex('products:index', '[a', '[a\\xff');

// GOOD — bounded prefix autocomplete
async function autocomplete(redis: Redis, prefix: string, limit = 10) {
  const lower = \`[\${prefix}\`;
  const upper = \`[\${prefix}\\xff\`; // \\xff is beyond any normal char
  return redis.zrangebylex('products:index', lower, upper, 'LIMIT', 0, limit);
}

const suggestions = await autocomplete(redis, 'mac', 8);
// ['macbook', 'macbook-air', 'macbook-pro', 'macos', 'macpro']

// GOOD — count matching prefix without fetching
const matchCount = await redis.zlexcount('products:index', '[mac', '[mac\\xff');

// GOOD — Redis 6.2+ equivalent
const results = await redis.zrange(
  'products:index',
  '[mac', '[mac\\xff',
  'BYLEX',
  'LIMIT', 0, 10
);

// GOOD — build the autocomplete index
await redis.zadd('products:index', 0, 'macbook');
await redis.zadd('products:index', 0, 'macbook-air');
await redis.zadd('products:index', 0, 'macbook-pro');`}
      />

      <Callout type="tip" title="Use \\xff as the upper lex bound for prefix queries">
        The character <code>\xff</code> has the highest byte value and serves as a reliable
        upper bound for any prefix — <code>[mac</code> to <code>[mac\xff</code> matches all
        members that start with "mac" and nothing beyond.
      </Callout>
    </article>
  )
}
