import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { applicationsAPI } from "../utils/applicationsAPI";
import { getStatusLabel, getStatusBadgeClass } from "../utils/status";

const ClientApplications = () => {
  const [selectedProject, setSelectedProject] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projects, setProjects] = useState([]);
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
        const fetchProjects = async () => {
      try {
        setLoading(true);
        console.log('Fetching client projects with applications...');
        const response = await applicationsAPI.getMyProjects();
        console.log('Raw response:', response);
        console.log('Response data:', response.data);
        if (!response.data.success) {
          throw new Error(response.data.error || 'Failed to fetch projects');
        }
        console.log('Projects data:', response.data.data);
        const projectsData = response.data.data;        // Flatten applications from all projects
        const allApplications = [];
        console.log('Starting to flatten applications...');
        projectsData.forEach(project => {
          console.log('Project details:', {
            id: project._id,
            title: project.title,
            applicationsCount: project.applicationsCount,
            hasApplicationsArray: Array.isArray(project.applications),
            applicationsLength: project.applications ? project.applications.length : 0,
            applications: project.applications
          });
          if (!Array.isArray(project.applications)) {
            console.warn(`Project ${project._id} has no applications array`);
            return;
          }
          
          project.applications.forEach(app => {
            console.log('Processing application:', app);
            // Skip if missing required fields
            if (!app || !app.student) {
              console.warn('Invalid application data:', app);
              return;
            }

            allApplications.push({
              id: app._id,
              projectId: project._id,
              projectTitle: project.title,
              student: {
                _id: app.student._id, // Add student ID for messaging
                name: app.student.name,
                avatar: app.student.name?.split(" ").map(n => n[0]).join("") || "U",
                rating: app.student.rating || 0,
                completedProjects: app.student.completedProjects || 0,
                skills: app.student.skills || [],
                location: app.student.location || "Not specified",
                responseTime: "2 hours" // Placeholder for now
              },
              appliedDate: new Date(app.createdAt).toLocaleDateString(),
              proposedBudget: `₹${app.proposedBudget}`,
              originalBudget: `₹${project.budget}`,
              timeline: app.timeline || "Not specified",
              coverLetter: app.coverLetter || "",
              questions: app.questions || "",
              portfolio: app.student.portfolio?.map(item => ({
                title: item.title || "Untitled",
                image: "📄", // Placeholder for now
                description: item.description || ""
              })) || [],
              status: app.status || "pending"
            });
          });
        });

        setProjects(projectsData);
        setApplications(allApplications);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleStatusUpdate = async (applicationId, status) => {
    try {
      if (!applicationId) {
        throw new Error("Application ID is required");
      }

      if (!['accepted', 'rejected'].includes(status)) {
        throw new Error("Invalid status: must be 'accepted' or 'rejected'");
      }

      // Show loading state
      setLoading(true);
      setError(null);

      const response = await applicationsAPI.updateApplicationStatus(applicationId, status);
      
      if (!response.data.success) {
        throw new Error(response.data.error || "Failed to update application status");
      }
      
      // Update local state
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app.id === applicationId ? { ...app, status } : app
        )
      );

      // Close modal if open
      if (selectedApplication?.id === applicationId) {
        setSelectedApplication(null);
      }
    } catch (err) {
      console.error("Error updating application status:", err);
      setError(err.response?.data?.error || err.message || "Failed to update application status");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <DashboardLayout userType="client">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    </DashboardLayout>
  );

  if (error) return (
    <DashboardLayout userType="client">
      <div className="p-4 bg-red-50 text-red-800 rounded-lg">
        {error}
      </div>
    </DashboardLayout>
  );

  // Project filter options

  const projectOptions = [
    { id: "all", title: "All Projects", count: applications.length },
    ...projects.map(project => ({
      id: project._id,
      title: project.title,
      count: project.applications.length
    }))
  ];

  const filteredApplications = selectedProject === "all" 
    ? applications 
    : applications.filter(app => app.projectId === selectedProject);

  const getStatusBadge = (status) => {
    const cls = getStatusBadgeClass(status);
    const label = getStatusLabel(status);
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>
        {label}
      </span>
    );
  };

  const renderApplicationModal = () => {
    if (!selectedApplication) return null;

    const app = selectedApplication;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {app.student.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{app.student.name}</h3>
                  <p className="text-gray-600">{app.projectTitle}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedApplication(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Proposal Details */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Proposal Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Proposed Budget</span>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">{app.proposedBudget}</span>
                        <div className="text-xs text-gray-500">Your budget: {app.originalBudget}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Timeline</span>
                      <span className="font-medium text-gray-900">{app.timeline}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Applied</span>
                      <span className="font-medium text-gray-900">{app.appliedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Cover Letter */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Cover Letter</h4>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">{app.coverLetter}</p>
                  </div>
                </div>

                {/* Questions */}
                {app.questions && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Questions for You</h4>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-blue-900">{app.questions}</p>
                    </div>
                  </div>
                )}

                {/* Portfolio */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Portfolio Samples</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {app.portfolio.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="text-3xl mb-2">{item.image}</div>
                        <h5 className="font-medium text-gray-900 mb-1">{item.title}</h5>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Student Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Student Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Rating</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-900">{app.student.rating}</span>
                        <span className="text-yellow-500">⭐</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Projects Done</span>
                      <span className="font-medium text-gray-900">{app.student.completedProjects}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Response Time</span>
                      <span className="font-medium text-gray-900">{app.student.responseTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Location</span>
                      <span className="font-medium text-gray-900">{app.student.location}</span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {app.student.skills.map((skill, index) => (
                      <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  {app.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(app.id, 'accepted')}
                        className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Accept Application
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(app.id, 'rejected')}
                        className="w-full px-4 py-3 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => navigate(`/client/messages?userId=${app.student._id}`)}
                    className="w-full px-4 py-3 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Message Student
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout userType="client">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Applications Received</h1>
            <p className="text-gray-600 mt-1">Review and manage applications for your posted projects</p>
          </div>
          <button 
            onClick={() => navigate('/client/post-project')}
            className="mt-4 sm:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Post New Project
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-xl">📝</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{applications.length}</div>
                <div className="text-sm text-gray-600">Total Applications</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-xl">⏳</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{applications.filter(a => a.status === 'pending').length}</div>
                <div className="text-sm text-gray-600">Pending Review</div>
              </div>
            </div>
          </div>
          {/* Shortlisted card removed - feature not used */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-xl">✅</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{applications.filter(a => a.status === 'accepted').length}</div>
                <div className="text-sm text-gray-600">Accepted</div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Filter */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="flex flex-wrap border-b">
            {projectOptions.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                  selectedProject === project.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {project.title}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedProject === project.id
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {project.count}
                </span>
              </button>
            ))}
          </div>

          {/* Applications List */}
          <div className="divide-y">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <div key={application.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    {/* Student Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        {application.student.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{application.student.name}</h3>
                            <p className="text-sm text-gray-600">{application.student.location}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(application.status)}
                            <span className="text-xs text-gray-500">{application.appliedDate}</span>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <span>⭐</span>
                            <span className="font-medium">{application.student.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>📁</span>
                            <span>{application.student.completedProjects} projects</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>⏱️</span>
                            <span>{application.student.responseTime} response</span>
                          </div>
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {application.student.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                          {application.student.skills.length > 3 && (
                            <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded text-xs">
                              +{application.student.skills.length - 3} more
                            </span>
                          )}
                        </div>

                        {/* Proposal Summary */}
                        <div className="bg-gray-50 p-3 rounded-lg mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <div>
                              <span className="text-gray-600">Proposed Budget: </span>
                              <span className="font-medium text-gray-900">{application.proposedBudget}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Timeline: </span>
                              <span className="font-medium text-gray-900">{application.timeline}</span>
                            </div>
                          </div>
                        </div>

                        {/* Cover Letter Preview */}
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {application.coverLetter}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      <button
                        onClick={() => setSelectedApplication(application)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                      >
                        View Details
                      </button>
                      {application.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(application.id, 'accepted')}
                            className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors text-sm"
                          >
                            Accept
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(application.id, 'rejected')}
                            className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => navigate(`/client/messages?userId=${application.student._id}`)}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        Message
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-600 mb-4">
                  {selectedProject === "all" 
                    ? "Applications will appear here once students apply to your projects"
                    : "No applications for this project yet"
                  }
                </p>
                <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Post New Project
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Review Tips */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Application Review Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-600">✅</span>
              <div>
                <p className="font-medium text-gray-900">Check student ratings and reviews</p>
                <p className="text-sm text-gray-600">Past performance is a good indicator of future work</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600">✅</span>
              <div>
                <p className="font-medium text-gray-900">Review portfolio samples</p>
                <p className="text-sm text-gray-600">Look for work similar to your project needs</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600">✅</span>
              <div>
                <p className="font-medium text-gray-900">Consider response time</p>
                <p className="text-sm text-gray-600">Fast responses often mean better communication</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600">✅</span>
              <div>
                <p className="font-medium text-gray-900">Message before deciding</p>
                <p className="text-sm text-gray-600">A quick chat can clarify project details</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {renderApplicationModal()}
    </DashboardLayout>
  );
};

export default ClientApplications;
