const fs = require("fs");
const path = require("path");
const { PdfReader } = require("pdfreader");
const User = require("../models/user.model");

const uploadResume = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a PDF file",
      });
    }

    const user = await User.findById(req.user.id);
    if (user.resumePath) {
      const oldPath = path.join(__dirname, "..", user.resumePath);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const extractedText = await new Promise((resolve, reject) => {
      let text = "";
      new PdfReader().parseFileItems(req.file.path, (err, item) => {
        if (err) reject(err);
        else if (!item) resolve(text);
        else if (item.text) text += item.text + " ";
      });
    });

    user.resumePath = `uploads/${req.file.filename}`;
    user.resumeText = extractedText.substring(0, 5000);
    await user.save();

    res.json({
      success: true,
      message: "Resume uploaded successfully!",
      resumePath: user.resumePath,
      textPreview: extractedText.substring(0, 200) + "...",
    });
  } catch (error) {
    console.error("Resume upload error:", error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({ success: false, message: "Error uploading resume" });
  }
};

const getResumeInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.resumePath) {
      return res.json({
        success: true,
        hasResume: false,
        message: "No resume uploaded yet",
      });
    }

    res.json({
      success: true,
      hasResume: true,
      resumePath: user.resumePath,
      textPreview: user.resumeText
        ? user.resumeText.substring(0, 200) + "..."
        : "No text extracted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { uploadResume, getResumeInfo };
