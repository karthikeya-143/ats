const mongoose = require("mongoose");

const resumeReportSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    originalName: { type: String, required: true },
    fileHash: { type: String, required: true },
    fileMimeType: String,
    fileData: Buffer,
    extractedText: String,
    skills: [String],
    atsScore: Number,
    keywordMatch: Number,
    sectionCompleteness: Number,
    readability: Number,
    sectionBreakdown: {
      header: Number,
      skills: Number,
      experience: Number,
      projects: Number,
      achievements: Number,
    },
    missingKeywords: [String],
    limitations: [String],
    improvements: [String],
    actionVerbs: [String],
    aiExplanation: String,
    jobRecommendations: [
      {
        role: String,
        matchPercent: Number,
        trendingSkills: [String],
      },
    ],
  },
  { timestamps: true }
);

resumeReportSchema.index({ user: 1, createdAt: -1 });
resumeReportSchema.index({ user: 1, fileHash: 1 }, { unique: true });

module.exports = mongoose.model("ResumeReport", resumeReportSchema);
