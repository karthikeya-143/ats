const pdf = require("pdf-parse");
const mammoth = require("mammoth");

/**
 * Extract text from uploaded file buffer
 * Supports: PDF and DOCX
 */
const extractTextFromBuffer = async (buffer, mimetype) => {
  try {
    // 📄 Handle PDF files
    if (mimetype === "application/pdf") {
      const data = await pdf(buffer);
      return data.text || "";
    }

    // 📝 Handle DOCX files
    const isDocx =
      mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (isDocx) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || "";
    }

    // ❌ Unsupported file
    throw new Error("Unsupported file type. Please upload PDF or DOCX.");
  } catch (error) {
    console.error("Error parsing file:", error.message);
    throw new Error("Failed to extract text from file");
  }
};

module.exports = { extractTextFromBuffer };