import library from "./motion-presets.json";

export type MotionFamily =
  | "reveal"
  | "stagger"
  | "feedback"
  | "spring"
  | "layout"
  | "shared"
  | "presence"
  | "expand"
  | "path"
  | "morph"
  | "orbit"
  | "depth"
  | "clip"
  | "gradient"
  | "line"
  | "chart"
  | "counter"
  | "text"
  | "timeline"
  | "follow"
  | "drag"
  | "scroll"
  | "loading"
  | "accordion";
export type MotionPreset = {
  id: string;
  name: string;
  family: MotionFamily;
  variant: number;
  duration: number;
  distance: number;
  stagger: number;
  stiffness: number;
  damping: number;
  purpose: string;
  tags: string[];
};
export const motionPresets = library.presets as MotionPreset[];
export const motionFamilies = library.families;
export function findPresets(query = "", family = "all") {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return motionPresets.filter(
    (preset) =>
      (family === "all" || preset.family === family) &&
      terms.every((term) =>
        `${preset.name} ${preset.id} ${preset.tags.join(" ")}`
          .toLowerCase()
          .includes(term),
      ),
  );
}
export function presetSource(preset: MotionPreset) {
  const family = motionFamilies.find((item) => item.id === preset.family)!;
  return JSON.stringify(
    {
      preset,
      contract: family,
      usage:
        "<MotionPresetPlayer preset={preset} reducedMotion={prefersReducedMotion} />",
    },
    null,
    2,
  );
}
