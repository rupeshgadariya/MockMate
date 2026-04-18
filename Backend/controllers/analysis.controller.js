const Groq = require('groq-sdk');
const Interview = require("../models/interview.model");

const openai = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateAnalysis = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.interviewId);

        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not found" });
        }

        if (interview.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        if (interview.status !== "completed") {
            return res.status(400).json({
                success: false,
                message: "Please complete the interview first",
            });
        }

        if (interview.analysis && interview.analysis.overallScore > 0) {
            return res.json({ success: true, analysis: interview.analysis });
        }

        const qaTranscript = interview.exchanges
            .map((ex, i) => `Q${i + 1}: ${ex.question}\nA${i + 1}: ${ex.answer || "No answer provided"}`)
            .join("\n\n");

        const analysisPrompt = `You are an expert HR and technical interview evaluator.

Job Role: ${interview.jobRole}
Interview Transcript:
${qaTranscript}

Analyze this mock interview and return a JSON object with EXACTLY this structure:
{
  "overallScore": <number 0-100>,
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["area1", "area2", "area3"],
  "detailedFeedback": "<2-3 paragraph detailed feedback>",
  "skillScores": {
    "communication": <number 0-100>,
    "technicalKnowledge": <number 0-100>,
    "problemSolving": <number 0-100>,
    "confidence": <number 0-100>
  }
}

Return ONLY valid JSON, no extra text.`;

        const completion = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: analysisPrompt }],
            max_tokens: 1000,
        });

        let analysisData;
        try {
            const rawText = completion.choices[0].message.content
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            analysisData = JSON.parse(rawText);
        } catch (parseError) {
            analysisData = {
                overallScore: 65,
                strengths: ["Good communication", "Relevant experience", "Professional demeanor"],
                improvements: ["Provide more specific examples", "Elaborate on technical details", "Show more confidence"],
                detailedFeedback: "The candidate showed reasonable performance in the interview. Areas for improvement include providing more specific examples and elaborating on technical knowledge.",
                skillScores: {
                    communication: 70,
                    technicalKnowledge: 60,
                    problemSolving: 65,
                    confidence: 65,
                },
            };
        }

        interview.analysis = analysisData;
        await interview.save();

        res.json({
            success: true,
            message: "Analysis generated successfully!",
            analysis: analysisData,
        });
    } catch (error) {
        console.error("Analysis error:", error);
        res.status(500).json({ success: false, message: "Error generating analysis" });
    }
};

const getAnalysis = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.interviewId);

        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not found" });
        }

        if (interview.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        if (!interview.analysis || interview.analysis.overallScore === 0) {
            return res.status(404).json({
                success: false,
                message: "Analysis not generated yet. Please generate it first.",
            });
        }

        res.json({ success: true, analysis: interview.analysis, jobRole: interview.jobRole });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { generateAnalysis, getAnalysis };
