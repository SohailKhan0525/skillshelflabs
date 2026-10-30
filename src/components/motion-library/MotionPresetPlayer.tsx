"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  animate,
  motion,
  useAnimate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";
import type { MotionPreset } from "./presets";

export type MotionPresetPlayerProps = {
  preset: MotionPreset;
  reducedMotion: boolean;
};
const ease = [0.2, 0.8, 0.2, 1] as const;
const paths = [
  "M25 70L52 96L116 30",
  "M70 20A50 50 0 1 1 69.9 20",
  "M25 95Q70 5 115 95",
  "M15 70Q40 15 65 70T125 70",
  "M70 15L125 70L70 125L15 70Z",
  "M20 70H120M85 35L120 70L85 105",
  "M30 70C30 5 110 5 110 70S30 135 30 70",
  "M25 25H115V115H25Z",
  "M15 110L52 35L75 80L95 50L125 110",
  "M15 80H38L50 35L65 105L80 55L94 80H125",
];
const shapes = [
  "M70 15C105 15 125 40 125 70C125 105 105 125 70 125C35 125 15 105 15 70C15 35 35 15 70 15Z",
  "M70 10C102 25 112 40 110 70C125 108 90 130 70 120C40 138 8 100 25 70C12 37 45 25 70 10Z",
  "M70 30C105 30 130 45 130 70C130 95 105 110 70 110C35 110 10 95 10 70C10 45 35 30 70 30Z",
  "M70 5C88 25 110 40 110 70C110 100 92 135 70 135C48 135 30 100 30 70C30 40 52 25 70 5Z",
  "M70 12C90 32 110 50 128 70C110 90 90 110 70 128C50 110 30 90 12 70C30 50 50 30 70 12Z",
  "M70 20C120 0 140 50 110 70C140 120 90 140 70 110C20 140 0 90 30 70C0 20 50 0 70 20Z",
];

function Counter({ preset, reducedMotion }: MotionPresetPlayerProps) {
  const target = [12, 20, 50, 100, 0, 8, 240, 72, 85, 100][preset.variant];
  const start = preset.variant === 4 ? 100 : 0;
  const value = useMotionValue(reducedMotion ? target : start);
  const display = useRef<HTMLSpanElement>(null);
  useMotionValueEvent(value, "change", (latest) => {
    if (display.current)
      display.current.textContent = String(Math.round(latest));
  });
  useEffect(() => {
    if (reducedMotion) {
      value.set(target);
      return;
    }
    const playback = animate(value, target, {
      duration: preset.duration + 0.7,
      ease,
    });
    return () => playback.stop();
  }, [value, target, reducedMotion, preset.duration]);
  return (
    <div className="mp-counter">
      <span className="mp-sr-only">Demonstration final value: {target}</span>
      <span ref={display} aria-hidden="true">
        {reducedMotion ? target : start}
      </span>
      <small>Illustrative value</small>
    </div>
  );
}

function Timeline({ preset, reducedMotion }: MotionPresetPlayerProps) {
  const [scope, run] = useAnimate();
  useEffect(() => {
    if (reducedMotion) return;
    const duration = preset.duration;
    const playback = run([
      [
        ".mp-sequence-dot",
        { scale: [0.5, 1], opacity: [0.4, 1] },
        { duration: duration * 0.6 },
      ],
      [
        ".mp-sequence-line",
        { scaleX: [0, 1] },
        { duration, at: preset.variant % 3 === 0 ? "<" : undefined },
      ],
      [
        ".mp-sequence-end",
        { scale: [0.7, 1], opacity: [0.3, 1] },
        { duration: duration * 0.6 },
      ],
    ]);
    return () => playback.stop();
  }, [run, preset.duration, preset.variant, reducedMotion]);
  return (
    <div
      ref={scope}
      className="mp-sequence"
      aria-label="A three-stage demonstration: start, connect, complete"
      role="img"
    >
      <span className="mp-sequence-dot" />
      <span className="mp-sequence-line" />
      <span className="mp-sequence-end" />
    </div>
  );
}

