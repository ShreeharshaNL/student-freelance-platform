import React from "react";
import { Link } from "react-router-dom";

const ProjectCard = ({ project, showActions = true, isClientView = false }) => {
  const getStatusBadge = (status) => {
    const statusStyles = {
      open: "bg-green-100 text-green-800",
      "in-progress": "bg-blue-100 text-blue-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
        {status?.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  const getSkillBadges = (skills) => {
    return skills?.slice(0, 3).map((skill, index) => (
      <span 
        key={index}
        className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium"
      >
        {skill}
      </span>
    ));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatBudget = (budget, budgetType) => {
    if (!budget) return '₹0';
    return `₹${budget.toLocaleString()}${budgetType === 'hourly' ? '/hr' : ''}`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 hover:border-indigo-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer">
              {project.title}
            </h3>
            {getStatusBadge(project.status)}
            {project.isUrgent && (
              <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">URGENT</span>
            )}
            {project.isFeatured && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">FEATURED</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <span>💰</span>
              <span className="font-medium text-gray-900">{formatBudget(project.budget, project.budgetType)}</span>
            </span>
            <span className="flex items-center gap-1">
              <span>📅</span>
              <span>{formatDate(project.deadline)}</span>
            </span>
            {!isClientView && (
              <span className="flex items-center gap-1">
                <span>👤</span>
                <span>{project.user?.name || 'Anonymous'}</span>
              </span>
            )}
            <span className="flex items-center gap-1">
              <span>⏱️</span>
              <span>{project.projectType?.replace('-', ' ')}</span>
            </span>
            <span className="flex items-center gap-1">
              <span>⭐</span>
              <span>{project.experienceLevel}</span>
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

      {project.skillsRequired && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.skillsRequired.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium"
            >
              {skill}
            </span>
          ))}
          {project.skillsRequired.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded text-xs">
              +{project.skillsRequired.length - 3} more
            </span>
          )}
        </div>
      )}

      {project.applicationsCount > 0 && (
        <div className="text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <span>📝</span>
            <span>{project.applicationsCount} applications</span>
          </span>
        </div>
      )}

      {showActions && (
        <div className="flex justify-between items-center pt-4 border-t">
          {isClientView ? (
            <div className="flex gap-2">
              <Link
                to={`/project/${project._id}/applications`}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View Applications ({project.applicationsCount || 0})
              </Link>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to={`/projects/${project._id}`}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View Details
              </Link>
              {project.status === 'open' && (
                <Link
                  to={`/projects/${project._id}`}
                  className="px-3 py-1 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Apply Now
                </Link>
              )}
            </div>
          )}
          <span className="text-xs text-gray-400">
            Posted {formatDate(project.createdAt)}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
