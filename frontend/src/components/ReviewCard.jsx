import React, { useState } from "react";
import { reviewsAPI } from "../utils/reviewsAPI";

const ReviewCard = ({ review, currentUserId, onUpdate }) => {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseComment, setResponseComment] = useState("");
  const [loading, setLoading] = useState(false);

  const canRespond = currentUserId === review.reviewee?._id && !review.response;

  const handleRespond = async (e) => {
    e.preventDefault();
    if (!responseComment.trim()) return;

    try {
      setLoading(true);
      await reviewsAPI.respondToReview(review._id, responseComment.trim());
      setShowResponseForm(false);
      setResponseComment("");
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Error responding to review:", err);
      alert(err.response?.data?.error || "Failed to respond to review");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="text-yellow-500">
            {star <= rating ? "⭐" : "☆"}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
            {review.reviewer?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{review.reviewer?.name || "Anonymous"}</h4>
            <p className="text-sm text-gray-500 capitalize">{review.reviewerRole}</p>
            <p className="text-xs text-gray-400 mt-1">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          {renderStars(review.rating)}
          <span className="text-sm font-semibold text-gray-700">{review.rating}/5</span>
        </div>
      </div>

      <p className="text-gray-700 leading-relaxed">{review.comment}</p>

      {review.categories && (
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Communication</span>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((star) => (
                <span key={star} className={`text-xs ${star <= (review.categories.communication || 0) ? "text-yellow-500" : "text-gray-300"}`}>
                  {star <= (review.categories.communication || 0) ? "⭐" : "☆"}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Quality</span>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((star) => (
                <span key={star} className={`text-xs ${star <= (review.categories.quality || 0) ? "text-yellow-500" : "text-gray-300"}`}>
                  {star <= (review.categories.quality || 0) ? "⭐" : "☆"}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Professionalism</span>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((star) => (
                <span key={star} className={`text-xs ${star <= (review.categories.professionalism || 0) ? "text-yellow-500" : "text-gray-300"}`}>
                  {star <= (review.categories.professionalism || 0) ? "⭐" : "☆"}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Timeliness</span>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map((star) => (
                <span key={star} className={`text-xs ${star <= (review.categories.timeliness || 0) ? "text-yellow-500" : "text-gray-300"}`}>
                  {star <= (review.categories.timeliness || 0) ? "⭐" : "☆"}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {review.project && (
        <div className="pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            Project: <span className="font-medium text-gray-900">{review.project.title}</span>
          </p>
        </div>
      )}

      {review.response && (
        <div className="mt-4 ml-12 bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-500">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-gray-900">Response from {review.reviewee?.name}</span>
            <span className="text-xs text-gray-500">{formatDate(review.response.createdAt)}</span>
          </div>
          <p className="text-sm text-gray-700">{review.response.comment}</p>
        </div>
      )}

      {canRespond && !showResponseForm && (
        <button
          onClick={() => setShowResponseForm(true)}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Respond to this review
        </button>
      )}

      {showResponseForm && (
        <form onSubmit={handleRespond} className="mt-4 ml-12 space-y-3">
          <textarea
            value={responseComment}
            onChange={(e) => setResponseComment(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="Write your response..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
            required
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setShowResponseForm(false);
                setResponseComment("");
              }}
              className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !responseComment.trim()}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-300"
            >
              {loading ? "Posting..." : "Post Response"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ReviewCard;
