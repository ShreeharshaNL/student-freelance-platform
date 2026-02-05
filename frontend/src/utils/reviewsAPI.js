import API from "./api";

export const reviewsAPI = {
  createReview: async (reviewData) => {
    const response = await API.post("/reviews", reviewData);
    return response.data;
  },

  getReviewsForUser: async (userId, page = 1, limit = 10) => {
    const response = await API.get(`/reviews/user/${userId}`, {
      params: { page, limit },
    });
    return response.data;
  },

  getReviewsForProject: async (projectId) => {
    const response = await API.get(`/reviews/project/${projectId}`);
    return response.data;
  },

  getMyReviews: async (type = "received") => {
    try {
      const response = await API.get("/reviews/my-reviews", {
        params: { type },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  canReview: async (projectId) => {
    const response = await API.get(`/reviews/can-review/${projectId}`);
    return response.data;
  },

  respondToReview: async (reviewId, comment) => {
    const response = await API.post(`/reviews/${reviewId}/respond`, { comment });
    return response.data;
  },

  deleteReview: async (reviewId) => {
    const response = await API.delete(`/reviews/${reviewId}`);
    return response.data;
  },
};
