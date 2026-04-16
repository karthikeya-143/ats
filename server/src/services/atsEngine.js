const CORE_KEYWORDS = [
  "leadership",
  "communication",
  "react",
  "node",
  "api",
  "project",
  "team",
  "sql",
  "mongodb",
  "testing",
];

const ACTION_VERBS = ["Built", "Led", "Optimized", "Delivered", "Automated", "Designed"];

const scoreResume = (text) => {
  const cleanText = (text || "").replace(/\s+/g, " ").trim();
  const lower = cleanText.toLowerCase();
  const words = cleanText.split(" ").filter(Boolean);

  const keywordHits = CORE_KEYWORDS.filter((kw) => lower.includes(kw));
  const missingKeywords = CORE_KEYWORDS.filter((kw) => !lower.includes(kw));
  const keywordMatch = Math.round((keywordHits.length / CORE_KEYWORDS.length) * 100);

  const sections = {
    header: /(email|phone|linkedin|github)/i.test(cleanText) ? 100 : 40,
    skills: /skills?/i.test(cleanText) ? 100 : 35,
    experience: /experience|work history/i.test(cleanText) ? 100 : 30,
    projects: /projects?/i.test(cleanText) ? 100 : 40,
    achievements: /achievements?|awards?/i.test(cleanText) ? 100 : 30,
  };

  const sectionCompleteness = Math.round(
    Object.values(sections).reduce((sum, value) => sum + value, 0) / 5
  );
  const readability = Math.max(35, Math.min(98, Math.round((words.length / 450) * 100)));
  const formatting = lower.includes("•") || lower.includes("-") ? 85 : 65;

  const atsScore = Math.round(
    keywordMatch * 0.35 + sectionCompleteness * 0.3 + readability * 0.2 + formatting * 0.15
  );

  const limitations = [];
  if (keywordMatch < 55) limitations.push("Important industry keywords are missing.");
  if (sections.experience < 70) limitations.push("Experience section is weak or missing.");
  if (readability < 60) limitations.push("Resume readability is low due to limited detail.");

  const improvements = [
    "Add role-specific keywords naturally within bullets.",
    "Use quantifiable impact statements (%, time saved, revenue).",
    "Keep each bullet action-driven and outcome-focused.",
  ];

  const extractedSkills = keywordHits.map((s) => s.toLowerCase());

  return {
    atsScore,
    keywordMatch,
    sectionCompleteness,
    readability,
    sectionBreakdown: sections,
    missingKeywords,
    limitations,
    improvements,
    actionVerbs: ACTION_VERBS,
    skills: extractedSkills,
  };
};

module.exports = { scoreResume };
