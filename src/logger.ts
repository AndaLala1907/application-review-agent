import fs from "node:fs";

export const LOG_FILE = "logs/audit-log.jsonl";
fs.mkdirSync("logs", { recursive: true });

export function log(event: string, data: Record<string, unknown> = {}) {
  const entry = { time: new Date().toISOString(), event, ...data };
  fs.appendFileSync(LOG_FILE, JSON.stringify(entry) + "\n");
  console.log(`[${event}]`, JSON.stringify(data, null, 2));
}
