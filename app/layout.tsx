import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkillShelf — Discover AI skills",
  description: "Discover, understand, and share AI skills with beautiful dedicated pages.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
