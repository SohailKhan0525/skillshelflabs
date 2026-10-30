import assert from "node:assert/strict";
import { test } from "node:test";
import React, { act } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import StillExperience from "../src/components/still/StillExperience";
import {
  chooseMood,
  initialLight,
  selectionDescription,
} from "../src/lib/still-light";

test("the initial response contains the complete article, named art, native controls, and a no-JS explanation", () => {
  const dom = new JSDOM(renderToStaticMarkup(<StillExperience />));
  const doc = dom.window.document;
  assert.equal(doc.querySelectorAll("main").length, 1);
  assert.equal(doc.querySelectorAll("h1").length, 1);
  assert.match(doc.querySelector("h1")!.textContent!, /A little light/);
  assert.equal(doc.querySelectorAll("details").length, 3);
  assert.equal(doc.querySelectorAll("svg[role=img]").length, 2);
  assert.match(
    doc.querySelector("noscript")!.textContent!,
    /requires JavaScript/,
  );
  assert.match(doc.querySelector("[data-shade]")!.getAttribute("style")!, /transform-origin:325px 250px/);
  const ids = [...doc.querySelectorAll("[id]")].map((node) => node.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const node of doc.querySelectorAll(
    "[aria-labelledby], [aria-describedby]",
  )) {
    const references =
      `${node.getAttribute("aria-labelledby") || ""} ${node.getAttribute("aria-describedby") || ""}`
        .trim()
        .split(/\s+/);
    for (const id of references)
      assert.ok(doc.getElementById(id), `Missing accessible reference: ${id}`);
  }
  dom.window.close();
});

test("mood selection preserves the finish and produces a truthful saved description", () => {
  const source = { ...initialLight, finish: "moss" as const, lightOn: false };
  const next = chooseMood(source, "unwinding");
  assert.deepEqual(next, {
    finish: "moss",
    brightness: 35,
    lightOn: true,
    mood: "unwinding",
  });
  assert.equal(source.lightOn, false);
  assert.equal(
    selectionDescription(next),
    "Arc 01 in Moss · 35% light · Unwinding",
  );
});

test("the actual React preview supports finish, light, dimming, save, edit, and restoring the saved combination", async () => {
  const dom = new JSDOM(
    "<!doctype html><html><body><div id='root'></div></body></html>",
    {
      url: "https://example.test/frontend-ui-ux-pro-plus-skill",
      pretendToBeVisual: true,
    },
  );
  const media = {
    matches: true,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    dispatchEvent() {
      return true;
    },
  };
  Object.assign(globalThis, {
    window: dom.window,
    document: dom.window.document,
    HTMLElement: dom.window.HTMLElement,
    Element: dom.window.Element,
    SVGElement: dom.window.SVGElement,
    IS_REACT_ACT_ENVIRONMENT: true,
    IntersectionObserver: class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  });
  dom.window.matchMedia = () => media;
  // JSDOM has no native modal lifecycle. This shim proves state, not focus containment, Escape, or inertness.
  dom.window.HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  dom.window.HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
    this.dispatchEvent(new dom.window.Event("close"));
  };
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(dom.window.document.getElementById("root")!);
  const doc = dom.window.document;
  const button = (text: string) =>
    [...doc.querySelectorAll<HTMLButtonElement>("button")].find(
      (node) => node.textContent?.trim() === text,
    )!;
  const click = (element: HTMLElement) =>
    act(() => {
      element.click();
    });
  try {
    act(() => root.render(<StillExperience />));
    const initialSvg = doc.querySelector(".still-lamp")!;
    assert.equal(
      initialSvg
        .querySelector("[data-shade]")!
        .getAttribute("style")
        ?.includes("rotate(-8deg)"),
      true,
    );
    click(
      doc.querySelector<HTMLInputElement>(
        'input[name="hero-finish"][value="moss"]',
      )!,
    );
    assert.equal(
      doc.querySelector(".still-lamp title")!.textContent,
      "Arc 01 in Moss",
    );
    click(button("Unwinding"));
    assert.equal(doc.querySelector("output")!.textContent, "35%");
    // JSDOM verifies state and accessible descriptions; actual Motion frame updates are browser checks.
    assert.match(initialSvg.querySelector("desc")!.textContent!, /35 percent/);
    assert.match(initialSvg.querySelector("desc")!.textContent!, /unwinding/);
    click(doc.querySelector<HTMLButtonElement>(".still-power")!);
    assert.equal(
      doc.querySelector<HTMLInputElement>("input[type=range]")!.disabled,
      true,
    );
    assert.match(
      initialSvg.querySelector("desc")!.textContent!,
      /light is off/,
    );
    click(button("Reading"));
    const range = doc.querySelector<HTMLInputElement>("input[type=range]")!;
    assert.equal(range.disabled, false);
    assert.equal(range.value, "75");
    act(() => {
      Object.getOwnPropertyDescriptor(
        dom.window.HTMLInputElement.prototype,
        "value",
      )!.set!.call(range, "90");
      range.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
      range.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
    });
    assert.equal(doc.querySelector("output")!.textContent, "90%");
    click(button("Make it yours"));
    assert.equal(doc.querySelector("dialog")!.open, true);
    click(
      doc.querySelector<HTMLInputElement>(
        'input[name="dialog-finish"][value="chalk"]',
      )!,
    );
    click(button("Save this combination"));
    assert.equal(button("Combination saved").disabled, true);
    assert.match(
      doc.querySelector("dialog [role=status]")!.textContent!,
      /Nothing was ordered or sent/,
    );
    click(doc.querySelector<HTMLButtonElement>(".still-close")!);
    assert.equal(doc.querySelector("dialog")!.open, false);
    click(
      doc.querySelector<HTMLInputElement>(
        'input[name="hero-finish"][value="clay"]',
      )!,
    );
    click(button("Unwinding"));
    click(button("Your saved light"));
    assert.match(
      doc.querySelector(".still-selection-summary strong")!.textContent!,
      /Chalk · 90% light · Reading/,
    );
    assert.equal(button("Combination saved").disabled, true);
    assert.equal(
      doc.querySelector(".still-lamp title")!.textContent,
      "Arc 01 in Chalk",
    );
    assert.equal(
      doc
        .querySelector("[data-scene-playing]")!
        .getAttribute("data-scene-playing"),
      "false",
    );
    assert.equal(
      doc
        .querySelector('[aria-label="Animations"]')!
        .getAttribute("aria-pressed"),
      "false",
    );
    const animatedNodes = [
      ...initialSvg.querySelectorAll(
        "[data-shade],[data-light],[data-light-pool]",
      ),
    ];
    act(() => root.unmount());
    for (const target of animatedNodes) assert.equal(target.isConnected, false);
  } finally {
    if (doc.getElementById("root")!.childNodes.length)
      act(() => root.unmount());
    dom.window.close();
  }
});
