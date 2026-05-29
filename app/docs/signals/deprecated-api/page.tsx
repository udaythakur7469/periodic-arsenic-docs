import type { Metadata } from "next";
import { CodeBlock } from "@/components/CodeBlock";
import { SignalCard } from "@/components/SignalCard";
import { Callout } from "@/components/Callout";

export const metadata: Metadata = { title: "deprecated_api signal" };

export default function Page() {
  return (
    <article className="prose-doc">
      <SignalCard
        name="deprecated_api"
        severity="warning"
        summary="Query used deprecated database methods"
        detail="Deprecated database API detected. May cause compatibility issues in future database versions and often indicates missed migration opportunities."
        causes={[
          "Using deprecated ORM methods",
          "Legacy query patterns not updated",
          "Old driver API versions",
        ]}
        fixes={[
          "Update to current API per migration guide",
          "Check changelog for replacement methods",
          "Test thoroughly after migration",
        ]}
      />

      <h2>Example</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — deprecated MongoDB method
await collection.count({ active: true }); // deprecated

// GOOD — current equivalent
await collection.countDocuments({ active: true });`}
      />
      <Callout type="warning" title="Check your driver version">
        Deprecated APIs often still work for years but break on major version
        bumps. Fix them before upgrading your database driver, not after.
      </Callout>

      <h2>Common Mongoose deprecations</h2>
      <CodeBlock
        language="typescript"
        code={`// BAD — deprecated methods
await Model.count({ active: true });          // use countDocuments()
await Model.findById(id).exec();             // .exec() optional since Mongoose 7
mongoose.connect(uri, { useNewUrlParser: true }); // options removed in Mongoose 7

// GOOD
await Model.countDocuments({ active: true });
await Model.findById(id);
mongoose.connect(uri);`}
      />
    </article>
  );
}
