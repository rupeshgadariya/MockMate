const express = require("express");
const router = express.Router();
const {
    startInterview,
    submitAnswer,
    getInterviewHistory,
    getInterview,
} = require("../controllers/interview.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/start", protect, startInterview);
router.post("/:id/answer", protect, submitAnswer);
router.get("/history", protect, getInterviewHistory);
router.get("/:id", protect, getInterview);

module.exports = router;
