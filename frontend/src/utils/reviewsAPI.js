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
      console.log('🔄 ReviewsAPI.getMyReviews called:', {
        type,
        endpoint: '/reviews/my-reviews',
        token: !!localStorage.getItem('token')
      });

      const response = await API.get("/reviews/my-reviews", {
        params: { type },
      });

      console.log('📦 ReviewsAPI raw response:', {
        status: response.status,
        success: response.data?.success,
        hasData: !!response.data?.data,
        dataLength: response.data?.data?.length
      });

      if (!response.data.success) {
        console.error('❌ ReviewsAPI error:', response.data.error);
      }

      return response.data;
    } catch (error) {
      console.error('❌ ReviewsAPI network error:', {
        message: error.message,
        response: error.response?.data
      });
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
