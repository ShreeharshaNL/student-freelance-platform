import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { projectsAPI } from "../utils/projectsAPI";
import { messagesAPI } from "../utils/messagesAPI";
import { useNavigate } from "react-router-dom";
import { normalizeStatus, getStatusLabel, getStatusBadgeClass } from "../utils/status";
import ReviewModal from "../components/ReviewModal";
import { reviewsAPI } from "../utils/reviewsAPI";
import SubmitProjectModal from "../components/SubmitProjectModal";
import { submissionsAPI } from "../utils/submissionsAPI";

const StudentActiveProjects = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    projectId: null,
    revieweeId: null,
    revieweeName: "",
  });
  const [submitModal, setSubmitModal] = useState({
    isOpen: false,
    projectId: null,
    projectTitle: "",
  });
  const [submissions, setSubmissions] = useState({});

  useEffect(() => {
    const fetchActiveProjects = async () => {
      try {
        setLoading(true);
        // Backend: GET /api/projects/my-applications returns applications for projects student applied to
        const res = await projectsAPI.getMyApplications();
        if (!res.data.success) {
          setProjects([]);
          return;
        }

        console.log('Raw API Response:', res.data);
        const applications = res.data.data || [];
        console.log('Applications:', applications);

        // Build project list for active projects (accepted or in-progress)
        console.log('Building active projects list from applications:', applications);
        const active = applications
          .filter(app => {
            console.log('Checking application:', {
              id: app._id,
              projectId: app.project?._id,
              projectTitle: app.project?.title,
              status: app.status,
              progress: app.progress
            });
            const appStatus = normalizeStatus(app.status);
            console.log('Application status:', { 
              raw: app.status, 
              normalized: appStatus,
              isActive: appStatus === 'in_progress'
            });
            return appStatus === 'in_progress';
          })
          .map(app => {
            console.log('Processing active application:', app);
            const proj = app.project || {};
            console.log('Processing project data:', proj);
            return {
              id: proj._id,
              _id: proj._id,
              title: proj.title,
              client: proj.user || proj.client || null, // Store the full client object
              clientId: proj.user?._id || proj.client?._id, // Store client ID separately
              budget: proj.budget || 0,
              status: app.status,
              progress: app.progress || 0,
              deadline: proj.deadline,
              startDate: app.appliedAt || app.createdAt || null,
              description: proj.description || "",
              milestones: [],
              messages: 0,
              lastUpdate: app.updatedAt || ""
            };
          });
          
        console.log('Processed active projects:', active);
        setProjects(active);

        setProjects(active);
      } catch (err) {
        console.error('Error fetching active projects:', err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveProjects();
  }, []);

  const filters = [
    { id: "all", label: "All Projects", count: projects.length },
    { id: "in_progress", label: "In Progress", count: projects.filter(p => normalizeStatus(p.status) === "in_progress").length },
    { id: "under_review", label: "Under Review", count: projects.filter(p => normalizeStatus(p.status) === "under_review").length },
    { id: "completed", label: "Completed", count: projects.filter(p => normalizeStatus(p.status) === "completed").length }
  ];

  const filteredProjects = activeFilter === "all"
    ? projects
    : projects.filter(project => {
        const normalized = normalizeStatus(project.status);
        console.log('Filtering project:', { status: project.status, normalized, activeFilter });
        return normalized === activeFilter;
      });

  const getStatusBadge = (status) => {
    const cls = getStatusBadgeClass(status);
    const label = getStatusLabel(status);
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${cls}`}>
        {label}
      </span>
    );
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return "bg-green-600";
    if (progress >= 50) return "bg-blue-600";
    if (progress >= 25) return "bg-yellow-600";
    return "bg-gray-600";
  };

  const getDaysLeft = (deadline) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <DashboardLayout userType="student">
      {loading && (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      )}
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Active Projects</h1>
            <p className="text-gray-600 mt-1">Track progress and manage your ongoing work</p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <button className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
              Time Tracker
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Browse New Projects
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-xl">🚀</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{projects.filter(p => normalizeStatus(p.status) === 'in_progress').length}</div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-xl">👁️</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{projects.filter(p => normalizeStatus(p.status) === 'under_review').length}</div>
                <div className="text-sm text-gray-600">Under Review</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-xl">💰</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ₹{projects.reduce((sum, p) => sum + (Number(p.budget) || 0), 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Value</div>
              </div>
            </div>
          </div>
          
          {/* Avg Progress card removed per request */}
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="flex flex-wrap border-b">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeFilter === filter.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {filter.label}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activeFilter === filter.id
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Projects List */}
          <div className="divide-y">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <div key={project.id} className="p-6">
                  {/* Project Header */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{project.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                     <span>👤 {project.client && project.client.name ? project.client.name : 'Client Not Specified'}</span>
                     <span>💰 ₹{Number(project.budget).toLocaleString()}</span>
                     <span>📅 Due: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}</span>
                     <span>📝 {project.messages} messages</span>
                          </div>
                          <p className="text-gray-600 text-sm">{project.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(project.status)}
                          <span className="text-xs text-gray-500">Status: {normalizeStatus(project.status)}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Progress</span>
                          <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(project.progress)}`}
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Started {project.startDate ? new Date(project.startDate).toLocaleString() : 'N/A'}</span>
                          <span>{getDaysLeft(project.deadline)} days left</span>
                          <span className="text-xs text-gray-500">{project.lastUpdate ? `Updated ${new Date(project.lastUpdate).toLocaleString()}` : ''}</span>
                        </div>

                        {/* Submit Project button placed under progress bar to separate it from Update Progress */}
                        {normalizeStatus(project.status) === "in_progress" && (
                          <div className="mt-3">
                            <button
                              onClick={() => setSubmitModal({
                                isOpen: true,
                                projectId: project.id,
                                projectTitle: project.title,
                              })}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              📤 Submit Project
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-48">
                      <button
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        View Details
                      </button>
                      <button
                        className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm"
                        onClick={async () => {
                          try {
                            // Extract client ID from project data
                            const clientId = project.project?.user?._id ||  // Try project.user._id first
                                          project.client?._id ||           // Then try client._id
                                          project.client?.id ||            // Then try client.id
                                          project.clientId;                // Finally try clientId directly
                            
                            console.log('Project data:', project);
                            console.log('Attempting to message client:', { clientId });
                            
                            if (!clientId) {
                              console.error('No client ID found in project:', project);
                              alert('Could not find client information');
                              return;
                            }
                            
                            const response = await messagesAPI.createOrGetConversation(clientId);
                            console.log('Conversation response:', response);
                            
                            if (response?.data?.conversation?._id) {
                              // Navigate to messages page with conversation ID
                              navigate('/student/messages', { 
                                state: { selectedConversation: response.data.conversation._id }
                              });
                            } else {
                              console.error('Invalid conversation response:', response);
                              alert('Could not open conversation');
                            }
                          } catch (err) {
                            console.error('Failed to open conversation:', err);
                            alert('Failed to open conversation: ' + (err.response?.data?.error || err.message));
                          }
                        }}
                      >
                        Message Client
                      </button>
                      {normalizeStatus(project.status) === "in_progress" && (
                        <button
                          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                          onClick={async () => {
                            const newProgress = window.prompt('Enter new progress percentage (0-100):', project.progress);
                            if (newProgress === null) return;
                            const progressNum = Number(newProgress);
                            if (isNaN(progressNum) || progressNum < 0 || progressNum > 100) {
                              alert('Please enter a valid number between 0 and 100.');
                              return;
                            }
                            try {
                              const projectId = project._id || project.id;
                              console.log('Updating progress:', { projectId, progress: progressNum });
                              const response = await projectsAPI.updateProjectProgress(projectId, progressNum);
                              console.log('Progress update response:', response);
                              // Update UI
                              setProjects(prev => prev.map(p => (p.id === project.id || p._id === projectId) ? { ...p, progress: progressNum } : p));
                            } catch (err) {
                              console.error('Progress update error:', err);
                              alert(`Failed to update progress: ${err.response?.data?.error || err.message}`);
                            }
                          }}
                        >
                          Update Progress
                        </button>
                      )}
                      {normalizeStatus(project.status) === "under_review" && (
                        <button
                          disabled
                          className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg cursor-not-allowed transition-colors text-sm"
                        >
                          ⏳ Under Review
                        </button>
                      )}
                      {normalizeStatus(project.status) === "completed" && project.clientId && (
                        <button
                          onClick={() => {
                            console.log("Review button clicked", { projectId: project.id, clientId: project.clientId, clientName: project.client });
                            setReviewModal({
                              isOpen: true,
                              projectId: project.id,
                              revieweeId: project.clientId,
                              revieweeName: project.client,
                            });
                          }}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                        >
                          ⭐ Leave Review
                        </button>
                      )}
                      {normalizeStatus(project.status) === "completed" && !project.clientId && (
                        <div className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm text-center">
                          Client ID missing - cannot review
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Project Milestones</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                      {project.milestones.map((milestone) => (
                        <div
                          key={milestone.id}
                          className={`p-3 rounded-lg border-2 transition-colors ${
                            milestone.completed
                              ? "bg-green-50 border-green-200"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              milestone.completed ? "bg-green-600" : "bg-gray-300"
                            }`}>
                              {milestone.completed && (
                                <span className="text-white text-xs">✓</span>
                              )}
                            </div>
                            <span className={`text-sm font-medium ${
                              milestone.completed ? "text-green-900" : "text-gray-900"
                            }`}>
                              {milestone.title}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            Due: {milestone.dueDate}
                            {milestone.completedDate && (
                              <div className="text-green-600 mt-1">
                                ✅ Completed: {milestone.completedDate}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeFilter === "all" ? "No active projects" : `No ${activeFilter.replace('_', ' ')} projects`}
                </h3>
                <p className="text-gray-600 mb-4">
                  {activeFilter === "all" 
                    ? "Start applying to projects to see them here when you get hired"
                    : `You don't have any ${activeFilter.replace('_', ' ')} projects at the moment`
                  }
                </p>
                {activeFilter === "all" && (
                  <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                    Browse Projects
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Productivity Tips */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Project Management Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-600">✅</span>
              <div>
                <p className="font-medium text-gray-900">Break work into milestones</p>
                <p className="text-sm text-gray-600">Divide projects into smaller, manageable tasks</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600">✅</span>
              <div>
                <p className="font-medium text-gray-900">Communicate regularly</p>
                <p className="text-sm text-gray-600">Keep clients updated on your progress</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600">✅</span>
              <div>
                <p className="font-medium text-gray-900">Meet deadlines</p>
                <p className="text-sm text-gray-600">Deliver work on time to build trust</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600">✅</span>
              <div>
                <p className="font-medium text-gray-900">Ask for feedback</p>
                <p className="text-sm text-gray-600">Get client input early and often</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SubmitProjectModal
        isOpen={submitModal.isOpen}
        onClose={() => setSubmitModal({ isOpen: false, projectId: null, projectTitle: "" })}
        projectId={submitModal.projectId}
        projectTitle={submitModal.projectTitle}
        onSuccess={() => {
          alert("Project submitted for review!");
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

export default StudentActiveProjects;
