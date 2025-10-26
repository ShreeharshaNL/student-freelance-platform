import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { profileAPI } from "../utils/profileAPI";
import AddSkillModal from "../components/AddSkillModal";
import AddEducationModal from "../components/AddEducationModal";
import AddCertificationModal from "../components/AddCertificationModal";
import AddPortfolioModal from "../components/AddPortfolioModal";
import { reviewsAPI } from "../utils/reviewsAPI";
import ReviewCard from "../components/ReviewCard";
import { useAuth } from "../context/AuthContext";

const StudentProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [editData, setEditData] = useState({});
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [showEducationModal, setShowEducationModal] = useState(false);
  const [showCertificationModal, setShowCertificationModal] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (user?._id) {
      fetchReviews();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Fetching profile...');
      const response = await profileAPI.getProfile();
      console.log('📦 Raw Profile Response:', response);
      
      // Handle different response formats
      let profile;
      if (response.success && response.data) {
        profile = response.data;
      } else if (response.data) {
        profile = response.data;
      } else if (response.success) {
        profile = response;
      } else {
        profile = response;
      }
      
      console.log('✅ Processed Profile:', profile);
      console.log('📊 Profile Stats:', {
        name: profile.name,
        completedProjects: profile.completedProjects,
        totalEarnings: profile.totalEarnings,
        rating: profile.rating,
        totalReviews: profile.totalReviews,
        responseTime: profile.responseTime
      });
      
      if (!profile) {
        throw new Error('No profile data received');
      }
      
      setStudentData(profile);
      // Initialize edit data with current profile values
      setEditData({
        bio: profile.bio || "",
        title: profile.title || "",
        location: profile.location || "",
        name: profile.name || ""
      });
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      console.error("Error details:", error.response?.data);
      setError(error.response?.data?.error || error.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      if (!user?._id) {
        console.warn('⚠️ No user ID available');
        return;
      }
      
      console.log('🔍 Fetching reviews for user:', { 
        userId: user._id,
        role: user.role 
      });

      const response = await reviewsAPI.getMyReviews('received');
      console.log('📦 Reviews Response:', response);

      if (response.success && Array.isArray(response.data)) {
        console.log('✅ Setting reviews:', response.data.length);
        setReviews(response.data);
      } else if (Array.isArray(response.data)) {
        setReviews(response.data);
      } else {
        console.error('❌ Invalid response format:', response);
        setReviews([]);
      }
    } catch (error) {
      console.error("❌ Error fetching reviews:", error);
      setReviews([]);
    }
  };

  const handleSaveProfile = async () => {
    try {
      console.log('💾 Saving profile with data:', editData);
      const response = await profileAPI.updateProfile(editData);
      console.log('✅ Profile update response:', response);
      
      // Handle different response formats
      let updatedProfile;
      if (response.success && response.data) {
        updatedProfile = response.data;
      } else if (response.data) {
        updatedProfile = response.data;
      } else {
        updatedProfile = response;
      }
      
      console.log('✅ Updated profile:', updatedProfile);
      
      // Merge the updated data with existing studentData to preserve all fields
      setStudentData(prev => ({
        ...prev,
        ...updatedProfile,
        // Ensure these fields are preserved if not in response
        completedProjects: updatedProfile.completedProjects ?? prev?.completedProjects ?? 0,
        totalEarnings: updatedProfile.totalEarnings ?? prev?.totalEarnings ?? 0,
        rating: updatedProfile.rating ?? prev?.rating ?? 0,
        totalReviews: updatedProfile.totalReviews ?? prev?.totalReviews ?? 0
      }));
      
      setIsEditing(false);
      alert("Profile updated successfully!");
      
      // Optionally refetch to ensure sync
      // await fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile: " + (error.response?.data?.error || error.message));
    }
  };

  const handleAddSkill = async (skillData) => {
    try {
      const response = await profileAPI.addSkill(skillData);
      console.log('Skill add response:', response);
      
      if (response.success || response.data) {
        const skills = response.data?.skills || response.skills;
        setStudentData((prev) => ({ ...prev, skills }));
        setShowSkillModal(false);
        alert("Skill added successfully!");
      }
    } catch (error) {
      console.error("Error adding skill:", error);
      alert(error.response?.data?.error || "Failed to add skill");
    }
  };

  const handleDeleteSkill = async (skillId) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;

    try {
      const response = await profileAPI.deleteSkill(skillId);
      if (response.success || response.data) {
        const skills = response.data?.skills || response.skills;
        setStudentData(prev => ({ ...prev, skills }));
        alert("Skill deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting skill:", error);
      alert("Failed to delete skill");
    }
  };

  const handleAddPortfolio = async (data) => {
    try {
      const response = await profileAPI.addPortfolio({
        ...data,
        technologies: (data.technologies || "").toString().split(',').map(t => t.trim()).filter(Boolean)
      });

      if (response.success || response.data) {
        const portfolio = response.data?.portfolio || response.portfolio;
        setStudentData(prev => ({ ...prev, portfolio }));
        setShowPortfolioModal(false);
        alert("Portfolio project added successfully!");
      }
    } catch (error) {
      console.error("Error adding portfolio:", error);
      alert(error.response?.data?.error || "Failed to add portfolio project");
    }
  };

  const handleDeletePortfolio = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const response = await profileAPI.deletePortfolio(projectId);
      if (response.success || response.data) {
        const portfolio = response.data?.portfolio || response.portfolio;
        setStudentData(prev => ({ ...prev, portfolio }));
        alert("Project deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting portfolio:", error);
      alert("Failed to delete project");
    }
  };

  const handleAddEducation = async (data) => {
    try {
      const response = await profileAPI.addEducation({
        ...data,
        year: data.year?.toString() || "",
        status: data.status?.toString() || ""
      });

      if (response.success || response.data) {
        const education = response.data?.education || response.education;
        setStudentData(prev => ({ ...prev, education }));
        setShowEducationModal(false);
        alert("Education added successfully!");
      }
    } catch (error) {
      console.error("Error adding education:", error);
      alert(error.response?.data?.error || "Failed to add education");
    }
  };

  const handleDeleteEducation = async (eduId) => {
    if (!window.confirm("Are you sure you want to delete this education?")) return;

    try {
      const response = await profileAPI.deleteEducation(eduId);
      if (response.success || response.data) {
        const education = response.data?.education || response.education;
        setStudentData(prev => ({ ...prev, education }));
        alert("Education deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting education:", error);
      alert("Failed to delete education");
    }
  };

  const handleAddCertification = async (data) => {
    try {
      const response = await profileAPI.addCertification({
        ...data,
        name: data.name?.toString() || "",
        issuer: data.issuer?.toString() || "",
        year: data.year?.toString() || ""
      });

      if (response.success || response.data) {
        const certifications = response.data?.certifications || response.certifications;
        setStudentData(prev => ({ ...prev, certifications }));
        setShowCertificationModal(false);
        alert("Certification added successfully!");
      }
    } catch (error) {
      console.error("Error adding certification:", error);
      alert(error.response?.data?.error || "Failed to add certification");
    }
  };

  const handleDeleteCertification = async (certId) => {
    if (!window.confirm("Are you sure you want to delete this certification?")) return;

    try {
      const response = await profileAPI.deleteCertification(certId);
      if (response.success || response.data) {
        const certifications = response.data?.certifications || response.certifications;
        setStudentData(prev => ({ ...prev, certifications }));
        alert("Certification deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting certification:", error);
      alert("Failed to delete certification");
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
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">About</h3>
          <button
            onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                className="w-full p-3 border rounded-lg"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                placeholder="e.g., Full Stack Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                className="w-full p-3 border rounded-lg resize-none"
                rows="4"
                value={editData.bio}
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-600 leading-relaxed">
              {studentData?.bio || "No bio added yet. Click Edit to add your bio."}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
          <button
            onClick={() => setShowSkillModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add Skill
          </button>
        </div>
        {studentData?.skills?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentData.skills.map((skill) => (
              <div key={skill._id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                  <button
                    onClick={() => handleDeleteSkill(skill._id)}
                    className="text-red-500 hover:text-red-700 text-xs"
                  >
                    ✕
                  </button>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No skills added yet. Click Add Skill to get started.</p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <div className="text-2xl font-bold text-gray-900">
            {studentData?.completedProjects ?? studentData?.projects?.filter(p => p.status === 'completed')?.length ?? 0}
          </div>
          <div className="text-sm text-gray-600">Projects Completed</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <div className="text-2xl font-bold text-gray-900">
            ₹{studentData?.totalEarnings ?? studentData?.earnings ?? 0}
          </div>
          <div className="text-sm text-gray-600">Total Earned</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <div className="text-2xl font-bold text-gray-900">
            {studentData?.rating ? studentData.rating.toFixed(1) : "0.0"}
          </div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <div className="text-2xl font-bold text-gray-900">
            {studentData?.responseTime ?? "N/A"}
          </div>
          <div className="text-sm text-gray-600">Response Time</div>
        </div>
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Portfolio Projects</h3>
        <button
          onClick={() => setShowPortfolioModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Add Project
        </button>
      </div>
      {studentData?.portfolio?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studentData.portfolio.map((project) => (
            <div key={project._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3 text-center">{project.image || "📁"}</div>
              <h4 className="font-semibold text-gray-900 mb-2">{project.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {project.technologies?.map((tech, index) => (
                  <span key={index} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center">
                {project.link && (
                  <a 
                    href={project.link} 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    View Project →
                  </a>
                )}
                <button
                  onClick={() => handleDeletePortfolio(project._id)}
                  className="text-red-500 hover:text-red-700 text-sm ml-auto"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No portfolio projects yet. Add your first project!</p>
      )}
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Reviews ({reviews.length})
        </h3>
        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                currentUserId={user?._id}
                onUpdate={fetchReviews}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">📋 No reviews yet</p>
            <p className="text-sm mt-2">Complete projects and receive reviews from clients to see them here</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Education</h3>
          <button
            onClick={() => setShowEducationModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add Education
          </button>
        </div>
        {studentData?.education?.length > 0 ? (
          <div className="space-y-4">
            {studentData.education.map((edu) => (
              <div key={edu._id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 text-xl">🎓</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                  <p className="text-gray-600">{edu.school}</p>
                  <p className="text-sm text-gray-500">{edu.year} • {edu.status}</p>
                </div>
                <button
                  onClick={() => handleDeleteEducation(edu._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No education added yet.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
          <button
            onClick={() => setShowCertificationModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Add Certification
          </button>
        </div>
        {studentData?.certifications?.length > 0 ? (
          <div className="space-y-4">
            {studentData.certifications.map((cert) => (
              <div key={cert._id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-xl">📜</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{cert.name}</h4>
                  <p className="text-gray-600">{cert.issuer}</p>
                  <p className="text-sm text-gray-500">{cert.year}</p>
                </div>
                <button
                  onClick={() => handleDeleteCertification(cert._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No certifications added yet.</p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout userType="student">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !studentData) {
    return (
      <DashboardLayout userType="student">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error || "Failed to load profile data."}</p>
          <button
            onClick={fetchProfile}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {studentData?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{studentData?.name || "User"}</h1>
                  <p className="text-lg text-gray-600">{studentData?.title || "Student"}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>📅 Joined {studentData?.createdAt ? new Date(studentData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderStars(Math.floor(studentData?.rating || 0))}
                  </div>
                  <span className="font-medium text-gray-900">{studentData?.rating?.toFixed(1) || "0.0"}</span>
                  <span className="text-gray-500">({studentData?.totalReviews || 0} reviews)</span>
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">
                    {studentData?.completedProjects ?? studentData?.projects?.filter(p => p.status === 'completed')?.length ?? 0}
                  </span> projects completed
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">
                    ₹{studentData?.totalEarnings ?? studentData?.earnings ?? 0}
                  </span> earned
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border">
          <div className="flex border-b overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
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

      {showSkillModal && <AddSkillModal onClose={() => setShowSkillModal(false)} onSubmit={handleAddSkill} />}
      {showEducationModal && <AddEducationModal onClose={() => setShowEducationModal(false)} onSubmit={handleAddEducation} />}
      {showCertificationModal && <AddCertificationModal onClose={() => setShowCertificationModal(false)} onSubmit={handleAddCertification} />}
      {showPortfolioModal && <AddPortfolioModal onClose={() => setShowPortfolioModal(false)} onSubmit={handleAddPortfolio} />}
    </DashboardLayout>
  );
};

export default StudentProfile;