const express = require("express");
const router = express.Router();
const { generateAnalysis, getAnalysis } = require("../controllers/analysis.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/:interviewId", protect, generateAnalysis);
router.get("/:interviewId", protect, getAnalysis);

module.exports = router;
