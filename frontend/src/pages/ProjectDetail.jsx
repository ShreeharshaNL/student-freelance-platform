import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import API from "../utils/api"; // Import base API utility
import { projectsAPI } from "../utils/projectsAPI";
import { applicationsAPI } from "../utils/applicationsAPI";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [similarProjects, setSimilarProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    proposedBudget: "",
    timeline: "",
    questions: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [applicationError, setApplicationError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await projectsAPI.getProjectById(id);
        if (response.data.success) {
          const projectData = response.data.data;
          // Format the project data
          setProject({
            ...projectData,
            budget: `₹${projectData.budget}`,
            client: {
              name: projectData.user.name,
              avatar: projectData.user.name.split(' ').map(n => n[0]).join(''),
              rating: projectData.user.rating || 0,
              projectsPosted: projectData.user.projectsPosted || 0,
              hiredStudents: projectData.user.hiredStudents || 0,
              memberSince: new Date(projectData.user.createdAt).toLocaleDateString(),
              location: projectData.user.location || 'Remote',
              company: projectData.user.company || ''
            },
            skills: projectData.skillsRequired || [],
            faqs: projectData.faqs || [],
            attachments: projectData.attachments || [],
            deadline: new Date(projectData.deadline).toLocaleDateString()
          });
          
          // Fetch similar projects
          const similarResponse = await projectsAPI.getProjects({
            category: projectData.category,
            limit: 3,
            exclude: id
          });
          setSimilarProjects(formatProjects(similarResponse.data.projects || []));
        }
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load project details");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // Check if user has already applied
  useEffect(() => {
    const checkApplication = async () => {
      if (user && user.role === 'student') {
        try {
          const response = await applicationsAPI.getMyApplications();
          const hasApplied = response.data.data.some(
            app => app.project._id === id
          );
          setHasApplied(hasApplied);
        } catch (err) {
          console.error("Error checking application status:", err);
        }
      }
    };

    checkApplication();
  }, [id, user]);
  // Format similar projects
  const formatProjects = (projects) => {
    return projects.map(proj => ({
      id: proj._id,
      title: proj.title,
      budget: `₹${proj.budget}`,
      client: proj.user.name,
      applications: proj.applicationsCount || 0
    }));
  };

  const handleApplicationSubmit = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/projects/${id}` } });
      return;
    }

    if (user.role !== 'student') {
      setApplicationError('Only students can apply to projects');
      return;
    }

    // Validate fields
    if (!applicationData.coverLetter.trim()) {
      setApplicationError('Please provide a cover letter');
      return;
    }

    if (!applicationData.proposedBudget) {
      setApplicationError('Please enter your proposed budget');
      return;
    }

    if (applicationData.proposedBudget < 0) {
      setApplicationError('Budget cannot be negative');
      return;
    }

    if (!applicationData.timeline) {
      setApplicationError('Please select an estimated timeline');
      return;
    }

    setSubmitting(true);
    setApplicationError(null);

    try {
      console.log('Submitting application:', applicationData); // Debug log

      // Convert proposed budget to number
      const formData = {
        ...applicationData,
        proposedBudget: Number(applicationData.proposedBudget)
      };

      const response = await API.post(`/applications/project/${id}`, formData);
      console.log('Application response:', response); // Debug log

      if (response.data.success) {
        setShowApplicationForm(false);
        setHasApplied(true);
        navigate('/student/applications', { 
          state: { message: 'Application submitted successfully!', type: 'success' } 
        });
      } else {
        setApplicationError(response.data.error || 'Failed to submit application');
      }
    } catch (err) {
      console.error('Application error:', err); // Debug log
      setApplicationError(
        err.response?.data?.error || 
        err.message || 
        'Failed to submit application. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderApplicationForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Apply for Project</h3>
            <button 
              onClick={() => setShowApplicationForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter *
            </label>
            <textarea
              rows="6"
              placeholder="Tell the client why you're perfect for this project. Mention your relevant experience and what makes you stand out..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={applicationData.coverLetter}
              onChange={(e) => setApplicationData(prev => ({...prev, coverLetter: e.target.value}))}
            />
            <p className="text-sm text-gray-500 mt-1">Be specific and personalized</p>
          </div>

          {/* Proposed Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proposed Budget *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">₹</span>
              <input
                type="number"
                placeholder="3500"
                className="w-full pl-8 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={applicationData.proposedBudget}
                onChange={(e) => setApplicationData(prev => ({...prev, proposedBudget: e.target.value}))}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Client's budget: {project.budget}</p>
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Timeline *
            </label>
            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={applicationData.timeline}
              onChange={(e) => setApplicationData(prev => ({...prev, timeline: e.target.value}))}
            >
              <option value="">Select timeline</option>
              <option value="3-5 days">3-5 days</option>
              <option value="1 week">1 week</option>
              <option value="2 weeks">2 weeks</option>
              <option value="3-4 weeks">3-4 weeks</option>
            </select>
          </div>

          {/* Questions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Questions for Client (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="Any questions about the project requirements, timeline, or expectations?"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={applicationData.questions}
              onChange={(e) => setApplicationData(prev => ({...prev, questions: e.target.value}))}
            />
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex gap-3">
          <button
            onClick={() => setShowApplicationForm(false)}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          {applicationError && (
            <div className="p-3 mb-4 text-sm text-red-600 bg-red-50 rounded-lg">
              {applicationError}
            </div>
          )}
          <button
            onClick={handleApplicationSubmit}
            disabled={submitting}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {submitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout userType={user?.role || "student"}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userType={user?.role || "student"}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Project</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!project) {
    return (
      <DashboardLayout userType={user?.role || "student"}>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Project Not Found</h2>
          <p className="text-yellow-600">This project may have been removed or is no longer available.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType={user?.role || "student"}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>📅 Posted {new Date(project.createdAt).toLocaleDateString()}</span>
                    <span>📍 {project.user.location || 'Remote'}</span>
                    <span>📝 {project.applicationsCount} applications</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'open' 
                    ? 'bg-green-100 text-green-800'
                    : project.status === 'in-progress'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Budget:</span>
                  <span className="text-xl font-bold text-indigo-600">{project.budget}</span>
                  <span className="text-gray-500">({project.budgetType})</span>
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Deadline:</span>
                  <span className="text-gray-700">{project.deadline}</span>
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Experience:</span>
                  <span className="text-gray-700">{project.experienceLevel}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>

              {user?.role === 'student' ? (
                hasApplied ? (
                  <button
                    disabled
                    className="w-full bg-gray-100 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Already Applied
                  </button>
                ) : project.status === 'open' ? (
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                  >
                    Apply Now
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-100 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
                  >
                    Project {project.status}
                  </button>
                )
              ) : !user ? (
                <button
                  onClick={() => navigate('/login', { state: { from: `/projects/${id}` } })}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Login to Apply
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-100 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed"
                >
                  Only Students Can Apply
                </button>
              )}
            </div>

            {/* Project Description */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Description</h2>
              <div className="prose prose-gray max-w-none">
                {project.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Attachments */}
            {project.attachments && project.attachments.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Files</h3>
                <div className="space-y-3">
                  {project.attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <span className="text-2xl">📄</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{file.size}</p>
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            {project.faqs.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {project.faqs.map((faq, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <h4 className="font-medium text-gray-900 mb-2">Q: {faq.question}</h4>
                      <p className="text-gray-600 text-sm">A: {faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Client</h3>
              
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {project.client.avatar}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{project.client.name}</h4>
                  <p className="text-sm text-gray-600">{project.client.company}</p>
                  <p className="text-xs text-gray-500">{project.client.location}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-900">{project.client.rating}</span>
                    <span className="text-yellow-500">⭐</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Projects Posted</span>
                  <span className="font-medium text-gray-900">{project.client.projectsPosted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Students Hired</span>
                  <span className="font-medium text-gray-900">{project.client.hiredStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium text-gray-900">{project.client.memberSince}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate(`/client/${project.user._id}`)}
                className="w-full mt-4 px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                View Client Profile
              </button>
            </div>

            {/* Similar Projects */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Projects</h3>
              <div className="space-y-4">
                {similarProjects.length > 0 ? (
                  similarProjects.map((similar) => (
                    <div 
                      key={similar.id} 
                      className="border-b pb-4 last:border-b-0 cursor-pointer"
                      onClick={() => navigate(`/projects/${similar.id}`)}
                    >
                      <h4 className="font-medium text-gray-900 mb-1 hover:text-indigo-600">
                        {similar.title}
                      </h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">by {similar.client}</span>
                        <span className="font-medium text-gray-900">{similar.budget}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{similar.applications} applications</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No similar projects found</p>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
              <h4 className="font-semibold text-gray-900 mb-3">💡 Application Tips</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Read the project description carefully</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Mention specific relevant experience</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Ask thoughtful questions</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Propose a realistic timeline</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showApplicationForm && renderApplicationForm()}
    </DashboardLayout>
  );
};

export default ProjectDetail;
