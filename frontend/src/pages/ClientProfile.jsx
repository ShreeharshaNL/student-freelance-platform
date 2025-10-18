import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import ProjectCard from "../components/ProjectCard";
import EditProfileModal from "../components/EditProfileModal";
import { profileAPI } from "../utils/auth";

const ClientProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [clientData, setClientData] = useState(null);

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
        setClientData({
          companyName: user.name || "Company",
          industryType: "Technology Services", // This would come from client profile
          location: user.location || "Not specified",
          joinDate: new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          website: "www.example.com", // This would come from client profile
          companySize: "10-50 employees", // This would come from client profile
          profileImage: user.profile_picture,
          rating: user.rating || 0,
          totalReviews: user.total_reviews || 0,
          projectsPosted: 0, // This would come from projects count
          totalSpent: "₹0", // This would come from payments
          hiredStudents: 0, // This would come from assignments
          responseTime: "4 hours", // This would come from settings
          description: user.bio || "No company description available",
    
    postedProjects: [
      {
        id: 1,
        title: "WordPress Blog Setup",
        budget: "3,500",
        status: "open",
        deadline: "Dec 20, 2024",
        description: "Need a student to help set up a WordPress blog with custom theme and basic SEO optimization.",
        skills: ["WordPress", "SEO", "Content Management"],
        applications: 12,
        posted_date: "3 days ago"
      },
      {
        id: 2,
        title: "Social Media Content Creation",
        budget: "2,800",
        status: "completed",
        deadline: "Dec 15, 2024",
        student: "Rahul Kumar",
        description: "Creating Instagram posts and stories for our local business. Need creative and engaging content.",
        skills: ["Graphic Design", "Social Media", "Canva"],
        posted_date: "1 week ago"
      },
      {
        id: 3,
        title: "Basic Data Entry Work",
        budget: "1,500",
        status: "in_progress",
        deadline: "Dec 12, 2024",
        student: "Priya Sharma",
        description: "Simple data entry task from PDF to Excel. Perfect for students looking for easy work.",
        skills: ["Data Entry", "Excel", "Attention to Detail"],
        posted_date: "2 days ago"
      }
    ],

    hiredHistory: [
      {
        id: 1,
        studentName: "Priya Sharma",
        project: "Website Development",
        rating: 5,
        amount: "₹4,200",
        completedDate: "Nov 2024",
        feedback: "Excellent work! Very professional and delivered on time."
      },
      {
        id: 2,
        studentName: "Rahul Kumar",
        project: "Logo Design",
        rating: 4,
        amount: "₹2,500",
        completedDate: "Oct 2024",
        feedback: "Good design skills. Communication could be better."
      },
      {
        id: 3,
        studentName: "Sneha Patel",
        project: "Content Writing",
        rating: 5,
        amount: "₹1,800",
        completedDate: "Oct 2024",
        feedback: "Amazing writing skills! Very creative and original content."
      }
    ],

    reviews: [
      {
        id: 1,
        studentName: "Priya Sharma",
        rating: 5,
        comment: "Great client! Clear requirements and prompt payments. Highly recommend working with TechCorp.",
        project: "Website Development",
        date: "Nov 2024"
      },
      {
        id: 2,
        studentName: "Rahul Kumar",
        rating: 4,
        comment: "Good experience. Client was responsive and the project scope was well defined.",
        project: "Logo Design",
        date: "Oct 2024"
      }
    ],

          stats: [
            { category: "Web Development", projects: 0, avgBudget: "₹0" },
            { category: "Graphic Design", projects: 0, avgBudget: "₹0" },
            { category: "Content Writing", projects: 0, avgBudget: "₹0" },
            { category: "Data Entry", projects: 0, avgBudget: "₹0" }
          ]
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
      
      const response = await profileAPI.updateProfile(formData);
      
      if (response.success) {
        // Update local state with new data
        setClientData(prev => ({
          ...prev,
          companyName: formData.name,
          description: formData.bio,
          location: formData.location,
          website: formData.website,
          companySize: formData.companySize,
          industryType: formData.industryType
        }));
        setIsEditModalOpen(false);
      } else {
        setError("Failed to save profile changes");
      }
    } catch (err) {
      console.error('Error saving profile:', err);
      setError("Error saving profile changes");
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "🏢" },
    { id: "projects", label: "Posted Projects", icon: "📁" },
    { id: "hired", label: "Hired Students", icon: "👥" },
    { id: "reviews", label: "Reviews", icon: "⭐" }
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
      {/* Company Description */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">About Company</h3>
          <button
            onClick={handleEditClick}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            Edit
          </button>
        </div>
        <p className="text-gray-600 leading-relaxed">{clientData.description}</p>
      </div>

      {/* Company Details */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-gray-500">🏢</span>
              <div>
                <p className="text-sm text-gray-500">Industry</p>
                <p className="font-medium text-gray-900">{clientData.industryType}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500">📍</span>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium text-gray-900">{clientData.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500">🌐</span>
              <div>
                <p className="text-sm text-gray-500">Website</p>
                <a href={`https://${clientData.website}`} className="font-medium text-indigo-600 hover:text-indigo-700">
                  {clientData.website}
                </a>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-gray-500">👥</span>
              <div>
                <p className="text-sm text-gray-500">Company Size</p>
                <p className="font-medium text-gray-900">{clientData.companySize}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500">📅</span>
              <div>
                <p className="text-sm text-gray-500">Member Since</p>
                <p className="font-medium text-gray-900">{clientData.joinDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-500">⏱️</span>
              <div>
                <p className="text-sm text-gray-500">Avg Response Time</p>
                <p className="font-medium text-gray-900">{clientData.responseTime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hiring Stats */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hiring Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {clientData.stats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-gray-900">{stat.projects}</div>
              <div className="text-sm text-gray-600 mb-1">{stat.category}</div>
              <div className="text-xs text-gray-500">Avg: {stat.avgBudget}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <div className="text-2xl font-bold text-gray-900">{clientData.projectsPosted}</div>
          <div className="text-sm text-gray-600">Projects Posted</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <div className="text-2xl font-bold text-gray-900">{clientData.hiredStudents}</div>
          <div className="text-sm text-gray-600">Students Hired</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <div className="text-2xl font-bold text-gray-900">{clientData.totalSpent}</div>
          <div className="text-sm text-gray-600">Total Spent</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border text-center">
          <div className="text-2xl font-bold text-gray-900">{clientData.rating}</div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Posted Projects</h3>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Post New Project
        </button>
      </div>
      
      <div className="space-y-4">
        {clientData.postedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} isClientView={true} />
        ))}
      </div>
    </div>
  );

  const renderHired = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Hired Students History</h3>
      <div className="space-y-6">
        {clientData.hiredHistory.map((hire) => (
          <div key={hire.id} className="border-b pb-6 last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">
                    {hire.studentName.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{hire.studentName}</h4>
                  <p className="text-sm text-gray-500">{hire.project} • {hire.completedDate}</p>
                  <p className="text-sm font-medium text-green-600 mt-1">{hire.amount}</p>
                </div>
              </div>
              <div className="flex">
                {renderStars(hire.rating)}
              </div>
            </div>
            <p className="text-gray-600 text-sm ml-16">{hire.feedback}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReviews = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Student Reviews</h3>
      <div className="space-y-6">
        {clientData.reviews.map((review) => (
          <div key={review.id} className="border-b pb-6 last:border-b-0">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{review.studentName}</h4>
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

  if (loading) {
    return (
      <DashboardLayout userType="client">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading profile...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userType="client">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={loadProfileData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!clientData) {
    return (
      <DashboardLayout userType="client">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-gray-500 text-6xl mb-4">🏢</div>
            <p className="text-gray-600">No profile data available</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="client">
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
            {/* Company Logo */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">TC</span>
              </div>
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{clientData.companyName}</h1>
                  <p className="text-lg text-gray-600">{clientData.industryType}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span>📍 {clientData.location}</span>
                    <span>📅 Member since {clientData.joinDate}</span>
                  </div>
                </div>
                <button 
                  onClick={handleEditClick}
                  className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Profile
                </button>
              </div>

              {/* Rating and Stats */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {renderStars(Math.floor(clientData.rating))}
                  </div>
                  <span className="font-medium text-gray-900">{clientData.rating}</span>
                  <span className="text-gray-500">({clientData.totalReviews} reviews)</span>
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">{clientData.projectsPosted}</span> projects posted
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">{clientData.hiredStudents}</span> students hired
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
                    ? "border-blue-600 text-blue-600"
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
            {activeTab === "projects" && renderProjects()}
            {activeTab === "hired" && renderHired()}
            {activeTab === "reviews" && renderReviews()}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveProfile}
        userType="client"
        initialData={clientData}
        loading={saving}
      />
    </DashboardLayout>
  );
};

export default ClientProfile;
