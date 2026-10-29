import type { Metadata } from "next";
import "@fontsource-variable/manrope";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minto — One click. Zero friction.",
  description: "An interactive wallet connection concept. Hand-crafted vector illustrations, effortless motion, and a little keyboard you can play with.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
