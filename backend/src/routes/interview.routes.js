const express = require('express');
const authUserMiddleware = require('../middlewares/auth.middleware');
const interviewController = require('../controllers/interview.controller');
const upload = require('../middlewares/file.middleware');

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/generate-report
 * @desc Generate interview report
 * @access Private
 */
interviewRouter.post(
    '/generate-report',
    authUserMiddleware,
    upload.single('resume'),
    interviewController.generateInterviewReportController
);

/**
 * @route GET /api/interview/reports
 * @desc Get all reports of logged-in user
 * @access Private
 */
interviewRouter.get(
    '/reports',
    authUserMiddleware,
    interviewController.getAllInterviewReportsController
);

/**
 * @route GET /api/interview/report/:interviewId
 * @desc Get report by id
 * @access Private
 */
interviewRouter.get(
    '/report/:interviewId',
    authUserMiddleware,
    interviewController.getInterviewReportbyIdController
);

/**
 * @route DELETE /api/interview/report/:interviewId
 * @desc Delete report by id
 * @access Private
 */
interviewRouter.delete(
    '/report/:interviewId',
    authUserMiddleware,
    interviewController.deleteInterviewReportController
);

module.exports = interviewRouter;

/**
 * @route GET /api/interview/report/:interviewId/export-pdf
 * @desc Export interview report PDF
 * @access Private
 */
interviewRouter.get(
  '/report/:interviewId/export-pdf',
  authUserMiddleware,
  interviewController.exportInterviewReportPdfController
);

/**
 * @route PATCH /api/interview/report/:interviewId
 * @desc Rename interview report
 * @access Private
 */
interviewRouter.patch(
    "/report/:interviewId",
    authUserMiddleware,
    interviewController.updateInterviewReportTitleController
);