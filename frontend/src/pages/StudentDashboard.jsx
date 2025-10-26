import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import StatsCard from "../components/StatsCard";
import EarningChart from "../components/EarningChart";
import CategoryChart from "../components/CategoryChart";
import { useAuth } from "../context/AuthContext";
import { profileAPI } from "../utils/profileAPI";
import { projectsAPI } from "../utils/projectsAPI";


const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch profile data
      const profileResponse = await profileAPI.getProfile();
      console.log('Profile response:', profileResponse);
      
      // Profile API returns {success: true, data: {...}}
      if (profileResponse.success || profileResponse.data) {
        setProfile(profileResponse.data || profileResponse);
      }

      // Fetch applications
      const applicationsResponse = await projectsAPI.getMyApplications();
      console.log('Applications response:', applicationsResponse);
      console.log('Applications data:', applicationsResponse.data);
      
      // Axios returns {data: {...}, status: 200}
      // Your backend returns {success: true, data: [...]}
      if (applicationsResponse.data) {
        const appData = applicationsResponse.data.data || applicationsResponse.data || [];
        console.log('Parsed applications:', appData);
        setApplications(Array.isArray(appData) ? appData : []);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from real data
const calculateStats = () => {
    // Get real counts from applications
    const pendingApplicationsCount = applications.filter(app => app.status === 'pending').length;
    const inProgressCount = applications.filter(app => app.status === 'in_progress').length;
    const completedCount = applications.filter(app => app.status === 'completed').length;
    
    // Active projects = in_progress applications
    const activeProjectsCount = inProgressCount;
    
    console.log('Pending count:', pendingApplicationsCount);
    console.log('In Progress count:', inProgressCount);
    console.log('Completed count:', completedCount);
    
    // Calculate earnings from completed and in_progress applications
    const totalEarnings = applications
      .filter(app => app.status === 'completed' || app.status === 'in_progress')
      .reduce((sum, app) => sum + (app.proposedBudget || 0), 0);
    
    // Calculate monthly earnings (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const monthlyEarnings = applications
      .filter(app => {
        const appDate = new Date(app.appliedAt || app.createdAt || app.updatedAt);
        return (app.status === 'completed' || app.status === 'in_progress') && appDate >= thirtyDaysAgo;
      })
      .reduce((sum, app) => sum + (app.proposedBudget || 0), 0);

    const rating = profile?.rating || 0;
    const completedProjects = completedCount;

    return [
      {
        icon: "💰",
        title: "Total Earnings",
        value: `₹${totalEarnings.toLocaleString()}`,
        subtitle: `This month: ₹${monthlyEarnings.toLocaleString()}`,
        trend: monthlyEarnings > 0 ? "+18%" : "0%",
        trendDirection: monthlyEarnings > 0 ? "up" : "neutral"
      },
      {
        icon: "📝",
        title: "Active Applications",
        value: pendingApplicationsCount.toString(),
        subtitle: "Waiting for response",
        trend: pendingApplicationsCount > 0 ? `${pendingApplicationsCount} pending` : "No pending",
        trendDirection: "neutral"
      },
      {
        icon: "⚡",
        title: "Active Projects",
        value: activeProjectsCount.toString(),
        subtitle: "In progress",
        trend: activeProjectsCount > 0 ? `${activeProjectsCount} active` : "None",
        trendDirection: activeProjectsCount > 0 ? "up" : "neutral"
      },
      {
        icon: "⭐",
        title: "Rating",
        value: rating > 0 ? rating.toFixed(1) : "0.0",
        subtitle: `Based on ${completedProjects} projects`,
        trend: rating > 0 ? "+0.3" : "New",
        trendDirection: "neutral"
      }
    ];
  };
  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    let completion = 0;
    const fields = [
      profile.name,
      profile.email,
      profile.skills && profile.skills.length > 0,
      profile.portfolio && profile.portfolio.length > 0,
      profile.education && profile.education.length > 0,
      profile.certifications && profile.certifications.length > 0,
      profile.bio,
      profile.location
    ];
    completion = (fields.filter(Boolean).length / fields.length) * 100;
    return Math.round(completion);
  };

  // Get profile completion items
  const getProfileCompletionItems = () => {
    if (!profile) return [];
    return [
      { label: "Basic Information", completed: !!profile.name && !!profile.email },
      { label: "Skills Added", completed: profile.skills && profile.skills.length > 0 },
      { label: "Portfolio Projects", completed: profile.portfolio && profile.portfolio.length > 0 },
      { label: "Education Details", completed: profile.education && profile.education.length > 0 },
      { label: "Certifications", completed: profile.certifications && profile.certifications.length > 0 },
      { label: "Bio & Location", completed: !!profile.bio && !!profile.location }
    ];
  };

  // Generate earning chart data from profile
  const getEarningChartData = () => {
    // Only return data if we have earnings
    if (!profile || profile.totalEarnings === 0) {
      return [];
    }
    
    // Return only the current month's data if available
    return [
      {
        month: 'Current Month',
        amount: profile.monthlyEarnings || 0
      }
    ];
  };

  // Generate category data from applications
  const getCategoryData = () => {
    if (applications.length === 0) {
      return [];
    }

    const categoryMap = {};
    applications.forEach(app => {
      const category = app.project?.category || 'Other';
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category]++;
    });

    const total = Object.values(categoryMap).reduce((sum, count) => sum + count, 0) || 1;
    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 'bg-gray-500', 'bg-indigo-500', 'bg-red-500', 'bg-yellow-500'];
    
    return Object.entries(categoryMap).map((entry, index) => ({
      category: entry[0],
      percentage: Math.round((entry[1] / total) * 100),
      color: colors[index % colors.length],
      count: entry[1]
    }));
  };

  // Recent activities
  const getRecentActivities = () => {
    const activities = [];
    
    if (applications.length > 0) {
      activities.push({
        type: "application",
        message: `Applied to ${applications.length} projects`,
        time: "Recently",
        icon: "📝"
      });
    }

    if (profile?.completedProjects > 0) {
      activities.push({
        type: "project",
        message: `Completed ${profile.completedProjects} projects`,
        time: "All time",
        icon: "✅"
      });
    }

    if (profile?.rating > 0) {
      activities.push({
        type: "review",
        message: `Rating: ${profile.rating.toFixed(1)}⭐`,
        time: "Current",
        icon: "⭐"
      });
    }

    if (profile?.totalEarnings > 0) {
      activities.push({
        type: "payment",
        message: `Total earnings: ₹${profile.totalEarnings.toLocaleString()}`,
        time: "All time",
        icon: "💰"
      });
    }

    return activities.length > 0 ? activities : [
      { type: "info", message: "Start applying to projects to see activity", time: "Now", icon: "ℹ️" }
    ];
  };

  // Skills progress
  const getSkillsProgress = () => {
    if (!profile?.skills || profile.skills.length === 0) {
      return [];
    }
    return profile.skills.slice(0, 4).map(skill => ({
      skill: skill.name || skill,
      level: skill.level ? (skill.level / 5) * 100 : 75,
      projects: skill.projects || 0
    }));
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

  const dashboardStats = calculateStats();
  const profileCompletion = calculateProfileCompletion();
  const profileCompletionItems = getProfileCompletionItems();
  const recentActivities = getRecentActivities();
  const skillsProgress = getSkillsProgress();
  const displayName = profile?.name || user?.name || 'Student';
  const earningChartData = getEarningChartData();
  const categoryData = getCategoryData();

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {displayName}! 👋</h1>
          <p className="text-indigo-100 mb-4">
            {applications.length > 0 
              ? `You have ${applications.filter(a => a.status === 'pending').length} pending applications and ${applications.filter(a => a.status === 'accepted').length} active projects.`
              : "Start applying to projects to grow your freelance career!"}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Browse Projects
            </Link>
            <Link
              to="/student/profile"
              className="border border-white text-white px-4 py-2 rounded-lg font-medium hover:bg-white hover:text-indigo-600 transition-colors"
            >
              Complete Profile
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Earning Chart */}
          <div className="lg:col-span-2">
            <EarningChart data={earningChartData} title="Monthly Earnings" />
          </div>

          {/* Category Breakdown */}
          <div>
            <CategoryChart data={categoryData} title="Applications by Category" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <Link to="/student/applications" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                View All
              </Link>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Profile Completion</h3>
                <span className="text-sm text-indigo-600 font-medium">{profileCompletion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${profileCompletion}%` }}></div>
              </div>
              <div className="space-y-2 text-sm">
                {profileCompletionItems.map((item, index) => (
                  <div key={index} className={`flex items-center ${item.completed ? 'text-green-600' : 'text-gray-500'}`}>
                    <span className="mr-2">{item.completed ? '✓' : '○'}</span>
                    {item.label}
                  </div>
                ))}
              </div>
              <Link
                to="/student/profile"
                className="block w-full text-center bg-indigo-600 text-white py-2 rounded-lg mt-4 hover:bg-indigo-700 transition-colors"
              >
                Complete Profile
              </Link>
            </div>

            {/* Skills Progress */}
            {skillsProgress.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="font-semibold text-gray-900 mb-4">Skills Progress</h3>
                <div className="space-y-4">
                  {skillsProgress.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{skill.skill}</span>
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
            )}

            {/* Earning Tips */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">💡</span>
                <h4 className="font-semibold text-gray-900">Tip of the Day</h4>
              </div>
              <p className="text-sm text-gray-600">
                {profileCompletion < 80 
                  ? "Complete your profile to increase your chances of getting hired by 40%!"
                  : "Keep your profile updated and respond quickly to messages to get more projects!"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/projects"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mb-2">🔍</span>
              <span className="text-sm font-medium text-gray-700">Find Projects</span>
            </Link>
            <Link
              to="/student/applications"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mb-2">📝</span>
              <span className="text-sm font-medium text-gray-700">My Applications</span>
            </Link>
            <Link
              to="/student/messages"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mb-2">💬</span>
              <span className="text-sm font-medium text-gray-700">Messages</span>
            </Link>
            <Link
              to="/student/profile"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mb-2">👤</span>
              <span className="text-sm font-medium text-gray-700">Edit Profile</span>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;

