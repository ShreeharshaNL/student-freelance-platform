import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import StatsCard from "../components/StatsCard";
import ProjectCard from "../components/ProjectCard";

const StudentDashboard = () => {
  // Mock data with realistic student earnings in India
  const dashboardStats = [
    {
      icon: "💰",
      title: "Total Earnings",
      value: "₹12,450",
      subtitle: "This month: ₹3,200",
      trend: "+18%",
      trendDirection: "up"
    },
    {
      icon: "📝",
      title: "Active Applications",
      value: "8",
      subtitle: "Waiting for response",
      trend: "+2",
      trendDirection: "up"
    },
    {
      icon: "⚡",
      title: "Active Projects",
      value: "3",
      subtitle: "In progress",
      trend: "0",
      trendDirection: "up"
    },
    {
      icon: "⭐",
      title: "Rating",
      value: "4.6",
      subtitle: "Based on 8 reviews",
      trend: "+0.3",
      trendDirection: "up"
    }
  ];

  const recentProjects = [
    {
      id: 1,
      title: "Simple Portfolio Website",
      client: "Priya Nair - Digital Solutions",
      budget: "4,500",
      status: "in_progress",
      deadline: "Dec 15, 2024",
      description: "Create a simple portfolio website using HTML, CSS, and JavaScript. Need responsive design and contact form.",
      skills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
      posted_date: "2 days ago"
    },
    {
      id: 2,
      title: "Logo Design for Local Cafe",
      client: "Rajesh Kumar - Chai Corner",
      budget: "2,000",
      status: "completed",
      deadline: "Nov 30, 2024",
      description: "Design a simple and memorable logo for a local chai cafe. Should reflect Indian culture and warmth.",
      skills: ["Logo Design", "Illustrator", "Branding"],
      posted_date: "1 week ago"
    },
    {
      id: 3,
      title: "Social Media Graphics",
      client: "Amit Sharma - Spice Garden",
      budget: "1,800",
      status: "in_progress",
      deadline: "Dec 10, 2024",
      description: "Create Instagram posts and stories for a local restaurant's social media marketing.",
      skills: ["Graphic Design", "Photoshop", "Social Media"],
      posted_date: "3 days ago"
    }
  ];

  const recentActivities = [
    { type: "application", message: "Applied to 'WordPress website needed'", time: "2 hours ago", icon: "📝" },
    { type: "message", message: "New message from Priya Nair", time: "4 hours ago", icon: "💬" },
    { type: "payment", message: "Payment received: ₹2,000", time: "1 day ago", icon: "💰" },
    { type: "review", message: "New review from Rajesh Kumar (5⭐)", time: "2 days ago", icon: "⭐" },
    { type: "project", message: "Project 'Logo Design' completed", time: "3 days ago", icon: "✅" }
  ];

  const skillsProgress = [
    { skill: "Web Development", level: 75, projects: 6 },
    { skill: "Graphic Design", level: 85, projects: 8 },
    { skill: "Content Writing", level: 60, projects: 4 },
    { skill: "Social Media", level: 70, projects: 5 }
  ];

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Shreeharsha! 👋</h1>
          <p className="text-indigo-100 mb-4">
            You have 3 new project opportunities and 2 messages waiting for you.
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Projects */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Recent Projects</h2>
              <Link to="/student/active" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Profile Completion</h3>
                <span className="text-sm text-indigo-600 font-medium">65%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div className="bg-indigo-600 h-2 rounded-full" style={{ width: "65%" }}></div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-green-600">
                  <span className="mr-2">✓</span>
                  Basic Information
                </div>
                <div className="flex items-center text-green-600">
                  <span className="mr-2">✓</span>
                  Skills Added
                </div>
                <div className="flex items-center text-gray-500">
                  <span className="mr-2">○</span>
                  Portfolio Projects
                </div>
                <div className="flex items-center text-gray-500">
                  <span className="mr-2">○</span>
                  Education Details
                </div>
              </div>
              <Link
                to="/student/profile"
                className="block w-full text-center bg-indigo-600 text-white py-2 rounded-lg mt-4 hover:bg-indigo-700 transition-colors"
              >
                Complete Profile
              </Link>
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

            {/* Skills Progress */}
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

            {/* Earning Tips */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">💡</span>
                <h4 className="font-semibold text-gray-900">Tip of the Day</h4>
              </div>
              <p className="text-sm text-gray-600">
                Complete your profile to increase your chances of getting hired by 40%!
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
