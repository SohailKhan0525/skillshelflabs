import assert from "node:assert/strict";
import { after, test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { gsap } from "gsap";
import KeyboardScene from "../src/components/KeyboardScene";
import { createSceneAnimation } from "../src/lib/scene-animation";

function fixture(reducedMotion = false) {
  const dom = new JSDOM(
    renderToStaticMarkup(
      <KeyboardScene
        paused
        reducedMotion={reducedMotion}
        connected={false}
        replay={0}
        onConnect={() => {}}
        onLearn={() => {}}
        onToggleMotion={() => {}}
      />,
    ),
  );
  const svg = dom.window.document.querySelector("svg")!;
  const original = svg.outerHTML;
  const animation = createSceneAnimation(svg, { reducedMotion });
  const key = (id: string) => svg.querySelector(`[data-key="${id}"] .key-top`)!;
  return {
    svg,
    original,
    animation,
    key,
    cleanup: () => {
      animation.dispose();
      dom.window.close();
    },
  };
}
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
after(() => gsap.ticker.sleep());

test("the keyboard automatically depresses START and Connect, then fully releases", () => {
  const f = fixture();
  try {
    const originalSide = f.svg
      .querySelector('[data-key="letter-0"] .key-side')!
      .getAttribute("d");
    f.animation.seek(0.38);
    assert.match(
      f.key("letter-0").getAttribute("transform")!,
      /translate\(0\.000 13\.000\)/,
    );
    assert.notEqual(
      f.svg.querySelector('[data-key="letter-0"] .key-side')!.getAttribute("d"),
      originalSide,
    );
    f.animation.seek(2);
    for (let i = 0; i < 5; i++)
      assert.equal(
        f.key(`letter-${i}`).getAttribute("transform"),
        "translate(0.000 0.000)",
      );
    f.animation.seek(6.78);
    assert.equal(
      f.key("connect").getAttribute("transform"),
      "translate(0.000 14.000)",
    );
    f.animation.seek(8);
    assert.equal(
      f.key("connect").getAttribute("transform"),
      "translate(0.000 0.000)",
    );
    assert.equal(
      f.key("learn").getAttribute("transform"),
      "translate(0.000 0.000)",
    );
  } finally {
    f.cleanup();
  }
});

test("cursor travels to the keyboard and tooltip types visible text", () => {
  const f = fixture();
  try {
    f.animation.seek(4.9);
    assert.equal(f.svg.querySelector(".tooltip")!.getAttribute("opacity"), "1");
    const text = [...f.svg.querySelectorAll(".typed-first,.typed-second")]
      .map((e) => e.textContent)
      .join("");
    assert.equal(text, "Connect your wallet at the speed of light.");
    f.animation.seek(6.65);
    assert.equal(
      f.svg.querySelector(".scene-cursor")!.getAttribute("transform"),
      "translate(365.000 510.000)",
    );
  } finally {
    f.cleanup();
  }
});

test("pause freezes motion; play resumes the same scene", async () => {
  const f = fixture();
  try {
    f.animation.seek(0.5);
    f.animation.setPaused(true);
    const before = f.svg.outerHTML;
    await delay(100);
    assert.equal(f.svg.outerHTML, before);
    f.animation.setPaused(false);
    await delay(160);
    assert.notEqual(f.svg.outerHTML, before);
    f.animation.setPaused(true);
    assert.equal(f.animation.isPaused(), true);
  } finally {
    f.cleanup();
  }
});

test("manual key presses still work while the automatic sequence is paused", async () => {
  const f = fixture();
  try {
    f.animation.setPaused(true);
    f.animation.press("letter-2");
    await delay(110);
    assert.notEqual(
      f.key("letter-2").getAttribute("transform"),
      "translate(0.000 0.000)",
    );
    // Rapid repeated activation must replace its previous press without leaving a stuck key.
    f.animation.press("letter-2");
    f.animation.press("letter-2");
    await delay(650);
    assert.equal(
      f.key("letter-2").getAttribute("transform"),
      "translate(0.000 0.000)",
    );
  } finally {
    f.cleanup();
  }
});

test("reduced motion starts static, including when play is requested from this controller", () => {
  const f = fixture(true);
  try {
    const before = f.svg.outerHTML;
    f.animation.setPaused(false);
    f.animation.seek(7);
    f.animation.press("connect");
    assert.equal(f.animation.isPaused(), true);
    assert.equal(f.svg.outerHTML, before);
    assert.equal(f.svg.querySelector(".tooltip")!.getAttribute("opacity"), "1");
  } finally {
    f.cleanup();
  }
});

test("replay cleanup restores every SVG attribute without accumulating transforms or shrinking meters", () => {
  const f = fixture();
  f.animation.dispose();
  try {
    assert.equal(f.svg.outerHTML, f.original);
    for (let run = 0; run < 4; run++) {
      const next = createSceneAnimation(f.svg);
      next.seek(3.8);
      assert.notEqual(f.svg.outerHTML, f.original);
      next.dispose();
      assert.equal(f.svg.outerHTML, f.original);
      next.seek(8);
      assert.equal(f.svg.outerHTML, f.original);
    }
  } finally {
    f.cleanup();
  }
});
