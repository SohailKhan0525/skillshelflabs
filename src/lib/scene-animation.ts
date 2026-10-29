import { gsap } from "gsap";
import { extruded, type Point } from "./keyboard-geometry";

export type SceneAnimation = ReturnType<typeof createSceneAnimation>;

/** Animate SVG attributes explicitly, preserving the illustration's projection matrices. */
export function createSceneAnimation(
  svg: SVGSVGElement,
  { reducedMotion = false } = {},
) {
  // Restore the exact baseline on replay/unmount; otherwise meter heights shrink each run.
  const attributes = [
    "transform",
    "opacity",
    "d",
    "y",
    "height",
    "stroke-dashoffset",
  ];
  const snapshots = Array.from(
    svg.querySelectorAll<SVGElement>("*"),
    (element) => ({
      element,
      values: attributes.map(
        (name) => [name, element.getAttribute(name)] as const,
      ),
    }),
  );
  const textSnapshots = Array.from(
    svg.querySelectorAll(".typed-first,.typed-second"),
    (element) => ({ element, text: element.textContent }),
  );
  const find = <T extends SVGElement = SVGElement>(selector: string): T => {
    const element = svg.querySelector<T>(selector);
    if (!element) throw new Error(`Missing illustration element: ${selector}`);
    return element;
  };
  const attr = (element: SVGElement, name: string, value: number | string) =>
    element.setAttribute(name, String(value));
  const move = (element: SVGElement, x: number, y: number) =>
    attr(element, "transform", `translate(${x.toFixed(3)} ${y.toFixed(3)})`);
  const keys = new Map(
    Array.from(
      svg.querySelectorAll<SVGGElement>(".physical-key"),
      (element) => {
        const points: Point[] = JSON.parse(element.dataset.topPoints!);
        const top = element.querySelector<SVGGElement>(".key-top")!;
        const side = element.querySelector<SVGPathElement>(".key-side")!;
        const shadow = element.querySelector<SVGPathElement>(".key-shadow")!;
        const highlight =
          element.querySelector<SVGPathElement>(".key-highlight")!;
        const automatic = { depth: 0 },
          manual = { depth: 0 };
        const draw = () => {
          const depth = Math.max(automatic.depth, manual.depth);
          move(top, 0, depth);
          attr(
            side,
            "d",
            extruded(
              points.map(([x, y]) => [x, y + depth]),
              20 - depth,
            ),
          );
          attr(shadow, "opacity", 0.1 - depth * 0.004);
          attr(highlight, "opacity", depth / 35);
        };
        draw();
        return [element.dataset.key!, { automatic, manual, draw }] as const;
      },
    ),
  );

  const main = gsap.timeline({ paused: true, repeat: -1 });
  const ambient = gsap.timeline({ paused: true, repeat: -1 });
  const cursor = find(".scene-cursor"),
    tooltip = find(".tooltip"),
    selection = find(".selection");
  const wallet = find(".wallet-assembly"),
    tile = find(".floating-tile");
  const signal = find(".signal-dot"),
    response = find(".screen-response");
  const firstLine = find(".typed-first"),
    secondLine = find(".typed-second");
  const position = { x: 660, y: 190 },
    tip = { opacity: 0 },
    selected = { opacity: 0 };
  const click = { depth: 0 },
    pulse = { opacity: 0 },
    text = { length: 0 };
  const message = "Connect your wallet at the speed of light.";
  const type = () => {
    const visible = message.slice(0, Math.round(text.length));
    firstLine.textContent = visible.slice(0, 26);
    secondLine.textContent = visible.slice(26);
  };
  move(cursor, position.x, position.y);
  attr(tooltip, "opacity", 0);
  attr(selection, "opacity", 0);
  type();

  function automaticPress(id: string, at: number, depth = 13) {
    const key = keys.get(id)!;
    main
      .to(
        key.automatic,
        { depth, duration: 0.13, ease: "power2.in", onUpdate: key.draw },
        at,
      )
      .to(
        key.automatic,
        { depth: 0, duration: 0.35, ease: "back.out(1.5)", onUpdate: key.draw },
        at + 0.15,
      );
  }

  if (!reducedMotion) {
    // A staggered mechanical key sequence is visible as soon as the page loads.
    [0, 1, 2, 3, 4].forEach((i) =>
      automaticPress(`letter-${i}`, 0.25 + i * 0.24),
    );
    main
      .to(
        position,
        {
          x: 620,
          y: 128,
          duration: 1.05,
          ease: "power2.inOut",
          onUpdate: () => move(cursor, position.x, position.y),
        },
        1.15,
      )
      .to(
        click,
        {
          depth: 6,
          duration: 0.13,
          onUpdate: () => move(tile, 0, click.depth),
        },
        2.2,
      )
      .to(
        click,
        {
          depth: 0,
          duration: 0.3,
          ease: "back.out(2)",
          onUpdate: () => move(tile, 0, click.depth),
        },
        2.33,
      )
      .to(
        selected,
        {
          opacity: 1,
          duration: 0.18,
          onUpdate: () => attr(selection, "opacity", selected.opacity),
        },
        2.3,
      )
      .to(
        position,
        {
          x: 662,
          y: 188,
          duration: 0.6,
          ease: "power2.inOut",
          onUpdate: () => move(cursor, position.x, position.y),
        },
        2.45,
      )
      .to(
        tip,
        {
          opacity: 1,
          duration: 0.3,
          onUpdate: () => attr(tooltip, "opacity", tip.opacity),
        },
        2.8,
      )
      .to(
        text,
        { length: message.length, duration: 1.7, ease: "none", onUpdate: type },
        3,
      )
      .to(
        tip,
        {
          opacity: 0,
          duration: 0.3,
          onUpdate: () => attr(tooltip, "opacity", tip.opacity),
        },
        5.45,
      )
      .to(
        position,
        {
          x: 365,
          y: 510,
          duration: 1.05,
          ease: "power2.inOut",
          onUpdate: () => move(cursor, position.x, position.y),
        },
        5.55,
      )
      .to(
        pulse,
        {
          opacity: 0.9,
          duration: 0.18,
          onUpdate: () => attr(response, "opacity", pulse.opacity),
        },
        6.65,
      )
      .to(
        pulse,
        {
          opacity: 0,
          duration: 0.8,
          onUpdate: () => attr(response, "opacity", pulse.opacity),
        },
        6.9,
      )
      .to(
        selected,
        {
          opacity: 0,
          duration: 0.3,
          onUpdate: () => attr(selection, "opacity", selected.opacity),
        },
        7.5,
      )
      .to(
        position,
        {
          x: 660,
          y: 190,
          duration: 1.2,
          ease: "power2.inOut",
          onUpdate: () => move(cursor, position.x, position.y),
        },
        8.2,
      )
      .to({}, { duration: 0.9 }, 9.4);
    automaticPress("connect", 6.65, 14);
    automaticPress("learn", 7.25, 11);

    const floating = { y: 0 },
      sweep = { x: 0 },
      flow = { offset: 0 },
      dial = { angle: -25 };
    ambient
      .to(
        floating,
        {
          y: -8,
          duration: 1.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: 3,
          onUpdate: () => move(wallet, 0, floating.y),
        },
        0,
      )
      .to(
        sweep,
        {
          x: 365,
          duration: 2,
          repeat: 2,
          ease: "none",
          onUpdate: () => move(find(".light-sweep"), sweep.x, 0),
        },
        0,
      )
      .to(
        flow,
        {
          offset: -276,
          duration: 6,
          ease: "none",
          onUpdate: () => attr(signal, "stroke-dashoffset", flow.offset),
        },
        0,
      )
      .to(
        dial,
        {
          angle: 45,
          duration: 1.5,
          repeat: 3,
          yoyo: true,
          ease: "sine.inOut",
          onUpdate: () =>
            attr(
              find(".knob-indicator"),
              "transform",
              `rotate(${dial.angle} 289 303)`,
            ),
        },
        0,
      );

    svg.querySelectorAll<SVGRectElement>(".meter-bar").forEach((bar, i) => {
      const state = { level: 1 };
      const height = Number(bar.getAttribute("height")),
        base = Number(bar.getAttribute("y")) + height;
      ambient.to(
        state,
        {
          level: 0.18 + (i % 4) * 0.12,
          duration: 0.3 + (i % 3) * 0.1,
          yoyo: true,
          repeat: 9,
          ease: "sine.inOut",
          onUpdate: () => {
            attr(bar, "height", height * state.level);
            attr(bar, "y", base - height * state.level);
          },
        },
        (i % 6) * 0.06,
      );
    });
    svg.querySelectorAll<SVGElement>(".status-led").forEach((led, i) => {
      const state = { opacity: 1 };
      ambient.to(
        state,
        {
          opacity: 0.25,
          duration: 0.5,
          repeat: 9,
          yoyo: true,
          onUpdate: () => attr(led, "opacity", state.opacity),
        },
        (i % 4) * 0.15,
      );
    });
  } else {
    text.length = message.length;
    type();
    attr(tooltip, "opacity", 1);
  }

  let disposed = false;
  const manualTweens = new Map<string, gsap.core.Timeline>();
  return {
    setPaused(paused: boolean) {
      if (disposed) return;
      main.paused(paused || reducedMotion);
      ambient.paused(paused || reducedMotion);
    },
    press(id: string) {
      const key = keys.get(id);
      if (!key || disposed || reducedMotion) return;
      manualTweens.get(id)?.kill();
      const tween = gsap
        .timeline({ onComplete: () => manualTweens.delete(id) })
        .to(key.manual, {
          depth: 14,
          duration: 0.1,
          ease: "power2.out",
          onUpdate: key.draw,
        })
        .to(key.manual, {
          depth: 0,
          duration: 0.38,
          ease: "back.out(1.4)",
          onUpdate: key.draw,
        });
      manualTweens.set(id, tween);
    },
    // Deterministic scrubbing supports regression tests without relying on timing screenshots.
    seek(seconds: number) {
      if (!disposed && !reducedMotion) {
        main.totalTime(seconds);
        ambient.totalTime(seconds);
      }
    },
    isPaused() {
      return main.paused() && ambient.paused();
    },
    dispose() {
      disposed = true;
      main.kill();
      ambient.kill();
      manualTweens.forEach((tween) => tween.kill());
      manualTweens.clear();
      keys.forEach((key) => {
        key.automatic.depth = key.manual.depth = 0;
        key.draw();
      });
      snapshots.forEach(({ element, values }) =>
        values.forEach(([name, value]) => {
          if (value === null) element.removeAttribute(name);
          else element.setAttribute(name, value);
        }),
      );
      textSnapshots.forEach(({ element, text }) => {
        element.textContent = text;
      });
    },
  };
}
