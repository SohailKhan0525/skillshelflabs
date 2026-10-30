import assert from "node:assert/strict";
import { test } from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import MotionPresetPlayer from "../src/components/motion-library/MotionPresetPlayer";
import {
  motionFamilies,
  motionPresets,
  findPresets,
  presetSource,
} from "../src/components/motion-library/presets";

test("the collection contains 240 unique presets and 24 complete family contracts", () => {
  assert.equal(motionPresets.length, 240);
  assert.equal(new Set(motionPresets.map((p) => p.id)).size, 240);
  assert.equal(motionFamilies.length, 24);
  for (const family of motionFamilies) {
    const members = motionPresets.filter((p) => p.family === family.id);
    assert.deepEqual(
      members.map((p) => p.variant),
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    );
    for (const field of [
      "api",
      "avoid",
      "accessibility",
      "reducedMotion",
      "performance",
      "mobile",
      "implementation",
      "source",
    ] as const)
      assert.ok(family[field]);
  }
});
test("search combines intent words and family filters, and copied JSON reproduces the selected config", () => {
  assert.equal(findPresets("", "path").length, 10);
  assert.equal(findPresets("path education").length, 10);
  assert.equal(findPresets("no-such-movement").length, 0);
  for (const p of motionPresets) {
    assert.ok(findPresets(p.id).some((match) => match.id === p.id));
    assert.deepEqual(JSON.parse(presetSource(p)).preset, p);
  }
});
test("all 240 presets render populated animated and reduced-motion responses (480 renders, not visual verification)", () => {
  for (const p of motionPresets) {
    for (const reduced of [false, true]) {
      const html = renderToStaticMarkup(
        <MotionPresetPlayer preset={p} reducedMotion={reduced} />,
      );
      assert.match(
        html,
        /data-motion-reduced="(?:true|false)"><(?:div|svg|button)/,
        p.id,
      );
      assert.ok(html.includes(`data-motion-family="${p.family}"`), p.id);
      assert.ok(!html.includes("NaN") && !html.includes("undefined"), p.id);
      assert.ok(html.includes(`data-motion-reduced="${reduced}"`), p.id);
    }
  }
});
test("gesture examples retain labeled native buttons and disclosures retain expanded semantics", () => {
  for (const family of ["drag", "follow", "accordion", "expand", "shared"]) {
    const p = motionPresets.find((p) => p.family === family)!;
    const dom = new JSDOM(
      renderToStaticMarkup(<MotionPresetPlayer preset={p} reducedMotion />),
    );
    const doc = dom.window.document;
    assert.ok(doc.querySelectorAll("button").length > 0);
    for (const b of doc.querySelectorAll("button"))
      assert.ok(b.textContent!.trim());
    if (family === "accordion" || family === "expand") {
      const control = doc.querySelector("[aria-controls]")!;
      assert.equal(control.getAttribute("aria-expanded"), "true");
      assert.ok(doc.getElementById(control.getAttribute("aria-controls")!));
    }
    dom.window.close();
  }
});
