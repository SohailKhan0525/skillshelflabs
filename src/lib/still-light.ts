export const finishes = [
  {
    id: "clay",
    name: "Terracotta",
    color: "#b75538",
    light: "#da8966",
    dark: "#743724",
    description: "A little warmth, even when the light is off.",
  },
  {
    id: "moss",
    name: "Moss",
    color: "#58684b",
    light: "#93a17f",
    dark: "#303d2c",
    description: "A grounded green that makes itself at home.",
  },
  {
    id: "chalk",
    name: "Chalk",
    color: "#d8cdb6",
    light: "#f2eadb",
    dark: "#a2967b",
    description: "Soft, understated, and quietly full of character.",
  },
] as const;

export type FinishId = (typeof finishes)[number]["id"];
export type LightMood = "reading" | "unwinding";
export type LightSelection = {
  finish: FinishId;
  brightness: number;
  lightOn: boolean;
  mood: LightMood;
};
export const initialLight: LightSelection = {
  finish: "clay",
  brightness: 75,
  lightOn: true,
  mood: "reading",
};

export function chooseMood(
  selection: LightSelection,
  mood: LightMood,
): LightSelection {
  return {
    ...selection,
    mood,
    brightness: mood === "reading" ? 75 : 35,
    lightOn: true,
  };
}

export function selectionDescription(selection: LightSelection) {
  const finish = finishes.find((item) => item.id === selection.finish)!;
  return `Arc 01 in ${finish.name} · ${selection.lightOn ? `${selection.brightness}% light` : "light off"} · ${selection.mood === "reading" ? "Reading" : "Unwinding"}`;
}
