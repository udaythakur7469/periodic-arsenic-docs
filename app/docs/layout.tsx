import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TableOfContents } from "@/components/TableOfContents";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar />
        {/* Main content + TOC wrapper */}
        <div className="flex-1 min-w-0 lg:pl-64">
          <div className="max-w-[1100px] mx-auto flex gap-10 px-4 sm:px-8 py-10 pb-24">
            {/* Article column */}
            <main id="main-content" className="flex-1 min-w-0 max-w-[780px]">
              <Breadcrumbs />
              {children}
            </main>
            {/* TOC column — hidden below xl */}
            <TableOfContents />
          </div>
        </div>
      </div>
    </>
  );
}
