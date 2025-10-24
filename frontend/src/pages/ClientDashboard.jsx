import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import StatsCard from "../components/StatsCard";
import SpendingChart from "../components/SpendingChart";
import CategoryChart from "../components/CategoryChart";
import { useAuth } from "../context/AuthContext";
import { profileAPI } from "../utils/profileAPI";
import { projectsAPI } from "../utils/projectsAPI";
import { applicationsAPI } from "../utils/applicationsAPI";

const ClientDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
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
      if (profileResponse.success) {
        setProfile(profileResponse.data);
      }

      // Fetch client's projects
      const projectsResponse = await projectsAPI.getMyProjects();
      console.log('Projects response:', projectsResponse);
      if (projectsResponse.success) {
        const projectsData = projectsResponse.data.data || projectsResponse.data || [];
        setProjects(Array.isArray(projectsData) ? projectsData : []);
      }

      // Fetch applications for client's projects
      const applicationsResponse = await applicationsAPI.getMyProjects();
      console.log('Applications response:', applicationsResponse);
      if (applicationsResponse.success) {
        const allApplications = [];
        const projectsData = applicationsResponse.data.data || [];
        projectsData.forEach(project => {
          if (Array.isArray(project.applications)) {
            project.applications.forEach(app => {
              allApplications.push({
                id: app._id,
                projectId: project._id,
                projectTitle: project.title,
                studentName: app.student?.name || "Unknown",
                studentId: app.student?._id,
                studentRating: app.student?.rating || 0,
                appliedDate: new Date(app.createdAt).toLocaleDateString(),
                proposedBudget: `₹${app.proposedBudget}`,
                studentSkills: app.student?.skills || [],
                status: app.status
              });
            });
          }
        });
        setApplications(allApplications);
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
    const activeProjects = projects.filter(p => p.status === 'open').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(a => a.status === 'pending').length;
    const totalSpent = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    const avgRating = profile?.avgRatingGiven || 0;

    return [
      {
        icon: "📁",
        title: "Posted Projects",
        value: projects.length.toString(),
        subtitle: `${activeProjects} active, ${completedProjects} completed`,
        trend: `+${activeProjects}`,
        trendDirection: "up"
      },
      {
        icon: "👥",
        title: "Total Applications",
        value: totalApplications.toString(),
        subtitle: `${pendingApplications} pending review`,
        trend: `+${pendingApplications}`,
        trendDirection: "up"
      },
      {
        icon: "💰",
        title: "Total Spent",
        value: `₹${totalSpent.toLocaleString()}`,
        subtitle: `This month: ₹${(profile?.monthlySpent || 0).toLocaleString()}`,
        trend: "+12%",
        trendDirection: "up"
      },
      {
        icon: "⭐",
        title: "Avg Rating Given",
        value: avgRating > 0 ? avgRating.toFixed(1) : "0.0",
        subtitle: `Based on ${completedProjects} completed projects`,
        trend: "+0.1",
        trendDirection: "up"
      }
    ];
  };

  // Generate spending chart data from profile
  const getSpendingChartData = () => {
    // Only return data if we have spending
    if (!profile || profile.monthlySpent === 0) {
      return [];
    }
    
    // Return only the current month's data if available
    return [
      {
        month: 'Current Month',
        amount: profile.monthlySpent || 0
      }
    ];
  };

  // Generate category data from projects
  const getCategoryData = () => {
    if (projects.length === 0) {
      return [];
    }

    const categoryMap = {};
    projects.forEach(project => {
      const category = project.category || 'Other';
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
      const pendingCount = applications.filter(a => a.status === 'pending').length;
      activities.push({
        type: "application",
        message: `${pendingCount} new applications waiting for review`,
        time: "Recently",
        icon: "📝"
      });
    }

    if (projects.length > 0) {
      const completedCount = projects.filter(p => p.status === 'completed').length;
      if (completedCount > 0) {
        activities.push({
          type: "project",
          message: `${completedCount} projects completed successfully`,
          time: "All time",
          icon: "✅"
        });
      }
    }

    const totalSpent = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
    if (totalSpent > 0) {
      activities.push({
        type: "payment",
        message: `Total spent: ₹${totalSpent.toLocaleString()}`,
        time: "All time",
        icon: "💰"
      });
    }

    if (profile?.avgRatingGiven > 0) {
      activities.push({
        type: "review",
        message: `Average rating given: ${profile.avgRatingGiven.toFixed(1)}⭐`,
        time: "Current",
        icon: "⭐"
      });
    }

    return activities.length > 0 ? activities : [
      { type: "info", message: "Post projects to start hiring talented students", time: "Now", icon: "ℹ️" }
    ];
  };

  if (loading) {
    return (
      <DashboardLayout userType="client">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const dashboardStats = calculateStats();
  const recentActivities = getRecentActivities();
  const displayName = profile?.companyName || user?.name || 'Client';
  const spendingChartData = getSpendingChartData();
  const categoryData = getCategoryData();

  return (
    <DashboardLayout userType="client">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {displayName}! 👋</h1>
          <p className="text-blue-100 mb-4">
            {applications.filter(a => a.status === 'pending').length > 0
              ? `You have ${applications.filter(a => a.status === 'pending').length} new applications and ${projects.filter(p => p.status === 'open').length} active projects.`
              : "Post new projects to start hiring talented students!"}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/client/post-project"
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Post New Project
            </Link>
            <Link
              to="/client/applications"
              className="border border-white text-white px-4 py-2 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition-colors"
            >
              Review Applications
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
          {/* Spending Chart */}
          <div className="lg:col-span-2">
            <SpendingChart data={spendingChartData} title="Monthly Spending" />
          </div>

          {/* Category Breakdown */}
          <div>
            <CategoryChart data={categoryData} title="Projects by Category" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
              <Link to="/client/applications" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
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
            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Projects</span>
                  <span className="text-lg font-bold text-blue-600">{projects.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Projects</span>
                  <span className="text-lg font-bold text-green-600">{projects.filter(p => p.status === 'open').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="text-lg font-bold text-purple-600">{projects.filter(p => p.status === 'completed').length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Pending Apps</span>
                  <span className="text-lg font-bold text-orange-600">{applications.filter(a => a.status === 'pending').length}</span>
                </div>
              </div>
            </div>

            {/* Recent Applications */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Applications</h3>
                <Link to="/client/applications" className="text-sm text-indigo-600 hover:text-indigo-700">
                  View All
                </Link>
              </div>
              {applications.filter(a => a.status === 'pending').slice(0, 3).length > 0 ? (
                <div className="space-y-3">
                  {applications.filter(a => a.status === 'pending').slice(0, 3).map((app, index) => (
                    <div key={index} className="border-b pb-3 last:border-b-0">
                      <p className="text-sm font-medium text-gray-900">{app.studentName}</p>
                      <p className="text-xs text-gray-500">{app.projectTitle}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-yellow-600">⭐ {app.studentRating.toFixed(1)}</span>
                        <span className="text-xs font-medium text-green-600">{app.proposedBudget}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-600 text-center py-4">No pending applications</p>
              )}
            </div>

            {/* Quick Tip */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">💡</span>
                <h4 className="font-semibold text-gray-900">Hiring Tip</h4>
              </div>
              <p className="text-sm text-gray-600">
                {applications.length > 0
                  ? "Review applications promptly to secure the best talent!"
                  : "Students with 4.5+ ratings typically deliver projects 20% faster!"}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/client/post-project"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mb-2">➕</span>
              <span className="text-sm font-medium text-gray-700">Post Project</span>
            </Link>
            <Link
              to="/client/applications"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mb-2">📝</span>
              <span className="text-sm font-medium text-gray-700">Review Applications</span>
            </Link>
            <Link
              to="/client/projects"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mb-2">📁</span>
              <span className="text-sm font-medium text-gray-700">My Projects</span>
            </Link>
            <Link
              to="/client/messages"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mb-2">💬</span>
              <span className="text-sm font-medium text-gray-700">Messages</span>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientDashboard;