function Follow({ preset, reducedMotion }: MotionPresetPlayerProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, {
    stiffness: preset.stiffness,
    damping: preset.damping,
  });
  const sy = useSpring(y, {
    stiffness: preset.stiffness,
    damping: preset.damping,
  });
  const limit = preset.distance + preset.variant * 2;
  return (
    <div className="mp-direct">
      <div
        className="mp-field"
        onPointerMove={(event) => {
          if (event.pointerType !== "mouse") return;
          const bounds = event.currentTarget.getBoundingClientRect();
          x.set(
            Math.max(
              -limit,
              Math.min(
                limit,
                (event.clientX - bounds.left - bounds.width / 2) * 0.4,
              ),
            ),
          );
          y.set(
            preset.variant === 1
              ? 0
              : Math.max(
                  -limit,
                  Math.min(
                    limit,
                    (event.clientY - bounds.top - bounds.height / 2) * 0.4,
                  ),
                ),
          );
        }}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
        }}
      >
        <motion.div
          className="mp-orb"
          style={{ x: reducedMotion ? x : sx, y: reducedMotion ? y : sy }}
        />
      </div>
      <div className="mp-control-row">
        <button
          type="button"
          onClick={() => x.set(Math.max(-limit, x.get() - 12))}
        >
          Move left
        </button>
        <button
          type="button"
          onClick={() => {
            x.set(0);
            y.set(0);
          }}
        >
          Center
        </button>
        <button
          type="button"
          onClick={() => x.set(Math.min(limit, x.get() + 12))}
        >
          Move right
        </button>
      </div>
    </div>
  );
}

function Drag({ preset, reducedMotion }: MotionPresetPlayerProps) {
  const bounds = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const limit = preset.distance + 18 + preset.variant * 2;
  const direction =
    preset.variant === 1 || preset.variant === 9
      ? "y"
      : preset.variant === 2 || preset.variant === 5
        ? true
        : "x";
  function move(delta: number) {
    const value = direction === "y" ? y : x;
    value.set(Math.max(-limit, Math.min(limit, value.get() + delta)));
  }
  return (
    <div className="mp-direct">
      <div className="mp-field mp-drag-field" ref={bounds}>
        <motion.div
          className="mp-orb"
          drag={direction}
          dragConstraints={{
            left: direction === "y" ? 0 : -limit,
            right: direction === "y" ? 0 : limit,
            top: direction === "x" ? 0 : -limit,
            bottom: direction === "x" ? 0 : limit,
          }}
          dragMomentum={false}
          dragElastic={reducedMotion ? 0 : 0.02 + preset.variant * 0.01}
          style={{
            x,
            y,
            touchAction:
              direction === "x"
                ? "pan-y"
                : direction === "y"
                  ? "pan-x"
                  : "none",
          }}
        />
      </div>
      <div className="mp-control-row">
        <button type="button" onClick={() => move(-15)}>
          {direction === "y" ? "Move up" : "Move left"}
        </button>
        <button
          type="button"
          onClick={() => {
            x.set(0);
            y.set(0);
          }}
        >
          Reset
        </button>
        <button type="button" onClick={() => move(15)}>
          {direction === "y" ? "Move down" : "Move right"}
        </button>
      </div>
    </div>
  );
}

