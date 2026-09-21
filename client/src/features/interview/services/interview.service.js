import api from "./interview.api";

const BASE_PATH = "/api/interview";

/**
 * Generates a new AI interview report.
 * @param {{ resume: File, jobDescription: string, selfDescription?: string }} payload
 * @param {(percent: number) => void} [onUploadProgress]
 * @returns {Promise<object>} created report
 */
export async function generateReport(payload, onUploadProgress) {
  const formData = new FormData();
  formData.append("resume", payload.resume);
  formData.append("jobDescription", payload.jobDescription);
  if (payload.selfDescription) {
    formData.append("selfDescription", payload.selfDescription);
  }

  const { data } = await api.post(`${BASE_PATH}/generate-report`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (!onUploadProgress || !event.total) return;
      onUploadProgress(Math.round((event.loaded * 100) / event.total));
    },
  });

  return data;
}

/**
 * Fetches all reports for the current user, optionally filtered by search term.
 * @param {string} [search]
 * @returns {Promise<object[]>}
 */
export async function getReports(search) {
  const { data } = await api.get(`${BASE_PATH}/reports`, {
    params: search ? { search } : undefined,
  });
  return data;
}

/**
 * Fetches a single report by id.
 * @param {string} interviewId
 * @returns {Promise<object>}
 */
export async function getReport(interviewId) {
  const { data } = await api.get(`${BASE_PATH}/report/${interviewId}`);
  return data;
}

/**
 * Renames a report.
 * @param {string} interviewId
 * @param {string} title
 * @returns {Promise<object>}
 */
export async function renameReport(interviewId, title) {
  const { data } = await api.patch(`${BASE_PATH}/report/${interviewId}`, { title });
  return data;
}

/**
 * Deletes a report.
 * @param {string} interviewId
 * @returns {Promise<object>}
 */
export async function deleteReport(interviewId) {
  const { data } = await api.delete(`${BASE_PATH}/report/${interviewId}`);
  return data;
}

/**
 * Downloads the report PDF as a Blob.
 * @param {string} interviewId
 * @returns {Promise<Blob>}
 */
export async function downloadPdf(interviewId) {
  const response = await api.get(`${BASE_PATH}/report/${interviewId}/export-pdf`, {
    responseType: "blob",
  });
  return response.data;
}