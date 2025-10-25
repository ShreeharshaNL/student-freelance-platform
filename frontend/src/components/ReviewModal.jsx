import React, { useState } from "react";
import { reviewsAPI } from "../utils/reviewsAPI";

const ReviewModal = ({ isOpen, onClose, projectId, revieweeId, revieweeName, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [categories, setCategories] = useState({
    communication: 0,
    quality: 0,
    professionalism: 0,
    timeliness: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    if (!comment.trim()) {
      setError("Please write a comment");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await reviewsAPI.createReview({
        projectId,
        revieweeId,
        rating,
        comment: comment.trim(),
        categories: {
          communication: categories.communication || 0,
          quality: categories.quality || 0,
          professionalism: categories.professionalism || 0,
          timeliness: categories.timeliness || 0
        },
      });

      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      console.error("Error submitting review:", err);
      setError(err.response?.data?.error || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoverRating(0);
    setComment("");
    setCategories({
      communication: 0,
      quality: 0,
      professionalism: 0,
      timeliness: 0,
    });
    setError(null);
    onClose();
  };

  const StarRating = ({ value, onChange, label }) => (
    <div className="flex items-center gap-2">
      {label && <span className="text-sm text-gray-600 w-32">{label}</span>}
      <div 
        className="flex gap-1"
        onMouseLeave={() => !label && setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => !label && setHoverRating(star)}
            className="text-2xl focus:outline-none transition-transform hover:scale-110"
          >
            {star <= (label ? value : (hoverRating || rating)) ? "⭐" : "☆"}
          </button>
        ))}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600">
              How was your experience with <span className="font-semibold">{revieweeName}</span>?
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Overall Rating *
              </label>
              <StarRating value={rating} onChange={setRating} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Rate Specific Areas (Optional)
              </label>
              <div className="space-y-3">
                <StarRating
                  label="Communication"
                  value={categories.communication}
                  onChange={(val) => setCategories({ ...categories, communication: val })}
                />
                <StarRating
                  label="Quality of Work"
                  value={categories.quality}
                  onChange={(val) => setCategories({ ...categories, quality: val })}
                />
                <StarRating
                  label="Professionalism"
                  value={categories.professionalism}
                  onChange={(val) => setCategories({ ...categories, professionalism: val })}
                />
                <StarRating
                  label="Timeliness"
                  value={categories.timeliness}
                  onChange={(val) => setCategories({ ...categories, timeliness: val })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={5}
                maxLength={1000}
                placeholder="Share your experience working on this project..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                {comment.length}/1000 characters
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || rating === 0 || !comment.trim()}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
