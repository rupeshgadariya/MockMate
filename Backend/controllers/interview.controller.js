const Groq = require('groq-sdk');
const User = require("../models/user.model");
const Interview = require("../models/interview.model");


const openai = new Groq({ apiKey: process.env.GROQ_API_KEY });

const startInterview = async (req, res) => {
    try {
        const { jobRole, type } = req.body;

        const user = await User.findById(req.user.id);

        if (!user.resumeText) {
            return res.status(400).json({
                success: false,
                message: "Please upload your resume first before starting interview",
            });
        }

        const prompt = `You are an expert interviewer. The candidate is interviewing for: ${jobRole || "Software Engineer"}.
    
Here is the candidate's resume:
${user.resumeText}

Generate the FIRST interview question. Keep it professional and relevant to their background.
Return ONLY the question, nothing else.`;

        const completion = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 200,
        });

        const firstQuestion = completion.choices[0].message.content.trim();

        const interview = await Interview.create({
            user: req.user.id,
            type: type || "text",
            jobRole: jobRole || "Software Engineer",
            exchanges: [{ question: firstQuestion, answer: "", feedback: "" }],
            status: "in-progress",
        });

        res.status(201).json({
            success: true,
            message: "Interview started!",
            interviewId: interview._id,
            question: firstQuestion,
            questionNumber: 1,
        });
    } catch (error) {
        console.error("Start interview error:", error);
        res.status(500).json({ success: false, message: "Error starting interview" });
    }
};

const submitAnswer = async (req, res) => {
    try {
        const { answer } = req.body;
        const interviewId = req.params.id;

        const interview = await Interview.findById(interviewId);
        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not found" });
        }

        if (interview.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        if (interview.status === "completed") {
            return res.status(400).json({ success: false, message: "Interview already completed" });
        }

        const lastIndex = interview.exchanges.length - 1;
        interview.exchanges[lastIndex].answer = answer;

        const maxQuestions = 5;

        if (interview.exchanges.length >= maxQuestions) {
            interview.status = "completed";
            await interview.save();

            return res.json({
                success: true,
                message: "Interview completed!",
                isComplete: true,
                totalQuestions: interview.exchanges.length,
            });
        }

        const user = await User.findById(req.user.id);

        const conversationHistory = interview.exchanges.map((ex, i) => ({
            role: i % 2 === 0 ? "assistant" : "user",
            content: ex.question + (ex.answer ? `\nCandidate answered: ${ex.answer}` : ""),
        }));

        const nextQuestionPrompt = `You are interviewing for ${interview.jobRole}.
Resume: ${user.resumeText?.substring(0, 1000)}

Previous conversation:
${interview.exchanges
                .map((ex) => `Q: ${ex.question}\nA: ${ex.answer}`)
                .join("\n\n")}

Based on the candidate's last answer, ask a relevant follow-up or next interview question.
Make it progressively deeper. Return ONLY the question.`;

        const completion = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: nextQuestionPrompt }],
            max_tokens: 200,
        });

        const nextQuestion = completion.choices[0].message.content.trim();

        interview.exchanges.push({
            question: nextQuestion,
            answer: "",
            feedback: "",
        });

        await interview.save();

        res.json({
            success: true,
            question: nextQuestion,
            questionNumber: interview.exchanges.length,
            isComplete: false,
            totalQuestions: maxQuestions,
        });
    } catch (error) {
        console.error("Submit answer error:", error);
        res.status(500).json({ success: false, message: "Error processing answer" });
    }
};

const getInterviewHistory = async (req, res) => {
    try {
        const interviews = await Interview.find({ user: req.user.id })
            .select("jobRole type status createdAt analysis.overallScore")
            .sort({ createdAt: -1 });

        res.json({ success: true, interviews });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getInterview = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ success: false, message: "Interview not found" });
        }

        if (interview.user.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        res.json({ success: true, interview });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { startInterview, submitAnswer, getInterviewHistory, getInterview };
