import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'Core Concepts' }

export default function CoreConceptsPage() {
  return (
    <article className="prose-doc">
      <h1>Core Concepts</h1>
      <p>Understanding the three-layer architecture: <strong>monitors</strong> observe, <strong>adapters</strong> instrument, and <strong>exporters</strong> route.</p>

      <h2>The Monitor</h2>
      <p>The <code>Monitor</code> is the core observation engine. Call <code>createMonitor()</code> once, export it, and pass it to adapters and framework middleware.</p>
      <ul>
        <li>No global state — each monitor is fully independent</li>
        <li>Correlates database queries to active HTTP requests via AsyncLocalStorage</li>
        <li>Detects 60+ semantic signals across three severity levels</li>
        <li>Never blocks — all exports are asynchronous and isolated</li>
        <li>Provides callsite attribution (file + line number) for every query</li>
      </ul>
      <CodeBlock language="typescript" code={`const monitor = createMonitor({
  slowQueryThresholdMs: 200,
  emitPositiveSignals: false,
  includeDocs: true,
  exporter: (event) => console.log(event),
});`} />

      <h2>Request correlation via AsyncLocalStorage</h2>
      <p>Framework middleware uses Node.js's AsyncLocalStorage to propagate request context through the entire call stack. Every database query executed within a request handler is automatically correlated to that request.</p>
      <CodeBlock language="typescript" code={`app.use(expressContext(monitor));

app.get('/api/orders', async (req, res) => {
  const orders = await Order.find({ userId: req.user.id });
  // Event includes: request.method, request.route, request.id
  res.json(orders);
});`} />

      <h2>Adapters</h2>
      <p>Adapters hook into database drivers cleanly — no monkey-patching, no prototype mutation. They observe queries and forward events to the monitor.</p>
      <CodeBlock language="typescript" code={`mongooseAdapter(monitor, mongoose);  // MongoDB via Mongoose
prismaAdapter(monitor, prisma);       // SQL via Prisma
pgAdapter(monitor, pool);             // Raw PostgreSQL pg
redisAdapter(monitor, redis);         // ioredis / redis`} />

      <h2>Exporters</h2>
      <p>An exporter is just a function: <code>(event: ForgeEvent) =&gt; void | Promise&lt;void&gt;</code>. You decide where events go.</p>
      <CodeBlock language="typescript" code={`// Single destination
const monitor = createMonitor({
  exporter: (event) => sendToDatadog(event),
});

// Multiple destinations
const monitor = createMonitor({
  exporter: async (event) => {
    await Promise.allSettled([
      sendToDatadog(event),
      saveToDB(event),
      event.severity === 'critical' ? sendToPagerDuty(event) : null,
    ]);
  },
});`} />

      <h2>Callsite attribution</h2>
      <p>Arsenic walks the call stack at query time to identify the exact source file and line that triggered the query.</p>
      <CodeBlock language="json" code={`{
  "callsite": {
    "file": "src/services/OrderService.ts",
    "line": 47
  }
}`} />

      <h2>Design principles</h2>
      <ul>
        <li><strong>Core</strong> is pure TypeScript with zero dependencies</li>
        <li><strong>Adapters</strong> hook into drivers cleanly, no prototype mutation</li>
        <li><strong>Frameworks</strong> attach request context via AsyncLocalStorage only</li>
        <li><strong>Exporters</strong> are just functions — bring your own destination</li>
        <li><strong>No magic on import</strong> — nothing runs until you call <code>createMonitor</code></li>
        <li><strong>Exporter errors</strong> never crash your application</li>
      </ul>

      <Callout type="info">
        Applications create monitors, adapters observe queries, exporters decide where data goes. Each layer is fully decoupled.
      </Callout>
    </article>
  )
}
