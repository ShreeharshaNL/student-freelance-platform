import React from "react";
import { Link } from "react-router-dom";

const ProjectCard = ({ project, showActions = true, isClientView = false }) => {
  const getStatusBadge = (status) => {
    const statusStyles = {
      open: "bg-green-100 text-green-800",
      in_progress: "bg-blue-100 text-blue-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {status.replace('_', ' ').toUpperCase()}
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

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 hover:border-indigo-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer">
              {project.title}
            </h3>
            {getStatusBadge(project.status)}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <span>💰</span>
              <span className="font-medium text-gray-900">₹{project.budget}</span>
            </span>
            <span className="flex items-center gap-1">
              <span>📅</span>
              <span>{project.deadline}</span>
            </span>
            <span className="flex items-center gap-1">
              <span>👤</span>
              <span>{project.client || project.student}</span>
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

      {project.skills && (
        <div className="flex flex-wrap gap-2 mb-4">
          {getSkillBadges(project.skills)}
          {project.skills.length > 3 && (
            <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded text-xs">
              +{project.skills.length - 3} more
            </span>
          )}
        </div>
      )}

      {project.applications && (
        <div className="text-sm text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <span>📝</span>
            <span>{project.applications} applications</span>
          </span>
        </div>
      )}

      {showActions && (
        <div className="flex justify-between items-center pt-4 border-t">
          {isClientView ? (
            <div className="flex gap-2">
              <Link
                to={`/project/${project.id}/applications`}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View Applications ({project.applications})
              </Link>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link
                to={`/project/${project.id}`}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                View Details
              </Link>
              {project.status === 'open' && (
                <button className="px-3 py-1 bg-indigo-600 text-white rounded text-sm font-medium hover:bg-indigo-700 transition-colors">
                  Apply Now
                </button>
              )}
            </div>
          )}
          <span className="text-xs text-gray-400">
            Posted {project.posted_date}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
