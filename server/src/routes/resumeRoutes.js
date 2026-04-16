const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadAndAnalyze, getReports, compareReports } = require("../controllers/resumeController");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    const ok =
      file.mimetype === "application/pdf" ||
      file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    cb(ok ? null : new Error("Only PDF and DOCX are supported"), ok);
  },
});

router.use(authMiddleware);
router.get("/", getReports);
router.get("/compare", compareReports);
router.post("/upload", upload.single("resume"), uploadAndAnalyze);

module.exports = router;
