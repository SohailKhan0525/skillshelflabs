import { describe, expect, it } from "vitest";
import { validateExtractiveAnswer, verifyQuote } from "./verifier";

describe("verifyQuote", () => {
  it("supports a quote while ignoring case and repeated whitespace", () => {
    const result = verifyQuote("Customer data  stays in the browser.", "customer DATA stays\nin the   browser.");
    expect(result.supported).toBe(true);
    if (result.supported) {
      expect("Customer data  stays in the browser.".slice(result.start, result.end)).toBe("Customer data  stays in the browser.");
    }
  });

  it("rejects a missing quote", () => {
    expect(verifyQuote("A source sentence.", "").reason).toBe("missing-quote");
  });

  it("rejects quotes shorter than eight characters", () => {
    expect(verifyQuote("Evidence here.", "Evidence").reason).toBe("quote-too-short");
  });

  it("rejects unsupported text", () => {
    expect(verifyQuote("Evidence here.", "This wording is invented.").reason).toBe("quote-not-found");
  });

  it("downgrades unsupported answer text to a gap", () => {
    expect(validateExtractiveAnswer("Source material.", "Claim", "No evidence")).toMatchObject({
      status: "gap",
      answer: "",
      reason: "The quote does not appear in the evidence.",
    });
  });

  it("returns matched quotes for founder confirmation rather than auto-answering", () => {
    expect(validateExtractiveAnswer("Customer records stay in the browser.", "Records stay locally.", "Customer records stay in the browser.")).toMatchObject({
      status: "partial",
      reason: "Matched passage; confirm it fully answers the question.",
    });
  });
});
