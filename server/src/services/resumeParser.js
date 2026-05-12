const pdf = require("pdf-parse");
const mammoth = require("mammoth");
const extractTextFromBuffer = async (buffer, mimetype) => {
  try {
    if (mimetype === "application/pdf") {
      const data = await pdf(buffer);
      return data.text || "";
    }
    const isDocx =
      mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    if (isDocx) {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || "";
    }
    throw new Error("Unsupported file type. Please upload PDF or DOCX.");
  } catch (error) {
    console.error("Error parsing file:", error.message);
    throw new Error("Failed to extract text from file");
  }
};

module.exports = { extractTextFromBuffer };