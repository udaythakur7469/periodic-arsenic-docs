import type { Metadata } from "next";
import { CodeBlock } from "@/components/CodeBlock";
import { SignalCard } from "@/components/SignalCard";
import { Callout } from "@/components/Callout";

export const metadata: Metadata = { title: "blocking_io signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="blocking_io"
        severity="critical"
        summary="Blocking operations detected on event loop"
        detail="Synchronous I/O operations are blocking the Node.js event loop, degrading overall application responsiveness. While blocked, no other requests can be processed."
        causes={[
          "Synchronous file operations (fs.readFileSync, fs.writeFileSync)",
          "CPU-intensive operations on the main thread",
          "Synchronous JSON.parse on large payloads",
          "Missing async/await on I/O operations",
        ]}
        fixes={[
          "Use async/await for all I/O operations",
          "Use fs.promises instead of synchronous fs methods",
          "Use worker threads for CPU-intensive tasks",
          "Profile event loop lag with clinic.js",
        ]}
      />

      <Callout type="danger" title="Blocks the entire process">
        Node.js runs on a single thread. Any synchronous CPU or I/O work blocks
        every concurrent request for its entire duration.
      </Callout>

      <h2>CPU-intensive work</h2>
      <CodeBlock
        language="typescript"
        code={`import { Worker } from 'worker_threads';

// BAD — blocks event loop for every request
app.get('/report', (req, res) => {
  const result = heavyCsvProcessing(data); // synchronous, blocks all requests
  res.json(result);
});

// GOOD — offload to worker thread
app.get('/report', (req, res) => {
  const worker = new Worker('./workers/csv-processor.js', { workerData: data });
  worker.once('message', (result) => res.json(result));
});`}
      />
    </article>
  );
}
