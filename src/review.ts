// Human approval step.
//   npm run review                          -> list what is waiting
//   npm run review -- B approve "note"      -> approve
//   npm run review -- B deny "note"         -> deny
import { loadDecisions, saveDecision, type Status } from "./store.js";
import { log } from "./logger.js";

const [id, answer, ...note] = process.argv.slice(2);
const waiting = loadDecisions().filter((d) => d.status.startsWith("pending"));

if (!id) {
  if (waiting.length === 0) console.log("Nothing is waiting for a human.");
  for (const d of waiting) {
    console.log(`\n${d.application_id} - ${d.candidate} (${d.status})`);
    console.log(`  agent wants: ${d.action}, score ${d.score}`);
    console.log(`  reason: ${d.reason}`);
    if (d.red_flags?.length) console.log(`  red flags: ${d.red_flags.join("; ")}`);
  }
  process.exit(0);
}

const decision = waiting.find((d) => d.application_id === id);
if (!decision || (answer !== "approve" && answer !== "deny")) {
  console.log('Usage: npm run review -- <id> approve|deny "note"');
  process.exit(1);
}

let newStatus: Status;
if (decision.action === "reject") {
  newStatus = answer === "approve" ? "rejected" : "rejection_overturned";
} else if (decision.action === "advance_to_interview" && answer === "approve") {
  newStatus = "advanced_to_interview";
} else {
  newStatus = "returned_to_recruiter";
}

saveDecision({ ...decision, status: newStatus, note: note.join(" "), decided_by: "human", decided_at: new Date().toISOString() });
log("human_review", { id, answer, old_status: decision.status, new_status: newStatus, note: note.join(" ") });
