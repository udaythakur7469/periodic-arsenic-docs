import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_flushall signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_flushall"
        severity="critical"
        summary="Deletes every key in every database on the Redis instance — no confirmation, no undo"
        detail="FLUSHALL wipes all keys across all Redis databases in a single command. There is no partial execution, no dry-run, and no recovery path. In production this is almost always a catastrophic mistake — wiping cache causes a thundering herd, wiping sessions logs out every user, and wiping queue data loses every pending job."
        causes={[
          'Development commands accidentally run against a production Redis URL',
          'Test teardown scripts using the wrong environment variable',
          'Admin tooling without environment guards',
          'Migration scripts that lack confirmation prompts before destructive steps',
        ]}
        fixes={[
          'Restrict FLUSHALL via Redis ACLs — remove it from the application user entirely',
          'Use separate Redis instances per environment (dev, staging, prod)',
          'Add environment guards in any script that runs destructive commands',
          'Replace with targeted DEL or UNLINK on known key patterns',
        ]}
      />

      <Callout type="danger" title="This cannot be undone">
        FLUSHALL fires immediately and irreversibly. If your application user can issue it,
        a single misrouted request or misconfigured script can wipe your entire cache,
        session store, and queue simultaneously.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — wipes every key in every Redis DB
await redis.flushall();

// GOOD — targeted deletion with confirmation guard
async function clearCacheNamespace(redis: Redis, namespace: string) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Namespace clear requires explicit production flag');
  }

  let cursor = '0';
  do {
    const [next, keys] = await redis.scan(cursor, 'MATCH', \`\${namespace}:*\`, 'COUNT', 100);
    cursor = next;
    if (keys.length > 0) await redis.unlink(...keys);
  } while (cursor !== '0');
}

// GOOD — during test teardown, use isolated Redis DB
// config/test.ts
const testRedis = new Redis({ db: 15 }); // isolated DB index
afterAll(() => testRedis.flushdb()); // only clears DB 15`}
      />

      <h2>Locking down with ACLs</h2>
      <CodeBlock
        language="bash"
        code={`# redis.conf — remove destructive commands from app user
ACL SETUSER appuser ~* +@all -flushall -flushdb -keys

# For test/admin users only — require explicit password
ACL SETUSER adminuser on >admin-secret +@all`}
      />

      <h2>Environment guard pattern</h2>
      <CodeBlock
        language="typescript"
        code={`// lib/redis-admin.ts — wrap destructive ops with guards
export async function dangerFlushAll(redis: Redis, confirm: string) {
  if (confirm !== 'YES_I_KNOW_WHAT_I_AM_DOING') {
    throw new Error('Must pass explicit confirmation string');
  }
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('FLUSHALL is only allowed in development');
  }
  await redis.flushall();
}`}
      />
    </article>
  )
}
