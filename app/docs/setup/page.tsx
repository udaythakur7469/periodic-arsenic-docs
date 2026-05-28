import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'Setup Guide' }

export default function SetupPage() {
  return (
    <article className="prose-doc">
      <h1>Setup Guide</h1>
      <p>Complete setup guide for development and production environments.</p>

      <h2>Development setup</h2>
      <CodeBlock language="typescript" filename="src/monitoring.ts" code={`import { createMonitor, SignalSeverity } from '@periodic/arsenic';

export const monitor = createMonitor({
  slowQueryThresholdMs: 100,   // Lower threshold for dev
  includeDocs: true,
  emitPositiveSignals: true,   // Learn healthy patterns in dev

  exporter: (event) => {
    const emoji = { critical: '🔴', warning: '⚠️', info: '✅' }[event.severity];
    console.log(emoji + ' [' + event.severity.toUpperCase() + ']', {
      query: event.model + '.' + event.operation,
      duration: event.durationMs + 'ms',
      signals: event.signals,
      callsite: event.callsite,
    });
    if (event.severity === SignalSeverity.CRITICAL) {
      console.log(JSON.stringify(event, null, 2));
    }
  },
});`} />

      <h2>Production setup</h2>
      <CodeBlock language="typescript" filename="src/config/monitoring.ts" code={`import { createMonitor, createOtelExporter, SignalSeverity } from '@periodic/arsenic';

const isProd = process.env.NODE_ENV === 'production';

export const monitor = createMonitor({
  slowQueryThresholdMs: isProd ? 300 : 100,
  includeDocs: !isProd,
  emitPositiveSignals: !isProd,

  exporter: async (event) => {
    logger.info(event, 'arsenic.query');
    if (isProd && event.severity === SignalSeverity.CRITICAL) {
      await sendToPagerDuty(event);
    }
    if (event.severity === SignalSeverity.WARNING) {
      await sendToSlack(event);
    }
  },
});`} />

      <h2>Docker setup</h2>
      <CodeBlock language="bash" code={`version: '3.8'
services:
  app:
    build: .
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/myapp
      - REDIS_HOST=redis
    depends_on: [mongo, redis]
  mongo:
    image: mongo:6
    volumes: [mongo-data:/data/db]
  redis:
    image: redis:7-alpine
volumes:
  mongo-data:`} />

      <h2>Common troubleshooting</h2>

      <h3>No events being emitted</h3>
      <Callout type="warning" title="Check adapter is attached">
        The monitor alone does nothing. You must call the adapter: <code>mongooseAdapter(monitor, mongoose)</code>.
      </Callout>

      <h3>Missing request context</h3>
      <Callout type="danger" title="Middleware must be before routes">
        <code>app.use(expressContext(monitor))</code> must come before any route handlers. Queries from routes registered before the middleware will have no request context.
      </Callout>

      <CodeBlock language="typescript" code={`// ✅ Correct
app.use(expressContext(monitor));
app.get('/api/users', handler);

// ❌ Wrong — context never runs for this route
app.get('/api/users', handler);
app.use(expressContext(monitor));`} />

      <h3>TypeScript errors</h3>
      <CodeBlock language="json" code={`{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true
  }
}`} />
    </article>
  )
}
