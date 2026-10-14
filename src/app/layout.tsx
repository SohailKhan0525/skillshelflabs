import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillShelf Labs | Next-Gen Engineering & AI Product Studio",
  description:
    "Where ambitious learners, builders, and engineers forge production-grade software, AI systems, and interactive web experiences.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} antialiased bg-[#050508] text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
