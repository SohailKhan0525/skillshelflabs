"use client";

import { useId } from "react";
import { motion } from "motion/react";
import { finishes, type LightSelection } from "../../lib/still-light";

type Props = {
  selection: LightSelection;
  reducedMotion: boolean;
  playing?: boolean;
  run?: number;
};

/** Original SVG product scene, animated with Motion.dev. State always wins over playback. */
export default function LampScene({
  selection,
  reducedMotion,
  playing = false,
  run = 0,
}: Props) {
  const id = useId().replace(/:/g, "");
  const finish = finishes.find((item) => item.id === selection.finish)!;
  const angle = selection.mood === "reading" ? -8 : 8;
  const intensity = selection.lightOn ? selection.brightness / 100 : 0;
  const choreograph = playing && !reducedMotion;
  const lightTransition = {
    duration: reducedMotion ? 0 : choreograph ? 4 : 0.25,
    ease: "easeInOut" as const,
  };
  const colorTransition = { duration: reducedMotion ? 0 : 0.45 };

  return (
    <svg
      className="still-lamp"
      data-scene-playing={choreograph}
      data-scene-run={run}
      viewBox="0 0 680 650"
      role="img"
      aria-labelledby={`${id}-title ${id}-desc`}
    >
      <title id={`${id}-title`}>{`Arc 01 in ${finish.name}`}</title>
      <desc id={`${id}-desc`}>
        A sculptural desk lamp with a rounded shade, curved stem, and circular
        base.{" "}
        {selection.lightOn
          ? `The light is on at ${selection.brightness} percent.`
          : "The light is off."}{" "}
        The shade is angled for {selection.mood}.
      </desc>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" x2="1" y1="0.15" y2="0.5">
          <motion.stop
            offset="0"
            initial={false}
            animate={{ stopColor: finish.dark }}
            transition={colorTransition}
          />
          <motion.stop
            offset="0.22"
            initial={false}
            animate={{ stopColor: finish.color }}
            transition={colorTransition}
          />
          <motion.stop
            offset="0.55"
            initial={false}
            animate={{ stopColor: finish.light }}
            transition={colorTransition}
          />
          <motion.stop
            offset="0.83"
            initial={false}
            animate={{ stopColor: finish.color }}
            transition={colorTransition}
          />
          <motion.stop
            offset="1"
            initial={false}
            animate={{ stopColor: finish.dark }}
            transition={colorTransition}
          />
        </linearGradient>
        <linearGradient id={`${id}-shade`} x1="0.1" x2="0.9" y1="0" y2="0.8">
          <motion.stop
            offset="0"
            initial={false}
            animate={{ stopColor: finish.light }}
            transition={colorTransition}
          />
          <motion.stop
            offset="0.5"
            initial={false}
            animate={{ stopColor: finish.color }}
            transition={colorTransition}
          />
          <motion.stop
            offset="1"
            initial={false}
            animate={{ stopColor: finish.dark }}
            transition={colorTransition}
          />
        </linearGradient>
        <linearGradient id={`${id}-beam`} x1="0" x2="0" y1="0" y2="1">
          <stop stopColor="#ffecb8" stopOpacity="0.65" />
          <stop offset="1" stopColor="#fff0c3" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-pool`}>
          <stop stopColor="#ffe5a3" stopOpacity="0.8" />
          <stop offset="1" stopColor="#ffe5a3" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-plinth`} x1="0" x2="1">
          <stop stopColor="#d7cdb9" />
          <stop offset="0.45" stopColor="#eee5d4" />
          <stop offset="1" stopColor="#cbbda3" />
        </linearGradient>
        <linearGradient id={`${id}-paper`} x1="0" x2="1">
          <stop stopColor="#f8f4e8" />
          <stop offset="1" stopColor="#e5ddca" />
        </linearGradient>
      </defs>

      {/* A sunlit wall and shelf establish the scale and setting of the object. */}
      <motion.path
        key={`window-${run}`}
        d="M0 0H190L550 650H0Z"
        fill="#fffdf3"
        initial={reducedMotion ? false : { x: 0, opacity: 0.18 }}
        animate={{
          x: choreograph ? [0, 38, -15, 0] : 0,
          opacity: choreograph ? [0.18, 0.36, 0.22, 0.18] : 0.18,
        }}
        transition={{ duration: reducedMotion ? 0 : 4, ease: "easeInOut" }}
      />
      <path
        d="M0 115 301 650M0 280 202 650"
        stroke="#fdf9eb"
        strokeWidth="17"
        opacity="0.25"
      />
      <ellipse
        cx="383"
        cy="604"
        rx="194"
        ry="24"
        fill="#80735b"
        opacity="0.1"
      />
      <path
        d="M210 553C210 509 567 509 567 553V650H210Z"
        fill={`url(#${id}-plinth)`}
      />
      <ellipse cx="388.5" cy="553" rx="178.5" ry="39" fill="#e9deca" />
      <motion.ellipse
        key={`pool-${run}`}
        initial={reducedMotion ? false : { opacity: intensity, cx: 322 }}
        animate={{
          opacity: choreograph
            ? [intensity, intensity * 0.35, intensity, intensity]
            : intensity,
          cx: choreograph ? [322, 372, 284, 322] : 322,
        }}
        transition={lightTransition}
        data-light-pool
        cx="322"
        cy="551"
        rx="154"
        ry="32"
        fill={`url(#${id}-pool)`}
      />

      {/* A book and loop of cable give the illustration a human, everyday scale. */}
      <g transform="translate(466 530) scale(0.6) rotate(-8)">
        <path d="M0 0 123-12 151 18 24 31Z" fill="#6b7560" />
        <path d="m24 31 127-13v13L24 45Z" fill={`url(#${id}-paper)`} />
        <path d="M0 0 24 31v14L0 12Z" fill="#46563e" />
        <path
          d="m27 35 119-13M27 39l119-13"
          stroke="#c3b9a0"
          strokeWidth="0.8"
        />
      </g>
      <path
        d="M418 566C486 575 478 610 547 610S584 638 641 646"
        fill="none"
        stroke="#3f4233"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <ellipse
        cx="362"
        cy="564"
        rx="102"
        ry="24"
        fill="#64513b"
        opacity="0.19"
      />

      {/* Stem sits behind the adjustable shade. */}
      <path
        d="M404 544V249C404 179 325 181 325 248"
        fill="none"
        stroke={finish.dark}
        strokeWidth="22"
        strokeLinecap="round"
      />
      <path
        d="M400 540V248C400 184 325 184 325 248"
        fill="none"
        stroke={`url(#${id}-body)`}
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M269 544C269 520 448 520 448 544V558C448 588 269 588 269 558Z"
        fill={`url(#${id}-body)`}
      />
      <ellipse cx="358.5" cy="544" rx="89.5" ry="22" fill={finish.color} />
      <ellipse cx="358.5" cy="540" rx="86" ry="18" fill={`url(#${id}-shade)`} />
      <ellipse
        cx="399"
        cy="542"
        rx="14"
        ry="5"
        fill={finish.dark}
        opacity="0.65"
      />
      <ellipse cx="316" cy="544" rx="10" ry="4" fill="#cbb48b" />
      <path d="M307 541v5c0 6 18 6 18 0v-5" fill="#b39a72" />
      <ellipse cx="316" cy="541" rx="9" ry="4" fill="#e8d6b2" />
      <path d="M316 537v5" stroke="#76654d" strokeWidth="1.5" />

      <motion.g
        key={`shade-${run}`}
        data-shade
        data-target-angle={angle}
        initial={reducedMotion ? false : { rotate: angle }}
        style={{ transformOrigin: "325px 250px", transformBox: "view-box" }}
        animate={{
          rotate: choreograph ? [angle, angle + 23, angle - 12, angle] : angle,
        }}
        transition={{
          duration: reducedMotion ? 0 : choreograph ? 4 : 0.55,
          ease: "easeInOut",
        }}
      >
        <motion.path
          initial={reducedMotion ? false : { opacity: intensity }}
          animate={{
            opacity: choreograph
              ? [intensity, intensity * 0.35, intensity, intensity]
              : intensity,
          }}
          transition={lightTransition}
          data-light
          d="M218 330 143 544Q325 584 510 544L432 330Z"
          fill={`url(#${id}-beam)`}
        />
        <path
          d="M214 327C214 205 436 205 436 327L435 333C413 357 235 357 215 333Z"
          fill={`url(#${id}-shade)`}
        />
        <path
          d="M232 288C251 226 351 213 392 254"
          fill="none"
          stroke={finish.light}
          opacity="0.4"
          strokeWidth="2"
        />
        <ellipse cx="325" cy="331" rx="110" ry="21" fill={finish.dark} />
        <ellipse cx="325" cy="331" rx="103" ry="16.5" fill="#e9d3a1" />
        <ellipse
          cx="325"
          cy="329"
          rx="63"
          ry="9"
          fill={selection.lightOn ? "#fff6d7" : "#c8b98f"}
        />
        <path
          d="M216 328c42 20 172 20 218 0"
          fill="none"
          stroke={finish.light}
          strokeWidth="2"
          opacity="0.6"
        />
      </motion.g>
    </svg>
  );
}
