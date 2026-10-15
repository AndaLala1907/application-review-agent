export const RUBRIC = [
  { key: "experience", max: 35, guide: "Customer support experience. 0 = none, 15 = under 1 year, 25 = 1-2 years, 35 = 3+ years" },
  { key: "volume_metrics", max: 15, guide: "Numbers like tickets per day, CSAT, resolution time" },
  { key: "tools", max: 15, guide: "Helpdesk/CRM tools like Zendesk, Freshdesk, Intercom" },
  { key: "communication", max: 15, guide: "Languages, especially fluent English" },
  { key: "availability", max: 10, guide: "Clear availability and start date" },
  { key: "motivation", max: 10, guide: "Motivation and attitude" },
];

export const ADVANCE_MIN = 70;
export const REJECT_BELOW = 40;

export function rubricText() {
  const criteria = RUBRIC.map((c) => `- ${c.key} (0-${c.max}): ${c.guide}`).join("\n");
  return `${criteria}

Only count what the candidate actually wrote. Missing information = 0 points.
The score is the sum of all criteria (0-100).

- score >= ${ADVANCE_MIN}: advance_to_interview
- score < ${ADVANCE_MIN} and important information is missing: request_more_info
- score < ${REJECT_BELOW} and the candidate clearly doesn't fit: reject`;
}
