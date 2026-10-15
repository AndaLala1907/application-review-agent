// Simple check that runs before the LLM, so we don't depend only on the prompt.
const SUSPICIOUS = [
  /\b(ignore|disregard|forget)\b.{0,30}\b(instructions?|rubric|rules|prompt)\b/i,
  /\bsystem (note|message|prompt)\b/i,
  /\b(advance|approve|hire)\s+(this|me)\b/i,
  /\bscore of \d+/i,
];

export function findSuspiciousText(text: string): string[] {
  return SUSPICIOUS.map((re) => text.match(re)?.[0]).filter((m): m is string => !!m);
}

// So the candidate can't close our <application> tag.
export function escapeText(text: string) {
  return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
