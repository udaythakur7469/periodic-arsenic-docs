import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { SignalCard } from '@/components/SignalCard'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'redis_flushdb signal' }

export default function Page() {
  return (
    <article className="prose-doc">

      <SignalCard
        name="redis_flushdb"
        severity="critical"
        summary="Deletes all keys in the currently selected database — equally destructive within its scope"
        detail="FLUSHDB clears every key in the Redis database currently selected by the connection. While scoped to one DB index (0–15) rather than the entire instance like FLUSHALL, it is equally destructive within that scope. Most applications use DB 0 by default, making FLUSHDB functionally identical to FLUSHALL in a standard deployment."
        causes={[
          'Test teardown scripts using the wrong Redis connection or DB index',
          'Development scripts run against the wrong environment',
          'Cache reset tooling without DB scope validation',
          'Admin routes that are not properly protected',
        ]}
        fixes={[
          'Restrict FLUSHDB via Redis ACLs on the application user',
          'Use a dedicated Redis DB index (e.g. DB 15) for test environments and flush only that',
          'Replace with targeted key deletion using SCAN + UNLINK',
          'Add environment and DB index assertions before any flush operation',
        ]}
      />

      <Callout type="danger" title="Scoped but still destructive">
        FLUSHDB is often mistaken as "safer" than FLUSHALL because it only clears one database.
        In practice, if your application uses Redis DB 0 (the default), FLUSHDB wipes your
        entire application cache, session store, and any queues running in that DB.
      </Callout>

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — clears all keys in the current DB (DB 0 by default)
await redis.flushdb();

// GOOD — isolated test DB with explicit guard
const TEST_DB_INDEX = 15;

const testRedis = new Redis({
  host: process.env.REDIS_HOST,
  port: 6379,
  db: TEST_DB_INDEX, // explicit isolation
});

async function clearTestData() {
  const dbIndex = await testRedis.client('INFO').then(/* parse current db */);
  if (dbIndex !== TEST_DB_INDEX) {
    throw new Error(\`Expected DB \${TEST_DB_INDEX}, got \${dbIndex}\`);
  }
  await testRedis.flushdb();
}

// GOOD — targeted key removal in production
async function clearUserCache(redis: Redis, userId: string) {
  const pattern = \`user:\${userId}:*\`;
  let cursor = '0';
  do {
    const [next, keys] = await redis.scan(cursor, 'MATCH', pattern, 'COUNT', 50);
    cursor = next;
    if (keys.length > 0) await redis.unlink(...keys);
  } while (cursor !== '0');
}`}
      />

      <h2>DB isolation for tests</h2>
      <CodeBlock
        language="typescript"
        code={`// jest.setup.ts
import Redis from 'ioredis';

const TEST_REDIS_DB = 15;
export const testRedis = new Redis({ db: TEST_REDIS_DB });

beforeEach(async () => {
  // Verify we are on the right DB before clearing
  const info = await testRedis.info('server');
  if (!info.includes(\`db\${TEST_REDIS_DB}\`)) {
    throw new Error('Wrong Redis DB selected for tests');
  }
  await testRedis.flushdb();
});

afterAll(() => testRedis.quit());`}
      />
    </article>
  )
}
