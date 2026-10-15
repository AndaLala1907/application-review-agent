import fs from "node:fs";
import { reviewApplication, MODEL, type Application } from "./agent.js";
import { log, LOG_FILE } from "./logger.js";

const applications: Application[] = JSON.parse(fs.readFileSync("data/applications.json", "utf8"));
log("run_started", { model: MODEL, applications: applications.length });

const summary = [];
for (const app of applications) {
  try {
    const d = await reviewApplication(app);
    summary.push({ id: d.application_id, candidate: d.candidate, score: d.score, action: d.action, status: d.status, reason: d.reason });
  } catch (err) {
    log("error", { id: app.id, error: String(err) });
  }
}

log("run_finished");

console.log("\nSUMMARY\n");
console.table(summary.map(({ reason, ...row }) => row));
console.log("\nReasons:");
for (const s of summary) console.log(`- ${s.id} ${s.candidate}: ${s.reason}`);
console.log();
console.log(`Log saved to ${LOG_FILE}. Run "npm run review" to see what needs a human.`);
