import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s — @periodic/arsenic",
    default: "@periodic/arsenic — Semantic Runtime Monitoring for Node.js",
  },
  description:
    "Production-grade semantic runtime monitoring for Node.js. 30+ signals, zero dependencies, multi-database support.",
  metadataBase: new URL("https://arsenicdev.online"),
  openGraph: {
    type: "website",
    url: "https://arsenicdev.online",
    siteName: "@periodic/arsenic",
    title: "@periodic/arsenic — Semantic Runtime Monitoring for Node.js",
    description:
      "Production-grade semantic runtime monitoring for Node.js. 30+ signals, zero dependencies, request-correlated database observability.",
    images: [
      {
        url: "/og.png", // 1200×630px image — see note below
        width: 1200,
        height: 630,
        alt: "@periodic/arsenic — Semantic Runtime Monitoring",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "@periodic/arsenic — Semantic Runtime Monitoring",
    description:
      "Production-grade semantic runtime monitoring for Node.js. 30+ signals, zero dependencies.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,300;1,400&family=Roboto+Slab:wght@400;600;700;800;900&family=Roboto+Mono:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
