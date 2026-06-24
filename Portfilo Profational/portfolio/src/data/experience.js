import { projects } from "./projects";

// Education entry — shown first in the timeline.
export const education = {
  id: "comsats",
  period: "2022 — 2026",
  title: "BS Software Engineering",
  org: "COMSATS University Islamabad, Vehari Campus",
  description:
    "Final-year software engineering student, with hands-on project work across web, mobile, and desktop platforms throughout the degree.",
  type: "education",
};

// The full timeline = education + every project, in the order they're
// defined in projects.js. Adding a project there automatically adds it
// here — no need to maintain two lists.
export const experience = [
  education,
  ...projects.map((p) => ({
    id: p.id,
    period: "",
    title: p.title,
    org: p.category,
    description: p.tagline,
    type: "project",
  })),
];
