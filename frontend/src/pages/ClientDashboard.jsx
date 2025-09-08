import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import StatsCard from "../components/StatsCard";
import ProjectCard from "../components/ProjectCard";

const ClientDashboard = () => {
  // Mock data with realistic client spending for hiring students in India
  const dashboardStats = [
    {
      icon: "📁",
      title: "Posted Projects",
      value: "12",
      subtitle: "3 active, 9 completed",
      trend: "+2",
      trendDirection: "up"
    },
    {
      icon: "👥",
      title: "Total Applications",
      value: "47",
      subtitle: "15 pending review",
      trend: "+8",
      trendDirection: "up"
    },
    {
      icon: "💰",
      title: "Total Spent",
      value: "₹28,500",
      subtitle: "This month: ₹8,200",
      trend: "+12%",
      trendDirection: "up"
    },
    {
      icon: "⭐",
      title: "Avg Rating Given",
      value: "4.7",
      subtitle: "Based on 9 completed projects",
      trend: "+0.1",
      trendDirection: "up"
    }
  ];

  const activeProjects = [
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
      status: "in_progress",
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
      status: "open",
      deadline: "Dec 12, 2024",
      description: "Simple data entry task from PDF to Excel. Perfect for students looking for easy work.",
      skills: ["Data Entry", "Excel", "Attention to Detail"],
      applications: 8,
      posted_date: "2 days ago"
    }
  ];

  const recentApplications = [
    {
      id: 1,
      projectTitle: "WordPress Blog Setup",
      studentName: "Shreeharsha N L",
      studentRating: "4.6",
      appliedDate: "2 hours ago",
      proposedBudget: "₹3,200",
      studentSkills: ["WordPress", "SEO", "HTML/CSS"]
    },
    {
      id: 2,
      projectTitle: "Basic Data Entry Work", 
      studentName: "Amit Patel",
      studentRating: "4.8",
      appliedDate: "4 hours ago",
      proposedBudget: "₹1,400",
      studentSkills: ["Data Entry", "Excel", "MS Office"]
    },
    {
      id: 3,
      projectTitle: "WordPress Blog Setup",
      studentName: "Sneha Reddy",
      studentRating: "4.5",
      appliedDate: "1 day ago", 
      proposedBudget: "₹3,500",
      studentSkills: ["WordPress", "Web Development"]
    }
  ];

  const recentActivities = [
    { type: "application", message: "New application from Shreeharsha N L", time: "2 hours ago", icon: "📝" },
    { type: "project", message: "Project 'Logo Design' completed successfully", time: "1 day ago", icon: "✅" },
    { type: "message", message: "Message from Rahul Kumar", time: "1 day ago", icon: "💬" },
    { type: "payment", message: "Payment of ₹2,000 released to student", time: "2 days ago", icon: "💰" },
    { type: "hire", message: "Hired Rahul Kumar for Social Media project", time: "3 days ago", icon: "🤝" }
  ];

  const hiringStats = [
    { category: "Web Development", hired: 5, avgBudget: "₹4,200" },
    { category: "Graphic Design", hired: 3, avgBudget: "₹2,500" },
    { category: "Content Writing", hired: 2, avgBudget: "₹1,800" },
    { category: "Data Entry", hired: 1, avgBudget: "₹1,200" }
  ];

  return (
    <DashboardLayout userType="client">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, TechCorp! 👋</h1>
          <p className="text-blue-100 mb-4">
            You have 15 new applications and 2 projects waiting for review.
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Projects */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Your Projects</h2>
              <Link to="/client/projects" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {activeProjects.map((project) => (
                <ProjectCard key={project.id} project={project} isClientView={true} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Applications */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Recent Applications</h3>
                <Link to="/client/applications" className="text-sm text-indigo-600 hover:text-indigo-700">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {recentApplications.map((app, index) => (
                  <div key={index} className="border-b pb-3 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{app.studentName}</p>
                        <p className="text-xs text-gray-500">{app.projectTitle}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-yellow-600">⭐ {app.studentRating}</span>
                          <span className="text-xs font-medium text-green-600">{app.proposedBudget}</span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{app.appliedDate}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {app.studentSkills.slice(0, 2).map((skill, skillIndex) => (
                        <span key={skillIndex} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="text-lg">{activity.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hiring Analytics */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4">Hiring Analytics</h3>
              <div className="space-y-3">
                {hiringStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">{stat.category}</p>
                      <p className="text-xs text-gray-500">{stat.hired} students hired</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{stat.avgBudget}</p>
                      <p className="text-xs text-gray-500">avg budget</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Tip */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">💡</span>
                <h4 className="font-semibold text-gray-900">Hiring Tip</h4>
              </div>
              <p className="text-sm text-gray-600">
                Students with 4.5+ ratings typically deliver projects 20% faster!
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
              to="/client/active"
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl mb-2">👥</span>
              <span className="text-sm font-medium text-gray-700">Active Hires</span>
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
