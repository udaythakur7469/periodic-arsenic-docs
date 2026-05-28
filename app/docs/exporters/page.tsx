import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'
import { Callout } from '@/components/Callout'

export const metadata: Metadata = { title: 'Exporters' }

export default function ExportersPage() {
  return (
    <article className="prose-doc">
      <h1>Exporters</h1>
      <p>An exporter is just a function that receives every <code>ForgeEvent</code> emitted by the monitor. You decide where events go — PagerDuty, Slack, Datadog, OpenTelemetry, a database, or stdout. Bring your own destination.</p>

      <h2>Exporter signature</h2>
      <CodeBlock language="typescript" code={`type Exporter = (event: ForgeEvent) => void | Promise<void>

const monitor = createMonitor({
  exporter: (event) => { /* your routing logic */ },
});`} />

      <h2>Severity-based routing</h2>
      <CodeBlock language="typescript" code={`import { SignalSeverity } from '@periodic/arsenic';

const monitor = createMonitor({
  exporter: (event) => {
    switch (event.severity) {
      case SignalSeverity.CRITICAL:
        sendToPagerDuty(event);
        break;
      case SignalSeverity.WARNING:
        sendToSlack(event);
        break;
      case SignalSeverity.INFO:
        logger.info('db.event', event);
        break;
    }
  },
});`} />

      <h2>Multiple destinations</h2>
      <CodeBlock language="typescript" code={`const monitor = createMonitor({
  exporter: async (event) => {
    // allSettled — one failing exporter never blocks others
    await Promise.allSettled([
      sendToDatadog(event),
      saveToDB(event),
      event.severity === 'critical' ? sendToPagerDuty(event) : null,
    ]);
  },
});`} />

      <h2>OpenTelemetry exporter</h2>
      <CodeBlock language="typescript" code={`import { createMonitor, createOtelExporter } from '@periodic/arsenic';

const monitor = createMonitor({
  exporter: createOtelExporter({
    serviceName: process.env.SERVICE_NAME || 'my-service',
    exportAsSpans:   true,
    exportAsMetrics: true,
  }),
});`} />

      <h2>Structured logging with @periodic/iridium</h2>
      <CodeBlock language="typescript" code={`import { createLogger, ConsoleTransport, JsonFormatter } from '@periodic/iridium';
import { createMonitor } from '@periodic/arsenic';

const logger = createLogger({
  transports: [new ConsoleTransport({ formatter: new JsonFormatter() })],
});

const monitor = createMonitor({
  exporter: (event) => logger.info('db.event', event),
});
// Pipe to Elasticsearch, Datadog, CloudWatch, etc.`} />

      <h2>Rate limiting your exporter</h2>
      <CodeBlock language="typescript" code={`// Prevent alert storms on critical signals
const lastAlerted = new Map<string, number>();
const COOLDOWN_MS = 60000; // 1 minute

const monitor = createMonitor({
  exporter: async (event) => {
    const key = \`\${event.model}:\${event.signals.join(',')}\`;
    const last = lastAlerted.get(key) || 0;

    if (Date.now() - last > COOLDOWN_MS) {
      lastAlerted.set(key, Date.now());
      await sendToPagerDuty(event);
    }

    // Always log regardless of rate limit
    logger.info(event, 'db.event');
  },
});`} />

      <h2>Sentry integration</h2>
      <CodeBlock language="typescript" code={`import * as Sentry from '@sentry/node';

const monitor = createMonitor({
  exporter: (event) => {
    if (event.severity === 'critical') {
      Sentry.captureEvent({
        message: event.signals.join(', '),
        level: 'error',
        extra: event,
      });
    }
  },
});`} />

      <Callout type="tip" title="Exporter errors never crash your app">
        Arsenic wraps all exporter calls. If your exporter throws, the error is caught and your application continues normally. Monitor your exporter for failures with a try/catch inside if needed.
      </Callout>
    </article>
  )
}
