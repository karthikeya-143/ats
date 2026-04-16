const axios = require("axios");

const buildFallbackInsights = (scoreData) => ({
  explanation: `Your ATS score is ${scoreData.atsScore}/100. Improve keyword alignment and strengthen section depth to increase recruiter pass-through.`,
  bulletEnhancementTips: [
    "Start bullets with strong action verbs and include measurable outcomes.",
    "Tailor bullets to match role requirements from the job description.",
  ],
});

const generateAIInsights = async (scoreData) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return buildFallbackInsights(scoreData);

  try {
    const prompt = `Given resume ATS data ${JSON.stringify(
      scoreData
    )}, provide concise explanation and two bullet improvement tips in JSON with keys explanation and bulletEnhancementTips (array).`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    const content = response.data?.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);
    return parsed;
  } catch {
    return buildFallbackInsights(scoreData);
  }
};

module.exports = { generateAIInsights };
