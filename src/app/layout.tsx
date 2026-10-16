import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qofeno | Security answers from your own evidence",
  description:
    "Prepare AI governance documents and answer security questionnaires using facts you provide. Template mode uses no AI and keeps data in your browser.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'"
        />
        <link rel="icon" type="image/svg+xml" href="/brand/qofeno-symbol.svg" />
      </head>
      <body>{children}</body>
    </html>
  );
}
