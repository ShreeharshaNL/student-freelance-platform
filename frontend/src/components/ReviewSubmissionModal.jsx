import React, { useState } from "react";
import { submissionsAPI } from "../utils/submissionsAPI";

const ReviewSubmissionModal = ({ isOpen, onClose, submission, onSuccess }) => {
  const [action, setAction] = useState("");
  const [comment, setComment] = useState("");
  const [requestedChanges, setRequestedChanges] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!action) {
      setError("Please select an action");
      return;
    }

    if (action === "request_changes" && !comment.trim() && requestedChanges.every(c => !c.trim())) {
      setError("Please provide feedback or requested changes");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const changes = requestedChanges.filter(c => c.trim());
      await submissionsAPI.reviewSubmission(
        submission._id,
        action,
        comment.trim(),
        changes.length > 0 ? changes : undefined
      );

      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      console.error("Error reviewing submission:", err);
      setError(err.response?.data?.error || "Failed to review submission");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAction("");
    setComment("");
    setRequestedChanges([""]);
    setError(null);
    onClose();
  };

  const addChangeField = () => {
    setRequestedChanges([...requestedChanges, ""]);
  };

  const updateChange = (index, value) => {
    const updated = [...requestedChanges];
    updated[index] = value;
    setRequestedChanges(updated);
  };

  const removeChange = (index) => {
    setRequestedChanges(requestedChanges.filter((_, i) => i !== index));
  };

  if (!isOpen || !submission) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Review Submission</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Submission Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{submission.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{submission.description}</p>
            
            <div className="flex flex-wrap gap-2">
              {submission.githubUrl && (
                <a
                  href={submission.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-gray-800 text-white text-sm rounded hover:bg-gray-700"
                >
                  📂 GitHub
                </a>
              )}
              {submission.liveUrl && (
                <a
                  href={submission.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  🌐 Live Demo
                </a>
              )}
              {submission.fileUrl && (
                <a
                  href={submission.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  📎 Files
                </a>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Action Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Decision *
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setAction("approve")}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                    action === "approve"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">✅</span>
                    <div>
                      <div className="font-semibold text-gray-900">Approve & Mark Complete</div>
                      <div className="text-sm text-gray-600">Accept the work and complete the project</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAction("request_changes")}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                    action === "request_changes"
                      ? "border-yellow-500 bg-yellow-50"
                      : "border-gray-200 hover:border-yellow-300"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🔄</span>
                    <div>
                      <div className="font-semibold text-gray-900">Request Changes</div>
                      <div className="text-sm text-gray-600">Ask for revisions or improvements</div>
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setAction("reject")}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                    action === "reject"
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">❌</span>
                    <div>
                      <div className="font-semibold text-gray-900">Reject</div>
                      <div className="text-sm text-gray-600">Not acceptable, major issues</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Feedback */}
            {(action === "request_changes" || action === "reject") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback {action === "request_changes" ? "*" : ""}
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    placeholder="Provide detailed feedback..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  />
                </div>

                {action === "request_changes" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Specific Changes Needed
                    </label>
                    <div className="space-y-2">
                      {requestedChanges.map((change, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={change}
                            onChange={(e) => updateChange(index, e.target.value)}
                            placeholder={`Change ${index + 1}`}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                          />
                          {requestedChanges.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeChange(index)}
                              className="px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addChangeField}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        + Add another change
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

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
                disabled={loading || !action}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmissionModal;
