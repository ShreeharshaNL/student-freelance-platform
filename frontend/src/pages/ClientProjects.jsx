import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import { projectsAPI } from '../utils/projectsAPI';
import ReviewModal from '../components/ReviewModal';

const ClientProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [editError, setEditError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [reviewModal, setReviewModal] = useState({
    isOpen: false,
    projectId: null,
    revieweeId: null,
    revieweeName: "",
  });
  const navigate = useNavigate();

  const commonSkills = [
    "HTML", "CSS", "JavaScript", "React", "Node.js", "WordPress", "SEO",
    "Photoshop", "Illustrator", "Canva", "Figma", "Content Writing",
    "Data Entry", "Excel", "Social Media", "Digital Marketing",
    "Video Editing", "Translation", "Research", "Customer Service"
  ];

  const categories = [
    { value: "web-development", label: "Web Development" },
    { value: "graphic-design", label: "Graphic Design" },
    { value: "content-writing", label: "Content Writing" },
    { value: "data-entry", label: "Data Entry" },
    { value: "digital-marketing", label: "Digital Marketing" },
    { value: "mobile-app", label: "Mobile App Development" },
    { value: "video-editing", label: "Video Editing" },
    { value: "translation", label: "Translation" }
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsAPI.getMyProjects();
      setProjects(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      'open': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-gray-100 text-gray-800'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setEditFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      budget: project.budget,
      budgetType: project.budgetType,
      deadline: project.deadline.split('T')[0],
      skillsRequired: project.skillsRequired,
      projectType: project.projectType,
      experienceLevel: project.experienceLevel,
      isFeatured: project.isFeatured || false,
      isUrgent: project.isUrgent || false
    });
    setEditError(null);
  };

  const closeEditModal = () => {
    setEditingProject(null);
    setEditFormData({});
    setEditError(null);
  };

  const handleEditInputChange = (field, value) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditSkillToggle = (skill) => {
    setEditFormData(prev => ({
      ...prev,
      skillsRequired: prev.skillsRequired.includes(skill)
        ? prev.skillsRequired.filter(s => s !== skill)
        : [...prev.skillsRequired, skill]
    }));
  };

  const handleEditSubmit = async () => {
    setEditError(null);

    if (!editFormData.title || !editFormData.category || !editFormData.description || !editFormData.budget || !editFormData.deadline) {
      setEditError("Please fill in all required fields");
      return;
    }

    if (editFormData.skillsRequired.length === 0) {
      setEditError("Please select at least one required skill");
      return;
    }

    setIsSubmittingEdit(true);

    try {
      const updateData = {
        title: editFormData.title,
        category: editFormData.category,
        description: editFormData.description,
        budget: Number(editFormData.budget),
        budgetType: editFormData.budgetType,
        skillsRequired: editFormData.skillsRequired,
        deadline: editFormData.deadline,
        experienceLevel: editFormData.experienceLevel,
        projectType: editFormData.projectType,
        isFeatured: editFormData.isFeatured,
        isUrgent: editFormData.isUrgent
      };

      const response = await projectsAPI.updateProject(editingProject._id, updateData);

      if (response.data.success) {
        // Update the projects list
        setProjects(projects.map(p => 
          p._id === editingProject._id ? response.data.data : p
        ));
        closeEditModal();
      }
    } catch (err) {
      console.error('Project update error:', err);
      setEditError(err.response?.data?.error || 'Failed to update project');
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const renderEditModal = () => {
    if (!editingProject) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Edit Project</h2>
            <button 
              onClick={closeEditModal}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-6">
            {editError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{editError}</p>
              </div>
            )}

            {/* Project Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                placeholder="e.g., Create a WordPress blog for my restaurant"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={editFormData.title}
                onChange={(e) => handleEditInputChange('title', e.target.value)}
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={editFormData.category}
                onChange={(e) => handleEditInputChange('category', e.target.value)}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            {/* Project Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Description *
              </label>
              <textarea
                rows="4"
                placeholder="Describe your project in detail..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                value={editFormData.description}
                onChange={(e) => handleEditInputChange('description', e.target.value)}
              />
            </div>

            {/* Skills Required */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills Required *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {commonSkills.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleEditSkillToggle(skill)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      editFormData.skillsRequired.includes(skill)
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Budget Type *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleEditInputChange('budgetType', 'fixed')}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    editFormData.budgetType === 'fixed'
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium text-gray-900">Fixed Price</div>
                  <div className="text-sm text-gray-500">Pay a set amount</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleEditInputChange('budgetType', 'hourly')}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    editFormData.budgetType === 'hourly'
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="font-medium text-gray-900">Hourly Rate</div>
                  <div className="text-sm text-gray-500">Pay per hour</div>
                </button>
              </div>
            </div>

            {/* Budget Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {editFormData.budgetType === 'fixed' ? 'Project Budget *' : 'Hourly Rate *'}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">₹</span>
                <input
                  type="number"
                  placeholder={editFormData.budgetType === 'fixed' ? '5000' : '200'}
                  className="w-full pl-8 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={editFormData.budget}
                  onChange={(e) => handleEditInputChange('budget', e.target.value)}
                />
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Deadline *
              </label>
              <input
                type="date"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={editFormData.deadline}
                onChange={(e) => handleEditInputChange('deadline', e.target.value)}
              />
            </div>

            {/* Project Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Duration
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'short-term', label: 'Short-term', desc: 'Less than 1 month' },
                  { value: 'medium-term', label: 'Medium-term', desc: '1-3 months' },
                  { value: 'long-term', label: 'Long-term', desc: '3+ months' }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleEditInputChange('projectType', option.value)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      editFormData.projectType === option.value
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900 text-sm">{option.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Student Experience Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'beginner', label: 'Beginner', desc: 'New to freelancing' },
                  { value: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
                  { value: 'expert', label: 'Expert', desc: 'Highly experienced' }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleEditInputChange('experienceLevel', option.value)}
                    className={`p-3 border rounded-lg text-center transition-colors ${
                      editFormData.experienceLevel === option.value
                        ? "border-indigo-600 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="font-medium text-gray-900 text-sm">{option.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="edit-featured" 
                  checked={editFormData.isFeatured}
                  onChange={(e) => handleEditInputChange('isFeatured', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="edit-featured" className="text-sm text-gray-700">
                  Make this a featured project
                </label>
              </div>
              
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="edit-urgent" 
                  checked={editFormData.isUrgent}
                  onChange={(e) => handleEditInputChange('isUrgent', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="edit-urgent" className="text-sm text-gray-700">
                  Mark as urgent
                </label>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-6 border-t flex gap-3 justify-end">
            <button
              onClick={closeEditModal}
              disabled={isSubmittingEdit}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleEditSubmit}
              disabled={isSubmittingEdit}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmittingEdit ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Project"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <DashboardLayout userType="client">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userType="client">
        <div className="p-4 bg-red-50 text-red-800 rounded-lg">
          {error}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="client">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
            <p className="text-gray-600 mt-1">Manage and track all your posted projects</p>
          </div>
          <button 
            onClick={() => navigate('/client/post-project')}
            className="mt-4 sm:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Post New Project
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
                <div className="text-sm text-gray-600">Total Projects</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-xl">🔓</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {projects.filter(p => p.status === 'open').length}
                </div>
                <div className="text-sm text-gray-600">Open Projects</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {projects.filter(p => p.status === 'in-progress').length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <span className="text-xl">✅</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {projects.filter(p => p.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="flex flex-wrap border-b">
            {[
              { id: 'all', label: 'All Projects', count: projects.length },
              { id: 'open', label: 'Open', count: projects.filter(p => p.status === 'open').length },
              { id: 'in-progress', label: 'In Progress', count: projects.filter(p => p.status === 'in-progress').length },
              { id: 'under-review', label: 'Under Review', count: projects.filter(p => p.status === 'under-review').length },
              { id: 'completed', label: 'Completed', count: projects.filter(p => p.status === 'completed').length }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterStatus(filter.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                  filterStatus === filter.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                {filter.label}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  filterStatus === filter.id
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {filter.count}
                </span>
              </button>
            ))}
          </div>

          {/* Projects List */}
          {(filterStatus === 'all' ? projects : projects.filter(p => p.status === filterStatus)).length > 0 ? (
            <div className="divide-y">
              {(filterStatus === 'all' ? projects : projects.filter(p => p.status === filterStatus)).map((project) => {
                // Find accepted application to get student info
                const acceptedApp = project.applications?.find(app => app.status === 'accepted' || app.status === 'in_progress');
                
                return (
                <div 
                  key={project._id} 
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                        {getStatusBadge(project.status)}
                        {project.isUrgent && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                            Urgent
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span>💰</span>
                          <span>₹{project.budget} ({project.budgetType})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>{new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>👥</span>
                          <span>{project.applicationsCount || 0} Applications</span>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-2 mt-3">
                        {project.skillsRequired.map((skill, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[120px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/client/projects/${project._id}/applications`);
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                      >
                        View Applications
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(project);
                        }}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        Edit Project
                      </button>
                      {project.status === 'completed' && acceptedApp && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setReviewModal({
                              isOpen: true,
                              projectId: project._id,
                              revieweeId: acceptedApp.student._id,
                              revieweeName: acceptedApp.student.name,
                            });
                          }}
                          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                        >
                          ⭐ Leave Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-4">Start by posting your first project</p>
              <button 
                onClick={() => navigate('/client/post-project')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Post New Project
              </button>
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Project Management Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-blue-600">✅</span>
              <div>
                <p className="font-medium text-gray-900">Keep project details updated</p>
                <p className="text-sm text-gray-600">Help students understand your requirements better</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600">✅</span>
              <div>
                <p className="font-medium text-gray-900">Review applications promptly</p>
                <p className="text-sm text-gray-600">Don't keep talented students waiting</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600">✅</span>
              <div>
                <p className="font-medium text-gray-900">Set clear milestones</p>
                <p className="text-sm text-gray-600">Break down projects into manageable tasks</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600">✅</span>
              <div>
                <p className="font-medium text-gray-900">Maintain good communication</p>
                <p className="text-sm text-gray-600">Regular updates lead to better outcomes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Project Modal */}
        {renderEditModal()}

        {/* Review Modal */}
        <ReviewModal
          isOpen={reviewModal.isOpen}
          onClose={() => setReviewModal({ isOpen: false, projectId: null, revieweeId: null, revieweeName: "" })}
          projectId={reviewModal.projectId}
          revieweeId={reviewModal.revieweeId}
          revieweeName={reviewModal.revieweeName}
          onSuccess={() => {
            alert("Review submitted successfully!");
            fetchProjects();
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default ClientProjects;