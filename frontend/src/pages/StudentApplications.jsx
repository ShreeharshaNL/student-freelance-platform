import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { applicationsAPI } from "../utils/applicationsAPI";

const StudentApplications = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
          const fetchApplications = async () => {
      try {
        const response = await applicationsAPI.getMyApplications();
        const formattedApplications = response.data.data.map(app => ({
          id: app._id,
          projectTitle: app.project.title,
          client: app.project.user.name,
          appliedDate: new Date(app.createdAt).toLocaleDateString(),
          status: app.status,
          budget: `₹${app.project.budget}`,
          proposedBudget: `₹${app.proposedBudget}`,
          skills: [], // You might want to get this from project or student profile
          coverLetter: app.coverLetter,
          deadline: new Date(app.project.deadline).toLocaleDateString(),
          message: null,
          timeline: app.timeline,
          project: app.project
        }));
        setApplications(formattedApplications);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load applications');
      } finally {
        setLoading(false);
      }
    };    fetchApplications();
  }, []);

  // Application statuses and their labels
  const statusLabels = {
    pending: "Pending Review",
    accepted: "Accepted",
    rejected: "Rejected",
    in_progress: "In Progress"
  };

  const filters = [
    { id: "all", label: "All Applications", count: applications?.length || 0 },
    { id: "pending", label: "Pending Review", count: applications?.filter(a => a.status === "pending")?.length || 0 },
    { id: "accepted", label: "Accepted", count: applications?.filter(a => a.status === "accepted")?.length || 0 },
    { id: "rejected", label: "Rejected", count: applications?.filter(a => a.status === "rejected")?.length || 0 }
  ];

  const filteredApplications = activeFilter === "all" 
    ? applications || []
    : (applications || []).filter(app => app.status === activeFilter);

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800"
    };

    const statusLabels = {
      pending: "Pending Review",
      accepted: "Accepted",
      rejected: "Rejected"
    };
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: "⏳",
      accepted: "✅",
      rejected: "❌",
      "in_progress": "🔄"
    };

    return icons[status] || "❓"; // Return question mark if status is unknown
  };

  if (loading) {
    return (
      <DashboardLayout userType="student">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        {/* Success Message */}
        {location.state?.message && (
          <div className={`p-4 rounded-lg ${
            location.state?.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {location.state.message}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
            <p className="text-gray-600 mt-1">Track all your project applications and their status</p>
          </div>
          <button className="mt-4 sm:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Browse New Projects
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-xl">📝</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
                <div className="text-sm text-gray-600">Total Applied</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-xl">✅</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {applications.filter(a => a.status === "accepted").length}
                </div>
                <div className="text-sm text-gray-600">Accepted</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-xl">⏳</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {applications.filter(a => a.status === "pending").length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {Math.round((applications.filter(a => a.status === "accepted").length / applications.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
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

          {/* Applications List */}
          <div className="divide-y">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Main Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {application.projectTitle}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                            <span>👤 {application.client}</span>
                            <span>📅 Applied {application.appliedDate}</span>
                            <span>⏰ Deadline: {application.deadline}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {getStatusBadge(application.status)}
                            <span className="text-sm text-gray-500">
                              Budget: {application.budget} | Proposed: {application.proposedBudget}
                            </span>
                          </div>
                        </div>
                        <div className="text-2xl">{getStatusIcon(application.status)}</div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {application.skills.map((skill, index) => (
                          <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Cover Letter Preview */}
                      <div className="mb-3">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          <span className="font-medium">Cover Letter:</span> {application.coverLetter}
                        </p>
                      </div>

                      {/* Message (if any) */}
                      {application.message && (
                        <div className={`p-3 rounded-lg text-sm ${
                          application.status === "accepted" 
                            ? "bg-green-50 border border-green-200 text-green-800"
                            : application.status === "rejected"
                            ? "bg-red-50 border border-red-200 text-red-800"
                            : "bg-blue-50 border border-blue-200 text-blue-800"
                        }`}>
                          <div className="flex items-start gap-2">
                            <span className="font-medium">Client Message:</span>
                          </div>
                          <p className="mt-1">{application.message}</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:w-32">
                      {application.status === "pending" && (
                        <>
                          <button 
                            onClick={() => navigate(`/projects/${application.project._id}`)}
                            className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm"
                          >
                            View Project
                          </button>
                          <button 
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to withdraw your application?')) {
                                try {
                                  await applicationsAPI.deleteApplication(application._id);
                                  setApplications(apps => apps.filter(app => app._id !== application._id));
                                } catch (err) {
                                  setError(err.response?.data?.error || 'Failed to withdraw application');
                                }
                              }
                            }}
                            className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-sm"
                          >
                            Withdraw
                          </button>
                        </>
                      )}
                      {application.status === "accepted" && (
                        <button 
                          onClick={() => navigate(`/projects/${application.project._id}`)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                        >
                          View Project
                        </button>
                      )}
                      <button 
                        onClick={() => navigate(`/projects/${application.project._id}`)}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeFilter === "all" ? "No applications yet" : `No ${activeFilter} applications`}
                </h3>
                <p className="text-gray-600 mb-4">
                  {activeFilter === "all" 
                    ? "Start applying to projects to build your portfolio and earn money"
                    : `You don't have any ${activeFilter} applications at the moment`
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

        {/* Tips Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Application Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-green-600">✅</span>
              <div>
                <p className="font-medium text-gray-900">Write personalized cover letters</p>
                <p className="text-sm text-gray-600">Mention specific project details to show you read the requirements</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600">✅</span>
              <div>
                <p className="font-medium text-gray-900">Propose competitive rates</p>
                <p className="text-sm text-gray-600">Research market rates and price your services competitively</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600">✅</span>
              <div>
                <p className="font-medium text-gray-900">Showcase relevant experience</p>
                <p className="text-sm text-gray-600">Highlight similar projects you've completed successfully</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-600">✅</span>
              <div>
                <p className="font-medium text-gray-900">Respond quickly</p>
                <p className="text-sm text-gray-600">Fast responses show professionalism and enthusiasm</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentApplications;
