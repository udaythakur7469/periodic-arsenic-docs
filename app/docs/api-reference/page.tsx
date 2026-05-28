import type { Metadata } from 'next'
import { CodeBlock } from '@/components/CodeBlock'

export const metadata: Metadata = { title: 'API Reference' }

export default function ApiReferencePage() {
  return (
    <article className="prose-doc">
      <h1>API Reference</h1>
      <p>Complete type-safe API for <code>@periodic/arsenic</code>.</p>

      <h2>createMonitor</h2>
      <CodeBlock language="typescript" code={`function createMonitor(config: MonitorConfig): Monitor

interface MonitorConfig {
  slowQueryThresholdMs?: number   // Default: 200
  exporter: Exporter              // Required
  emitPositiveSignals?: boolean   // Default: false
  includeDocs?: boolean           // Default: true
}`} />

      <table>
        <thead><tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
        <tbody>
          {[
            ['slowQueryThresholdMs','number','200','Threshold in ms for slow query detection'],
            ['exporter','Exporter','—','Required. Function that receives all emitted events'],
            ['emitPositiveSignals','boolean','false','Enable INFO-level healthy signals'],
            ['includeDocs','boolean','true','Include signal explanations in events'],
          ].map(([o, t, d, desc]) => (
            <tr key={o}><td><code>{o}</code></td><td><code>{t}</code></td><td><code>{d}</code></td><td>{desc}</td></tr>
          ))}
        </tbody>
      </table>

      <h2>Framework adapters</h2>
      <CodeBlock language="typescript" code={`// Express — add BEFORE routes
function expressContext(
  monitor: Monitor,
  options?: { attachUser?: (req: Request) => string | undefined }
): RequestHandler

// Fastify — register as plugin
function fastifyContext(
  monitor: Monitor,
  options?: { attachUser?: (req: FastifyRequest) => string | undefined }
): FastifyPlugin`} />

      <h2>Database adapters</h2>
      <CodeBlock language="typescript" code={`function mongooseAdapter(monitor: Monitor, mongoose: Mongoose): void
function prismaAdapter(monitor: Monitor, prisma: PrismaClient): void
function pgAdapter(monitor: Monitor, pool: Pool): void
function redisAdapter(monitor: Monitor, client: Redis | RedisClient): void`} />

      <h2>Redis utilities</h2>
      <CodeBlock language="typescript" code={`function getRedisCommandInfo(command: string): {
  command: string
  category: 'dangerous' | 'blocking' | 'slow' | 'normal'
  docs: string
}

const SLOW_REDIS_COMMANDS: string[]
const REDIS_COMMAND_INFO: Record<string, { category: string; docs: string }>`} />

      <h2>Exporters</h2>
      <CodeBlock language="typescript" code={`function createOtelExporter(options: {
  serviceName: string
  exportAsSpans?: boolean
  exportAsMetrics?: boolean
}): Exporter`} />

      <h2>ForgeEvent interface</h2>
      <CodeBlock language="typescript" code={`interface ForgeEvent {
  type: 'db.query'
  db: string
  adapter: string
  model: string
  operation: string
  durationMs: number
  slow: boolean
  signals: ForgeSignal[]
  severity: SignalSeverity
  explanations: Record<string, {
    summary: string
    detail: string
    severity: 'critical' | 'warning' | 'info'
    docs?: string
  }>
  request?: {
    id: string
    method: string
    route: string
    userId?: string
  }
  callsite?: {
    file: string
    line: number
  }
  metadata?: {
    limit?: number | null
    query?: string
    rowsAffected?: number
    cpuUsage?: number
    memoryUsage?: number
    cacheHit?: boolean
    payloadSize?: number
    retryCount?: number
    connectionReused?: boolean
    indexUsed?: boolean
    command?: string
    commandCategory?: string
    commandDocs?: string
    args?: any
    error?: string
    [key: string]: any
  }
  timestamp: string
}

enum SignalSeverity {
  CRITICAL = 'critical',
  WARNING  = 'warning',
  INFO     = 'info',
}`} />

      <h2>TypeScript imports</h2>
      <CodeBlock language="typescript" code={`import type {
  ForgeEvent,
  ForgeSignal,
  SignalSeverity,
  Exporter,
  MonitorConfig,
  QueryMetadata,
  RequestContext,
} from '@periodic/arsenic';`} />
    </article>
  )
}
