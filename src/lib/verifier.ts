export type VerificationResult =
  | { supported: true; reason: "quote-found"; start: number; end: number }
  | { supported: false; reason: "missing-quote" | "quote-too-short" | "quote-not-found" };

type NormalizedText = { value: string; starts: number[]; ends: number[] };

function normalizeWithOffsets(input: string): NormalizedText {
  let value = "";
  const starts: number[] = [];
  const ends: number[] = [];
  let inWhitespace = false;

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];
    if (/\s/.test(character)) {
      if (value.length > 0 && !inWhitespace) {
        value += " ";
        starts.push(index);
        ends.push(index + 1);
      } else if (inWhitespace && ends.length > 0) {
        ends[ends.length - 1] = index + 1;
      }
      inWhitespace = true;
      continue;
    }
    value += character.toLowerCase();
    starts.push(index);
    ends.push(index + 1);
    inWhitespace = false;
  }

  const leading = value.startsWith(" ") ? 1 : 0;
  const trailing = value.endsWith(" ") ? 1 : 0;
  if (leading) {
    value = value.slice(1);
    starts.shift();
    ends.shift();
  }
  if (trailing) {
    value = value.slice(0, -1);
    starts.pop();
    ends.pop();
  }
  return { value, starts, ends };
}

export function verifyQuote(evidence: string, claimedQuote: string): VerificationResult {
  const quote = claimedQuote.trim();
  if (!quote) return { supported: false, reason: "missing-quote" };
  if (normalizeWithOffsets(quote).value.length < 8) {
    return { supported: false, reason: "quote-too-short" };
  }

  const normalizedEvidence = normalizeWithOffsets(evidence);
  const normalizedQuote = normalizeWithOffsets(quote).value;
  const matchIndex = normalizedEvidence.value.indexOf(normalizedQuote);
  if (matchIndex < 0) return { supported: false, reason: "quote-not-found" };

  const start = normalizedEvidence.starts[matchIndex];
  const end = normalizedEvidence.ends[matchIndex + normalizedQuote.length - 1];
  if (start === undefined || end === undefined) {
    return { supported: false, reason: "quote-not-found" };
  }
  return { supported: true, reason: "quote-found", start, end };
}

export function validateExtractiveAnswer(
  evidence: string,
  claimedAnswer: string,
  claimedQuote: string,
): { status: "partial" | "gap"; answer: string; quote: string; reason: string } {
  const result = verifyQuote(evidence, claimedQuote);
  if (!result.supported) {
    const reasons: Record<Exclude<VerificationResult, { supported: true }>["reason"], string> = {
      "missing-quote": "No quote was provided.",
      "quote-too-short": "The quote must contain at least 8 characters.",
      "quote-not-found": "The quote does not appear in the evidence.",
    };
    return { status: "gap", answer: "", quote: "", reason: reasons[result.reason] };
  }
  return {
    status: "partial",
    answer: claimedAnswer.trim(),
    quote: claimedQuote.trim(),
    reason: "Matched passage; confirm it fully answers the question.",
  };
}
