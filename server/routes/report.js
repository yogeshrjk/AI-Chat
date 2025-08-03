const express = require("express");
const FormData = require("form-data");
const axios = require("axios");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
require("dotenv").config();

const reportRouter = express.Router();

reportRouter.post("/report", upload.array("files"), async (req, res) => {
  const { title, description } = req.body;
  const files = req.files;

  // DEBUGGING: Log received files
  console.log("Received files:", files?.length || 0);
  if (files?.length > 0) {
    files.forEach((file, index) => {
      console.log(`File ${index}:`, {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        bufferLength: file.buffer?.length,
      });
    });
  }

  const form = new FormData();
  form.append("summary", title);
  form.append("description", description);
  form.append("team_id", "86159");
  form.append("project_id", process.env.BUGASURA_PROJECT_ID);
  form.append("sprint_id", "130832");

  try {
    // Step 1: Create issue first
    const response = await axios.post(
      "https://api.bugasura.io/issues/add",
      form,
      {
        headers: {
          Authorization: `Basic ${process.env.BUGASURA_API_KEY}`,
          ...form.getHeaders(),
        },
      }
    );

    const issueData = response.data;
    const issueKey = issueData.issue_details.issue_key;

    // Step 2: Upload attachments if files exist
    if (files?.length > 0) {
      console.log("Uploading attachments for issue:", issueKey);

      // SOLUTION: Use axios consistently with proper file buffer handling
      const attachmentForm = new FormData();
      attachmentForm.append("team_id", "86159");
      attachmentForm.append("issue_key", issueKey);

      // SOLUTION: Properly append file buffers with metadata
      for (const file of files) {
        attachmentForm.append("issue_files[]", file.buffer, {
          filename: file.originalname,
          contentType: file.mimetype,
        });
      }

      // SOLUTION: Use axios instead of fetch for consistency
      await axios.post(
        "https://api.bugasura.io/issues/attachments/add",
        attachmentForm,
        {
          headers: {
            Authorization: `Basic ${process.env.BUGASURA_API_KEY}`,
            ...attachmentForm.getHeaders(),
          },
        }
      );

      console.log("Attachments uploaded successfully");
    }

    res.json(issueData);
  } catch (err) {
    console.error("Error details:", err.response?.data || err.message);
    res.status(500).json({
      error: "Failed to report bug",
      details: err.response?.data || err.message,
    });
  }
});

module.exports = reportRouter;
