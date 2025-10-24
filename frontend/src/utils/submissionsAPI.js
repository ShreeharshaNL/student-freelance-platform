import API from "./api";

export const submissionsAPI = {
  createSubmission: async (submissionData) => {
    const response = await API.post("/submissions", submissionData);
    return response.data;
  },

  getProjectSubmissions: async (projectId) => {
    const response = await API.get(`/submissions/project/${projectId}`);
    return response.data;
  },

  getMySubmissions: async () => {
    const response = await API.get("/submissions/my-submissions");
    return response.data;
  },

  getSubmissionById: async (submissionId) => {
    const response = await API.get(`/submissions/${submissionId}`);
    return response.data;
  },

  reviewSubmission: async (submissionId, action, comment, requestedChanges) => {
    const response = await API.post(`/submissions/${submissionId}/review`, {
      action,
      comment,
      requestedChanges,
    });
    return response.data;
  },

  deleteSubmission: async (submissionId) => {
    const response = await API.delete(`/submissions/${submissionId}`);
    return response.data;
  },
};
