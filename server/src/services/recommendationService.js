const ROLE_SKILLS = {
  "Frontend Developer": ["react", "javascript", "typescript", "css", "redux"],
  "Backend Developer": ["node", "express", "mongodb", "sql", "api"],
  "Full Stack Developer": ["react", "node", "mongodb", "rest", "typescript"],
  "Data Analyst": ["python", "sql", "excel", "power bi", "tableau"],
  "DevOps Engineer": ["docker", "kubernetes", "aws", "ci/cd", "linux"],
};

const generateRecommendations = (skills = []) => {
  const normalized = new Set(skills.map((s) => s.toLowerCase()));
  return Object.entries(ROLE_SKILLS)
    .map(([role, roleSkills]) => {
      const hit = roleSkills.filter((skill) => normalized.has(skill.toLowerCase())).length;
      return {
        role,
        matchPercent: Math.round((hit / roleSkills.length) * 100),
        trendingSkills: roleSkills,
      };
    })
    .sort((a, b) => b.matchPercent - a.matchPercent)
    .slice(0, 4);
};

module.exports = { generateRecommendations };
