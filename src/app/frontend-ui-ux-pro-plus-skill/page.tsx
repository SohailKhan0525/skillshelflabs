import type { Metadata } from "next";
import StillExperience from "@/components/still/StillExperience";
import styles from "./still.module.css";
import "@/components/motion-library/motion-library.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://skillshelflabs.vercel.app"),
  title: "Still — A little light. A different feeling.",
  description:
    "Meet Arc 01, an interactive lighting concept. Explore three considered finishes and find your own little bright spot. A Frontend UI UX Pro Plus demonstration.",
  alternates: { canonical: "/frontend-ui-ux-pro-plus-skill" },
  icons: { icon: "/still-icon.svg" },
  openGraph: {
    title: "Still — A little light. A different feeling.",
    description: "An interactive lighting design study by SkillShelf Labs.",
    type: "website",
  },
};

export default function StillPage() {
  return <StillExperience className={styles.page} />;
}
