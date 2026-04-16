const crypto = require("crypto");
const ResumeReport = require("../models/ResumeReport");
const { extractTextFromBuffer } = require("../services/resumeParser");
const { scoreResume } = require("../services/atsEngine");
const { generateRecommendations } = require("../services/recommendationService");
const { generateAIInsights } = require("../services/aiService");

const uploadAndAnalyze = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Resume file is required" });

  const fileHash = crypto.createHash("sha256").update(req.file.buffer).digest("hex");
  const extractedText = await extractTextFromBuffer(req.file.buffer, req.file.mimetype);
  const scoreData = scoreResume(extractedText);
  const recommendations = generateRecommendations(scoreData.skills);
  const aiInsights = await generateAIInsights(scoreData);

  const duplicate = await ResumeReport.findOne({ user: req.userId, fileHash });
  if (duplicate) {
    duplicate.originalName = req.file.originalname;
    duplicate.fileMimeType = req.file.mimetype;
    duplicate.fileData = req.file.buffer;
    duplicate.extractedText = extractedText;
    duplicate.skills = scoreData.skills;
    duplicate.atsScore = scoreData.atsScore;
    duplicate.keywordMatch = scoreData.keywordMatch;
    duplicate.sectionCompleteness = scoreData.sectionCompleteness;
    duplicate.readability = scoreData.readability;
    duplicate.sectionBreakdown = scoreData.sectionBreakdown;
    duplicate.missingKeywords = scoreData.missingKeywords;
    duplicate.limitations = scoreData.limitations;
    duplicate.improvements = [
      ...scoreData.improvements,
      ...(aiInsights.bulletEnhancementTips || []),
    ];
    duplicate.actionVerbs = scoreData.actionVerbs;
    duplicate.aiExplanation = aiInsights.explanation;
    duplicate.jobRecommendations = recommendations;
    await duplicate.save();

    return res.status(200).json({
      ...duplicate.toObject(),
      duplicate: true,
      message: "Resume re-analyzed successfully.",
    });
  }

  const report = await ResumeReport.create({
    user: req.userId,
    originalName: req.file.originalname,
    fileHash,
    fileMimeType: req.file.mimetype,
    fileData: req.file.buffer,
    extractedText,
    ...scoreData,
    jobRecommendations: recommendations,
    improvements: [...scoreData.improvements, ...(aiInsights.bulletEnhancementTips || [])],
    aiExplanation: aiInsights.explanation,
  });

  return res.status(201).json(report);
};

const getReports = async (req, res) => {
  const reports = await ResumeReport.find({ user: req.userId }).sort({ createdAt: -1 }).limit(30);
  return res.json(reports);
};

const compareReports = async (req, res) => {
  const ids = String(req.query.ids || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
  const reports = await ResumeReport.find({ user: req.userId, _id: { $in: ids } });
  return res.json(reports);
};

module.exports = { uploadAndAnalyze, getReports, compareReports };
