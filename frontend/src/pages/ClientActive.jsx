import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { applicationsAPI } from '../utils/applicationsAPI';
import { useNavigate } from 'react-router-dom';
import { normalizeStatus } from '../utils/status';
import ReviewModal from '../components/ReviewModal';
import ReviewSubmissionModal from '../components/ReviewSubmissionModal';
import { submissionsAPI } from '../utils/submissionsAPI';

const ClientActive = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeHires, setActiveHires] = useState([]);
  const navigate = useNavigate();
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    projectId: null,
    revieweeId: null,
    revieweeName: "",
  });
  const [reviewSubmissionModal, setReviewSubmissionModal] = useState({
    isOpen: false,
    submission: null,
  });
  const [pendingSubmissions, setPendingSubmissions] = useState([]);

  useEffect(() => {
    const fetchActiveHires = async () => {
      try {
        setLoading(true);
        const res = await applicationsAPI.getMyProjects();
        if (!res.data.success) {
          throw new Error(res.data.error || 'Failed to fetch projects');
        }

        const projects = res.data.data || [];
        // For each project, find accepted or in-progress application
        const hires = projects
          .map(project => {
            const acceptedApp = (project.applications || []).find(a => normalizeStatus(a.status) === 'in_progress');
            if (!acceptedApp) return null;
            return {
              projectId: project._id,
              projectTitle: project.title,
              budget: project.budget,
              student: acceptedApp.student,
              applicationId: acceptedApp._id,
              startedAt: acceptedApp.createdAt,
              projectStatus: project.status
            };
          })
          .filter(Boolean);

        setActiveHires(hires);
      } catch (err) {
        console.error('Error fetching active hires:', err);
        setError(err.message || 'Failed to load active hires');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveHires();
    fetchPendingSubmissions();
  }, []);

  const fetchPendingSubmissions = async () => {
    try {
      const res = await submissionsAPI.getMySubmissions();
      if (res.success) {
        const pending = res.data.filter(s => s.status === "under_review");
        setPendingSubmissions(pending);
      }
    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userType="client">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userType="client">
        <div className="p-4 bg-red-50 text-red-800 rounded-lg">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="client">
      <div className="space-y-6">
        {pendingSubmissions.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <div className="flex items-start">
              <span className="text-2xl mr-3">⏰</span>
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900">Pending Reviews</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  You have {pendingSubmissions.length} submission(s) waiting for your review
                </p>
                <div className="mt-3 space-y-2">
                  {pendingSubmissions.map((sub) => (
                    <div key={sub._id} className="bg-white p-3 rounded border border-yellow-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{sub.title}</p>
                          <p className="text-sm text-gray-600">{sub.project?.title}</p>
                        </div>
                        <button
                          onClick={() => setReviewSubmissionModal({ isOpen: true, submission: sub })}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                        >
                          Review Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Active Hires</h1>
            <p className="text-gray-600 mt-1">Students you've hired — manage ongoing work and message them</p>
          </div>
        </div>

        {activeHires.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active hires yet</h3>
            <p className="text-gray-600">Once you accept applications, active hires will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeHires.map(hire => (
              <div key={hire.applicationId} className="bg-white p-4 rounded-lg border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {hire.student.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{hire.student.name}</h3>
                      <p className="text-sm text-gray-600">{hire.student.location || 'Not specified'}</p>
                      <div className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">{hire.projectTitle}</span> • ₹{hire.budget}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <button
                      onClick={() => navigate(`/client/messages?userId=${hire.student._id}`)}
                      className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm"
                    >
                      Message
                    </button>
                    <button
                      onClick={() => navigate(`/projects/${hire.projectId}`)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      View Project
                    </button>
                    {normalizeStatus(hire.projectStatus) === "completed" && (
                      <button
                        onClick={() => setReviewModal({
                          isOpen: true,
                          projectId: hire.projectId,
                          revieweeId: hire.student._id,
                          revieweeName: hire.student.name,
                        })}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                      >
                        ⭐ Leave Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ReviewSubmissionModal
        isOpen={reviewSubmissionModal.isOpen}
        onClose={() => setReviewSubmissionModal({ isOpen: false, submission: null })}
        submission={reviewSubmissionModal.submission}
        onSuccess={() => {
          alert("Review submitted!");
          fetchPendingSubmissions();
          window.location.reload();
        }}
      />

      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ isOpen: false, projectId: null, revieweeId: null, revieweeName: "" })}
        projectId={reviewModal.projectId}
        revieweeId={reviewModal.revieweeId}
        revieweeName={reviewModal.revieweeName}
        onSuccess={() => {
          alert("Review submitted successfully!");
        }}
      />
    </DashboardLayout>
  );
};

export default ClientActive;
