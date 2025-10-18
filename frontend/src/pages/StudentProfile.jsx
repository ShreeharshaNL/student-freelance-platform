import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import EditProfileModal from "../components/EditProfileModal";
import { profileAPI } from "../utils/auth";

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [studentData, setStudentData] = useState(null);

  // Load profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileAPI.getProfile();
      
      if (response.success) {
        const user = response.data.user;
        setStudentData({
          name: user.name || "Student",
          title: user.studentProfile?.course || "Student",
          location: user.location || "Not specified",
          joinDate: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          profileImage: user.profile_picture,
          rating: user.rating || 0,
          totalReviews: user.total_reviews || 0,
          completedProjects: user.studentProfile?.projects_completed || 0,
          totalEarnings: `₹${user.studentProfile?.total_earnings || 0}`,
          responseTime: "2 hours", // This would come from settings
          bio: user.bio || "No bio available",
          skills: user.skills || [],
          education: user.studentProfile ? [
            {
              degree: user.studentProfile.course || "Not specified",
              school: user.studentProfile.university || "Not specified",
              year: user.studentProfile.year_of_study ? `Year ${user.studentProfile.year_of_study}` : "Not specified",
              status: "Current"
            }
          ] : [],
          certifications: [], // This would come from a separate table
          portfolio: [], // This would come from portfolios table
          reviews: [] // This would come from reviews table
        });
      } else {
        setError("Failed to load profile data");
      }
    } catch (err) {
      console.error('Error loading profile:', err);
      setError("Error loading profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
  };

  const handleSaveProfile = async (formData) => {
  try {
    setSaving(true);
    setError(null);

    console.log('Saving profile data:', formData); // Debug log

    // Only send fields that the backend accepts for basic profile update
    const profileUpdateData = {
      name: formData.name,
      bio: formData.bio,
      location: formData.location,
      skills: formData.skills
    };

    // Update basic profile information
    const response = await profileAPI.updateProfile(profileUpdateData);

    console.log('Profile update response:', response); // Debug log

    if (response.success) {
      // Update local state with new data
      setStudentData((prev) => ({
        ...prev,
        name: formData.name,
        bio: formData.bio,
        location: formData.location,
        skills: formData.skills || prev.skills,
      }));

      setIsEditModalOpen(false);

      // Reload profile to get the latest data from server
      await loadProfileData();
    } else {
      setError(response.message || "Failed to save profile changes");
    }
  } catch (err) {
    console.error('Error saving profile:', err);
    setError(err.message || "Error saving profile changes");
  } finally {
    setSaving(false);
  }
};

  const tabs = [
    { id: "overview", label: "Overview", icon: "👤" },
    { id: "portfolio", label: "Portfolio", icon: "💼" },
    { id: "reviews", label: "Reviews", icon: "⭐" },
    { id: "education", label: "Education", icon: "🎓" }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
        ⭐
      </span>
    ));
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Bio Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">About</h3>
          <button
            onClick={handleEditClick}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        <p className="text-gray-600 leading-relaxed">{studentData.bio}</p>
      </div>

      {/* Skills Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
          <button
            onClick={handleEditClick}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            Edit Skills
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentData.skills.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                <span className="text-xs text-gray-500">{skill.projects} projects</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <div className="text-2xl font-bold text-gray-900">{studentData.completedProjects}</div>
          <div className="text-sm text-gray-600">Projects Completed</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <div className="text-2xl font-bold text-gray-900">{studentData.totalEarnings}</div>
          <div className="text-sm text-gray-600">Total Earned</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <div className="text-2xl font-bold text-gray-900">{studentData.rating}</div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <div className="text-2xl font-bold text-gray-900">{studentData.responseTime}</div>
          <div className="text-sm text-gray-600">Response Time</div>
        </div>
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Portfolio Projects</h3>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Add Project
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studentData.portfolio.map((project) => (
          <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="text-4xl mb-3 text-center">{project.image}</div>
            <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
            <p className="text-sm text-gray-600 mb-3">{project.description}</p>
            <div className="flex flex-wrap gap-1 mb-3">
              {project.technologies.map((tech, index) => (
                <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs">
                  {tech}
                </span>
              ))}
            </div>
            <a href={project.link} className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
              View Project →
            </a>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Client Reviews</h3>
      <div className="space-y-6">
        {studentData.reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{review.clientName}</h4>
                <p className="text-sm text-gray-500">{review.project} • {review.date}</p>
              </div>
              <div className="flex">
                {renderStars(review.rating)}
              </div>
            </div>
            <p className="text-gray-600">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      {/* Education */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Education</h3>
          <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            Add Education
          </button>
        </div>
        {studentData.education.map((edu, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-indigo-600 text-xl">🎓</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{edu.degree}</h4>
              <p className="text-gray-600">{edu.school}</p>
              <p className="text-sm text-gray-500">{edu.year} • {edu.status}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Certifications */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
          <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            Add Certificate
          </button>
        </div>
        <div className="space-y-4">
          {studentData.certifications.map((cert, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xl">📜</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{cert.name}</h4>
                <p className="text-gray-600">{cert.issuer}</p>
                <p className="text-sm text-gray-500">{cert.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout userType="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userType="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={loadProfileData}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!studentData) {
    return (
      <DashboardLayout userType="student">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-500 text-6xl mb-4">👤</div>
            <p className="text-gray-600">No profile data available</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="text-red-400">⚠️</div>
              <div className="ml-3">
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
        {/* Profile Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">SH</span>
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{studentData.name}</h1>
                  <p className="text-lg text-gray-600">{studentData.title}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>📍 {studentData.location}</span>
                    <span>📅 Joined {studentData.joinDate}</span>
                  </div>
                </div>
                <button 
                  onClick={handleEditClick}
                  className="mt-4 md:mt-0 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Edit Profile
                </button>
              </div>

              {/* Rating and Stats */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderStars(Math.floor(studentData.rating))}
                  </div>
                  <span className="font-medium text-gray-900">{studentData.rating}</span>
                  <span className="text-gray-500">({studentData.totalReviews} reviews)</span>
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">{studentData.completedProjects}</span> projects completed
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">{studentData.totalEarnings}</span> earned
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "overview" && renderOverview()}
            {activeTab === "portfolio" && renderPortfolio()}
            {activeTab === "reviews" && renderReviews()}
            {activeTab === "education" && renderEducation()}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveProfile}
        userType="student"
        initialData={studentData}
        loading={saving}
      />
    </DashboardLayout>
  );
};

export default StudentProfile;
