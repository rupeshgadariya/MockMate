const express = require("express");
const router = express.Router();
const { uploadResume, getResumeInfo } = require("../controllers/resume.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.post("/upload", protect, upload.single("resume"), uploadResume);
router.get("/info", protect, getResumeInfo);

module.exports = router;
