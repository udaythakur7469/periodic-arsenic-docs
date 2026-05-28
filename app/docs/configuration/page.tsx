import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'Configuration' }

export default function ConfigurationPage() {
  return (
    <article className="prose-doc">
      <h1>Configuration</h1>
      <p>All configuration is done in code when calling <code>createMonitor()</code>. There are no config files.</p>

      <h2>MonitorConfig options</h2>
      <table>
        <thead><tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
        <tbody>
          {[
            ['slowQueryThresholdMs', 'number',   '200',   'Threshold in ms for slow query detection'],
            ['exporter',            'Exporter', '—',     'Required. Receives all emitted events'],
            ['emitPositiveSignals', 'boolean',  'false', 'Enable INFO-level healthy signals'],
            ['includeDocs',         'boolean',  'true',  'Include signal explanations in events'],
          ].map(([o, t, d, desc]) => (
            <tr key={o}><td><code>{o}</code></td><td><code>{t}</code></td><td><code>{d}</code></td><td>{desc}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>Full example</h2>
      <CodeBlock language="typescript" code={`import { createMonitor, SignalSeverity } from '@periodic/arsenic';

const monitor = createMonitor({
  // Slow query threshold — queries over this emit slow_query signal
  slowQueryThresholdMs: 200,

  // Required — your event router
  exporter: (event) => {
    switch (event.severity) {
      case SignalSeverity.CRITICAL: sendToPagerDuty(event); break;
      case SignalSeverity.WARNING:  sendToSlack(event);     break;
      case SignalSeverity.INFO:     logger.info(event);     break;
    }
  },

  // Enable INFO signals (disabled by default to reduce noise)
  emitPositiveSignals: false,

  // Include human-readable signal explanations in events
  includeDocs: true,
});`} />

      <h2>Framework adapter options</h2>
      <CodeBlock language="typescript" code={`// Express context
app.use(expressContext(monitor, {
  // Optional — extract user ID from request for event attribution
  attachUser: (req) => req.user?.id,
}));

// Fastify context
app.register(fastifyContext(monitor, {
  attachUser: (req) => req.user?.id,
}));`} />

      <h2>Environment-based configuration</h2>
      <CodeBlock language="typescript" filename="src/config/monitor.ts" code={`const isDev = process.env.NODE_ENV === 'development';

const monitor = createMonitor({
  // Looser in dev, stricter in prod
  slowQueryThresholdMs: isDev ? 500 : 200,

  // More verbose in dev
  emitPositiveSignals: isDev,
  includeDocs: isDev,

  exporter: async (event) => {
    // Always log
    logger.info(event, 'db.event');

    // Only alert in production
    if (!isDev && event.severity === SignalSeverity.CRITICAL) {
      await sendToPagerDuty(event);
    }
  },
});

export default monitor;`} />

      <Callout type="tip" title="No global state">
        Each monitor is a fully independent instance. Create multiple monitors with different thresholds for different databases or services. Safe for multi-tenant applications.
      </Callout>
    </article>
  )
}
