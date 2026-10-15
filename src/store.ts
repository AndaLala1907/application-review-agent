import fs from "node:fs";

const FILE = "data/decisions.json";

export type Status =
  | "advanced_to_interview"
  | "awaiting_candidate_info"
  | "pending_human_approval" // all rejections start here
  | "pending_human_review" // flagged or failed reviews
  | "rejected" // only a human can set this
  | "rejection_overturned"
  | "returned_to_recruiter";

export interface Decision {
  application_id: string;
  candidate: string;
  action: string;
  status: Status;
  score: number | null;
  score_breakdown?: Record<string, number>;
  reason: string;
  red_flags?: string[];
  questions?: string[];
  note?: string;
  decided_by: "agent" | "human";
  decided_at: string;
}

export function loadDecisions(): Decision[] {
  return fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, "utf8")) : [];
}

export function saveDecision(decision: Decision) {
  const others = loadDecisions().filter((d) => d.application_id !== decision.application_id);
  fs.writeFileSync(FILE, JSON.stringify([...others, decision], null, 2));
}
