const pdfParse = require('pdf-parse');
const { generateInterviewReport } = require('../services/ai.service');
const interviewReportModel = require('../models/interviewReport.model');
const {
  generateInterviewReportPDF
} = require("../services/pdf.service");

async function generateInterviewReportController(req, res) {
    try {
        if (!req.file) { 
            return res.status(400).json({
                message: 'Resume file is required'
            });
        }

        const resumeContent = await (
            new pdfParse.PDFParse(
                Uint8Array.from(req.file.buffer)
            )
        ).getText();

        const { jobDescription, selfDescription } = req.body;

        const interviewReportbyAi =
            await generateInterviewReport({
                resume: resumeContent.text,
                jobDescription,
                selfDescription
            });
            console.log(
                "Before saving:",
                JSON.stringify(interviewReportbyAi, null, 2)
            );

        const interviewReport =
            await interviewReportModel.create({
                
                user: req.user.id,
                resume: resumeContent.text,
                jobDescription,
                selfDescription,
                ...interviewReportbyAi
            });

        res.status(201).json(interviewReport);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

async function getInterviewReportbyIdController(req, res) {
    try {
        const { interviewId } = req.params;

        const interviewReport =
            await interviewReportModel.findOne({
                _id: interviewId,
                user: req.user.id
            });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found"
            });
        }

        res.status(200).json(interviewReport);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

/**
 * GET ALL REPORTS OF LOGGED-IN USER
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const { search = "" } = req.query;

        const reports = await interviewReportModel
            .find({
                user: req.user.id,
                title: {
                    $regex: search,
                    $options: "i"
                }
            })
            .sort({ createdAt: -1 })
            .select("_id title matchScore createdAt updatedAt");

        res.status(200).json(reports);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

/**
 * DELETE REPORT BY ID
 */
async function deleteInterviewReportController(
    req,
    res
) {
    try {
        const { interviewId } = req.params;

        const report =
            await interviewReportModel.findOneAndDelete({
                _id: interviewId,
                user: req.user.id
            });

        if (!report) {
            return res.status(404).json({
                message: "Interview report not found"
            });
        }

        res.status(200).json({
            message:
                "Interview report deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
//rename the interview report title 
async function updateInterviewReportTitleController(req, res) {
    try {
        const { interviewId } = req.params;
        const { title } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const report = await interviewReportModel.findOneAndUpdate(
            {
                _id: interviewId,
                user: req.user.id
            },
            {
                title: title.trim()
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!report) {
            return res.status(404).json({
                message: "Interview report not found"
            });
        }

        res.status(200).json(report);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}
async function exportInterviewReportPdfController(
  req,
  res
) {
  try {
    const { interviewId } =
      req.params;

    const report =
      await interviewReportModel.findOne({
        _id: interviewId,
        user: req.user.id
      });

    if (!report) {
      return res.status(404).json({
        message:
          "Interview report not found"
      });
    }

    await generateInterviewReportPDF(
      report,
      res
    );
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
}

module.exports = {
    generateInterviewReportController,
    getInterviewReportbyIdController,
    getAllInterviewReportsController,
    deleteInterviewReportController,
    exportInterviewReportPdfController,
    updateInterviewReportTitleController
};
