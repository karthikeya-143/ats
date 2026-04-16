const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

const extractTextFromBuffer = async (buffer, mimetype) => {
  if (mimetype === "application/pdf") {
    const parser = new PDFParse({ data: buffer });
    const parsed = await parser.getText();
    await parser.destroy();
    return parsed?.text || "";
  }

  const isDocx =
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  if (isDocx) {
    const parsed = await mammoth.extractRawText({ buffer });
    return parsed.value || "";
  }

  throw new Error("Unsupported file type. Please upload PDF or DOCX.");
};

module.exports = { extractTextFromBuffer };
