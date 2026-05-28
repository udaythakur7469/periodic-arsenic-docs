import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'PostgreSQL (pg) Adapter' }

export default function PgAdapterPage() {
  return (
    <article className="prose-doc">
      <h1>PostgreSQL Adapter (pg)</h1>
      <p>The <code>pgAdapter</code> instruments raw PostgreSQL queries via the <code>pg</code> (node-postgres) library. Use this when you need direct SQL access without an ORM layer.</p>

      <h2>Setup</h2>
      <CodeBlock language="typescript" code={`import { Pool } from 'pg';
import express from 'express';
import { createMonitor, expressContext, pgAdapter } from '@periodic/arsenic';

const app = express();
const pool = new Pool({
  host:     process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  user:     process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port:     5432,
  max:      20,   // Connection pool size
});

const monitor = createMonitor({
  slowQueryThresholdMs: 150, // Stricter for SQL
  exporter: (event) => {
    if (event.severity === 'critical') sendToPagerDuty(event);
  },
});

app.use(expressContext(monitor));
pgAdapter(monitor, pool);

app.listen(3000);`} />

      <h2>Raw SQL best practices</h2>
      <CodeBlock language="typescript" code={`// BAD — unbounded query (triggers unbounded_query signal)
const { rows } = await pool.query('SELECT * FROM users WHERE active = true');

// GOOD — always paginate
const { rows } = await pool.query(
  'SELECT id, name, email FROM users WHERE active = true LIMIT $1 OFFSET $2',
  [20, page * 20]
);

// GOOD — parameterized queries (also prevents SQL injection)
const { rows } = await pool.query(
  'SELECT id, name, email FROM users WHERE id = $1',
  [userId]
);`} />

      <h2>Transaction monitoring</h2>
      <CodeBlock language="typescript" code={`// Transactions are also monitored
const client = await pool.connect();
try {
  await client.query('BEGIN');
  await client.query('UPDATE inventory SET qty = qty - $1 WHERE id = $2', [1, productId]);
  await client.query('INSERT INTO orders (product_id, user_id) VALUES ($1, $2)', [productId, userId]);
  await client.query('COMMIT');
} catch (err) {
  await client.query('ROLLBACK');
  throw err;
} finally {
  client.release(); // Always release — prevents connection_pool_exhaustion
}`} />

      <Callout type="danger" title="Always release connections">
        Always call <code>client.release()</code> in a <code>finally</code> block. Connection leaks are the most common cause of <code>connection_pool_exhaustion</code> in pg applications.
      </Callout>

      <h2>Event output</h2>
      <CodeBlock language="json" code={`{
  "type": "db.query",
  "db": "postgres",
  "adapter": "pg",
  "model": "users",
  "operation": "select",
  "durationMs": 145,
  "slow": false,
  "signals": ["bounded_query", "indexed_lookup"],
  "severity": "info",
  "metadata": {
    "query": "SELECT id, name, email FROM users WHERE id = $1",
    "rowsAffected": 1
  }
}`} />
    </article>
  )
}
