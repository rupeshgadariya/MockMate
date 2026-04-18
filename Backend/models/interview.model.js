const mongoose = require("mongoose");

const exchangeSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, default: "" },
    feedback: { type: String, default: "" },
});

const interviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        type: {
            type: String,
            enum: ["text", "voice"],
            default: "text",
        },

        jobRole: {
            type: String,
            required: true,
            default: "Software Engineer",
        },

        exchanges: [exchangeSchema],

        status: {
            type: String,
            enum: ["in-progress", "completed"],
            default: "in-progress",
        },

        analysis: {
            overallScore: { type: Number, default: 0 },
            strengths: [String],
            improvements: [String], detailedFeedback: { type: String, default: "" },
            skillScores: {
                communication: { type: Number, default: 0 },
                technicalKnowledge: { type: Number, default: 0 },
                problemSolving: { type: Number, default: 0 },
                confidence: { type: Number, default: 0 },
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Interview", interviewSchema);