function Scroll({ preset, reducedMotion }: MotionPresetPlayerProps) {
  const container = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLProgressElement>(null);
  const { scrollYProgress } = useScroll({ container });
  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (progress.current) progress.current.value = value;
  });
  return (
    <div className="mp-scroll-demo">
      <progress
        ref={progress}
        value="0"
        max="1"
        aria-label="Reading progress"
      />
      {!reducedMotion && (
        <motion.div
          className="mp-scroll-rail"
          style={{ scaleX: scrollYProgress }}
        />
      )}
      <div
        className="mp-scroll-area"
        style={{ height: 130 + preset.variant * 4 }}
        ref={container}
        tabIndex={0}
        aria-label="Scrollable demonstration. Use arrow keys or scroll."
      >
        <p>Scroll this small reading area.</p>
        {Array.from({ length: 4 + (preset.variant % 3) }, (_, i) => (
          <p key={i}>
            Chapter {i + 1}
            <br />
            <span>
              The progress indicator follows your position. Native scrolling
              stays in control.
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}

/** Mount with key={preset.id + replay} to replay. One active player is recommended. */
export default function MotionPresetPlayer({
  preset: p,
  reducedMotion: reduced,
}: MotionPresetPlayerProps) {
  const id = useId();
  const [changed, setChanged] = useState(reduced);
  const [choice, setChoice] = useState(reduced ? 2 : 0);
  const phaseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  function stopAutoplay() {
    if (phaseTimer.current) clearTimeout(phaseTimer.current);
  }
  useEffect(() => {
    if (reduced) {
      setChanged(true);
      setChoice(2);
      return;
    }
    phaseTimer.current = setTimeout(() => {
      setChanged(true);
      setChoice(2);
    }, 450);
    return stopAutoplay;
  }, [reduced]);
  const i = p.variant;
  const duration = reduced ? 0 : p.duration;
  const transition = { duration, ease };
  const spring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: p.stiffness, damping: p.damping };
  const final = { x: 0, y: 0, scale: 1, opacity: 1, rotate: 0, rotateY: 0 };
  const origins = [
    { opacity: 0.1 },
    { y: p.distance },
    { y: -p.distance },
    { x: -p.distance },
    { x: p.distance },
    { scale: 0.6 },
    { scale: 1.25 },
    { rotate: -20, scale: 0.85 },
    { rotateY: 70 },
    { x: -p.distance, y: p.distance },
  ];
  const toggle = (
    <button
      className="mp-change"
      type="button"
      onClick={() => {
        stopAutoplay();
        setChanged((current) => !current);
      }}
    >
      Change state
    </button>
  );
  let content: React.ReactNode;
  switch (p.family) {
    case "reveal":
      content = (
        <motion.div
          className="mp-sample"
          initial={reduced ? false : origins[i]}
          animate={final}
          transition={transition}
        >
          Hello, motion.
        </motion.div>
      );
      break;
    case "stagger":
      content = (
        <div className="mp-tiles">
          {Array.from({ length: 5 }, (_, n) => {
            const order =
              i === 1
                ? 4 - n
                : i === 2
                  ? Math.abs(n - 2)
                  : i === 3
                    ? 2 - Math.abs(n - 2)
                    : n;
            return (
              <motion.span
                key={n}
                initial={
                  reduced
                    ? false
                    : {
                        y:
                          i === 6 || (i === 4 && n % 2 === 0)
                            ? -p.distance
                            : p.distance,
                        scale: i === 8 ? 0.5 : 1,
                        x: i === 7 ? -12 : 0,
                      }
                }
                animate={{ x: 0, y: 0, scale: 1 }}
                transition={{
                  ...transition,
                  delay: reduced ? 0 : order * p.stagger,
                }}
              >
                {n + 1}
              </motion.span>
            );
          })}
        </div>
      );
      break;
    case "feedback":
      content = (
        <motion.button
          className="mp-demo-button"
          type="button"
          whileHover={
            reduced
              ? undefined
              : { y: i === 2 ? -8 : -3, rotate: i === 3 ? -4 : 0 }
          }
          whileTap={
            reduced
              ? undefined
              : {
                  scale: i === 1 ? 0.9 : 0.96,
                  scaleX: i === 5 ? 1.08 : 1,
                  scaleY: i === 6 ? 0.88 : 1,
                }
          }
          transition={spring}
          onClick={() => {
            stopAutoplay();
            setChanged((value) => !value);
          }}
        >
          {changed ? "Press again" : "Try this button"}
          <motion.span
            animate={{ x: changed && !reduced ? 5 : 0 }}
            transition={spring}
          >
            →
          </motion.span>
        </motion.button>
      );
      break;
    case "spring":
      content = (
        <motion.div
          className="mp-orb"
          initial={reduced ? false : { x: -(p.distance + i) * 2 }}
          animate={{ x: changed ? p.distance + i * 2 : -p.distance }}
          transition={spring}
        />
      );
      break;
    case "layout":
      content = (
        <>
          <motion.div
            className={`mp-layout ${changed ? "mp-layout-changed" : ""}`}
            style={{
              gridTemplateColumns: changed
                ? i % 3 === 0
                  ? "repeat(3, 1fr)"
                  : i % 3 === 1
                    ? "1fr"
                    : "2fr 1fr"
                : "repeat(2, 1fr)",
            }}
          >
            {[1, 2, 3, 4].map((n) => (
              <motion.span
                key={n}
                layout={!reduced}
                transition={spring}
                style={{ minHeight: changed && i === 2 ? 36 : 24 }}
              >
                {n}
              </motion.span>
            ))}
          </motion.div>
          {toggle}
        </>
      );
      break;
    case "shared":
      content = (
        <LayoutGroup id={id}>
          <div className={`mp-segments mp-segments-${i % 3}`}>
            {[0, 1, 2].map((n) => (
              <button
                key={n}
                type="button"
                aria-pressed={choice === n}
                onClick={() => {
                  stopAutoplay();
                  setChoice(n);
                }}
              >
                {choice === n && (
                  <motion.span
                    className="mp-selection"
                    layoutId="selection"
                    transition={spring}
                  />
                )}
                <span>{["First", "Second", "Third"][n]}</span>
              </button>
            ))}
          </div>
          <button
            className="mp-change"
            type="button"
            onClick={() => {
              stopAutoplay();
              setChoice((current) => (current + 1) % 3);
            }}
          >
            Next selection
          </button>
        </LayoutGroup>
      );
      break;
    case "presence":
      content = (
        <>
          <div className="mp-presence">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                className="mp-sample"
                key={String(changed)}
                initial={reduced ? false : origins[i]}
                animate={final}
                exit={reduced ? undefined : { opacity: 0, y: i % 2 ? -12 : 12 }}
                transition={transition}
              >
                {changed ? "A new chapter" : "The beginning"}
              </motion.span>
            </AnimatePresence>
          </div>
          {toggle}
        </>
      );
      break;
    case "expand":
      content = (
        <div className="mp-disclosure">
          <button
            type="button"
            aria-expanded={changed}
            aria-controls={`${id}-answer`}
            onClick={() => {
              stopAutoplay();
              setChanged((value) => !value);
            }}
          >
            A little more detail{" "}
            <motion.span
              animate={{ rotate: changed && !reduced ? 45 : 0 }}
              transition={transition}
            >
              +
            </motion.span>
          </button>
          <motion.div
            id={`${id}-answer`}
            initial={false}
            animate={{ height: changed ? "auto" : 0, opacity: changed ? 1 : 0 }}
            transition={transition}
            inert={!changed}
          >
            <p>
              {i % 2
                ? "Keep the next step clear. Let motion explain what changed."
                : "Useful content, revealed at your pace. The control stays right here."}
            </p>
          </motion.div>
        </div>
      );
      break;
    case "accordion":
      content = (
        <div className="mp-disclosure">
          <button
            type="button"
            aria-expanded={changed}
            aria-controls={`${id}-answer`}
            onClick={() => {
              stopAutoplay();
              setChanged((value) => !value);
            }}
          >
            A little more detail{" "}
            <span aria-hidden="true">{changed ? "−" : "+"}</span>
          </button>
          <div id={`${id}-answer`} inert={!changed}>
            <AnimatePresence initial={false}>
              {changed && (
                <motion.div
                  key="answer"
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    ...transition,
                    duration: reduced ? 0 : p.duration + i * 0.025,
                  }}
                >
                  <p>
                    {i % 2
                      ? "Keep the next step clear. Let motion explain what changed."
                      : "Useful content, revealed at your pace. The control stays right here."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      );
      break;
    case "path":
      content = (
        <svg
          className="mp-svg"
          viewBox="0 0 140 140"
          role="img"
          aria-label={p.name}
        >
          <motion.path
            d={paths[i]}
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{
              ...transition,
              duration: reduced ? 0 : p.duration + 0.55,
            }}
          />
        </svg>
      );
      break;
    case "morph":
      content = (
        <svg
          className="mp-svg"
          viewBox="0 0 140 140"
          role="img"
          aria-label={p.name}
        >
          <motion.path
            fill="currentColor"
            initial={reduced ? false : { d: shapes[i % shapes.length] }}
            animate={{
              d: reduced
                ? shapes[(i + 2) % shapes.length]
                : [
                    shapes[i % shapes.length],
                    shapes[(i + 2) % shapes.length],
                    shapes[i % shapes.length],
                  ],
            }}
            transition={{ duration: reduced ? 0 : p.duration + 1, ease }}
          />
        </svg>
      );
      break;
    case "orbit":
      content = (
        <div className="mp-orbit">
          <span className="mp-orbit-center" />
          <motion.div
            className="mp-orbit-track"
            animate={{
              rotate: reduced
                ? 0
                : [
                    0,
                    i === 6
                      ? -360
                      : i === 7
                        ? 180
                        : i === 8
                          ? 90
                          : i === 9
                            ? 45
                            : 360,
                  ],
            }}
            transition={{
              duration: reduced ? 0 : 1.6 + p.duration + i * 0.1,
              ease: "easeInOut",
            }}
          >
            {Array.from({ length: 1 + (i % 4) }, (_, n) => (
              <span
                key={n}
                style={{
                  transform: `rotate(${(n * 360) / (1 + (i % 4))}deg) translateY(-${42 + i * 1.5}px)`,
                }}
              />
            ))}
          </motion.div>
        </div>
      );
      break;
    case "depth":
      content = (
        <div className="mp-perspective">
          <motion.div
            className="mp-depth-card"
            initial={reduced ? false : { rotateX: 0, rotateY: 0 }}
            animate={
              reduced
                ? { rotateX: 0, rotateY: 0 }
                : {
                    rotateY: [0, i % 2 ? -p.distance : p.distance, 0],
                    rotateX: [0, i > 3 ? 16 : -8, 0],
                  }
            }
            transition={{ duration: p.duration + 1.2, ease }}
          >
            <span>STUDIO</span>
            <strong>01</strong>
            <span>A different angle</span>
          </motion.div>
        </div>
      );
      break;
    case "clip": {
      const masks = [
        "inset(0 100% 0 0)",
        "inset(0 0 0 100%)",
        "inset(0 0 100% 0)",
        "inset(100% 0 0 0)",
        "inset(45% 45% 45% 45%)",
        "inset(49% 0 49% 0)",
        "inset(0 49% 0 49%)",
        "inset(0 100% 100% 0)",
        "circle(0% at 50% 50%)",
        "polygon(0 0,0 0,0 100%,0 100%)",
      ];
      const end =
        i === 8
          ? "circle(75% at 50% 50%)"
          : i === 9
            ? "polygon(0 0,100% 0,100% 100%,0 100%)"
            : "inset(0 0 0 0)";
      content = (
        <motion.div
          className="mp-art-surface"
          initial={reduced ? false : { clipPath: masks[i] }}
          animate={{ clipPath: end }}
          transition={{
            ...transition,
            duration: reduced ? 0 : p.duration + 0.4,
          }}
        >
          <span>
            FORM
            <br />
            <em>& feeling.</em>
          </span>
        </motion.div>
      );
      break;
    }
    case "gradient":
      content = (
        <motion.div
          className="mp-art-surface mp-gradient"
          style={{
            backgroundImage: `linear-gradient(${110 + i * 8}deg,${["#b75538,#eed5b7,#9ba98b", "#293e30,#bac5a5,#d8a57c", "#354b38,#c4cfaa,#899f74", "#a64b37,#e4ba9b,#c77e55", "#213443,#aebdc4,#5e6b75", "#b47d3a,#f0dab5,#b35f35", "#405a63,#b7d0c9,#758f9c", "#b39e78,#eddfbf,#8f7b55", "#324c3b,#b8c39c,#66845b", "#a56970,#ecced0,#b8918a"][i]})`,
            backgroundSize: "300% 300%",
          }}
          animate={{
            backgroundPosition: reduced
              ? "50% 50%"
              : ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: reduced ? 0 : 2 + p.duration,
            ease: "easeInOut",
          }}
        >
          <span>
            Color
            <br />
            <em>in motion.</em>
          </span>
        </motion.div>
      );
      break;
    case "line":
      content = (
        <div className="mp-rule-demo">
          <strong>A considered detail.</strong>
          {Array.from({ length: i > 6 ? 2 : 1 }, (_, n) => (
            <motion.span
              key={n}
              style={{
                transformOrigin:
                  i === 4
                    ? "bottom"
                    : i === 3
                      ? "top"
                      : i === 1
                        ? "right"
                        : i === 2
                          ? "center"
                          : "left",
                width: i === 3 || i === 4 ? 3 : i === 5 ? "45%" : "100%",
                height: i === 3 || i === 4 ? 80 : 3,
              }}
              initial={
                reduced
                  ? false
                  : i === 3 || i === 4
                    ? { scaleY: 0 }
                    : { scaleX: 0 }
              }
              animate={{ scaleX: 1, scaleY: 1 }}
              transition={{ ...transition, delay: reduced ? 0 : n * p.stagger }}
            />
          ))}
        </div>
      );
      break;
    case "chart":
      content = (
        <div>
          <div
            className="mp-bars"
            role="img"
            aria-label="Illustrative comparison values 35, 65, 45, 90, and 70"
          >
            <span className="mp-sr-only">35, 65, 45, 90, 70</span>
            {[35, 65, 45, 90, 70].map((height, n) => (
              <motion.span
                key={n}
                style={{ height, transformOrigin: "bottom" }}
                initial={reduced ? false : { scaleY: i === 6 ? 0.8 : 0 }}
                animate={{ scaleY: 1 }}
                transition={{
                  ...transition,
                  delay:
                    reduced || i === 0
                      ? 0
                      : (i === 2 ? 4 - n : i === 3 ? Math.abs(n - 2) : n) *
                        p.stagger,
                }}
              />
            ))}
          </div>
          <small className="mp-caption">
            Illustrative data · no live analytics
          </small>
        </div>
      );
      break;
    case "counter":
      content = <Counter preset={p} reducedMotion={reduced} />;
      break;
    case "text":
      content = (
        <div
          className="mp-kinetic"
          role="img"
          aria-label="Make room for motion"
        >
          <span aria-hidden="true">
            {["Make", "room", "for", "motion."].map((word, n) => (
              <motion.span
                key={word}
                initial={reduced ? false : { y: 0, rotate: 0, scale: 1 }}
                animate={
                  reduced
                    ? { y: 0, rotate: 0, scale: 1 }
                    : {
                        y: [0, (n % 2 ? -1 : 1) * p.distance * 0.4, 0],
                        rotate: i === 6 ? [0, -8, 0] : 0,
                        scale: i === 7 ? [1, 1.12, 1] : 1,
                      }
                }
                transition={{
                  duration: p.duration + 0.6,
                  ease,
                  delay: reduced ? 0 : n * p.stagger,
                }}
              >
                {word}{" "}
              </motion.span>
            ))}
          </span>
        </div>
      );
      break;
    case "timeline":
      content = <Timeline preset={p} reducedMotion={reduced} />;
      break;
    case "follow":
      content = <Follow preset={p} reducedMotion={reduced} />;
      break;
    case "drag":
      content = <Drag preset={p} reducedMotion={reduced} />;
      break;
    case "scroll":
      content = <Scroll preset={p} reducedMotion={reduced} />;
      break;
    case "loading":
      content = (
        <div
          className="mp-skeleton"
          aria-label="Loading animation preview, not a network request"
          role="img"
        >
          {Array.from({ length: i === 2 ? 3 : 4 }, (_, n) => (
            <motion.span
              key={n}
              style={{
                width: i === 2 ? 14 : `${90 - (n % 2) * 28}%`,
                height: i === 2 ? 14 : 11,
                borderRadius: i === 2 ? 50 : 3,
              }}
              animate={{ opacity: reduced ? 0.7 : [0.3, 0.8, 0.3, 0.8] }}
              transition={{
                duration: reduced ? 0 : 1.2 + p.duration + i * 0.04,
                delay: reduced ? 0 : n * p.stagger,
                ease: "easeInOut",
              }}
            />
          ))}
          <small>Loading-state preview</small>
        </div>
      );
      break;
  }
  return (
    <div
      className="mp-player"
      data-motion-family={p.family}
      data-motion-reduced={reduced}
    >
      {content}
    </div>
  );
}
