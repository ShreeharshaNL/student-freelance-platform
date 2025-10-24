import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { projectsAPI } from "../utils/projectsAPI";
import { normalizeStatus, getStatusLabel, getStatusBadgeClass } from "../utils/status";

const StudentActiveProjects = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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

        const data = res.data.data || [];

        // Build project list for active projects (accepted or project in-progress)
        const active = data
          .map(item => {
            const proj = item.project || {};
            return {
              id: proj._id,
              title: proj.title,
              client: proj.client?.name || proj.client?.name || "Client",
              budget: proj.budget || 0,
              status: proj.status || item.status || "in_progress",
              progress: item.progress || 0,
              deadline: proj.deadline,
              startDate: item.appliedAt || null,
              description: proj.description || "",
              milestones: [],
              messages: 0,
              lastUpdate: ""
            };
          })
          .filter(p => p.status === 'in-progress' || p.status === 'accepted' || p.status === 'in_progress');

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
    : projects.filter(project => normalizeStatus(project.status) === activeFilter);

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
                            <span>👤 {project.client}</span>
                            <span>💰 {project.budget}</span>
                            <span>📅 Due: {project.deadline}</span>
                            <span>📝 {project.messages} messages</span>
                          </div>
                          <p className="text-gray-600 text-sm">{project.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(project.status)}
                          <span className="text-xs text-gray-500">Updated {project.lastUpdate}</span>
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
                          <span>Started {project.startDate}</span>
                          <span>{getDaysLeft(project.deadline)} days left</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-48">
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                        View Details
                      </button>
                      <button className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm">
                        Message Client
                      </button>
                      <button className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        Update Progress
                      </button>
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
    </DashboardLayout>
  );
};

export default StudentActiveProjects;
