import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const DashboardLayout = ({ children, userType = "student" }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const studentNavItems = [
    { name: "Dashboard", href: "/student/dashboard", icon: "📊" },
    { name: "Browse Projects", href: "/projects", icon: "🔍" },
    { name: "My Applications", href: "/student/applications", icon: "📝" },
    { name: "Active Projects", href: "/student/active-projects", icon: "⚡" },
    { name: "My Profile", href: "/student/profile", icon: "👤" },
    { name: "Earnings", href: "/student/earnings", icon: "💰" },
    { name: "Messages", href: "/student/messages", icon: "💬" },
  ];

  const clientNavItems = [
    { name: "Dashboard", href: "/client/dashboard", icon: "📊" },
    { name: "Post Project", href: "/client/post-project", icon: "➕" },
    { name: "My Projects", href: "/client/projects", icon: "📁" },
    { name: "Applications", href: "/client/applications", icon: "📝" },
    { name: "Active Hires", href: "/client/active", icon: "👥" },
    { name: "My Profile", href: "/client/profile", icon: "🏢" },
    { name: "Messages", href: "/client/messages", icon: "💬" },
  ];

  const navItems = userType === "student" ? studentNavItems : clientNavItems;

  const isActiveLink = (href) => {
    return location.pathname === href;
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      const token = localStorage.getItem('token'); // Based on your auth structure
      
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      // Clear authentication data from localStorage
      localStorage.removeItem('token'); // Your auth uses 'token' not 'authToken'
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      
      // Clear authentication data from sessionStorage
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      if (result.success) {
        console.log('Logged out successfully');
      }
      
      // Redirect to login page
      navigate('/', { replace: true });
      
    } catch (error) {
      console.error('Logout failed:', error);
      
      // Even if the API call fails, clear local data and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');
      sessionStorage.clear();
      navigate('/', { replace: true });
    }
  };

  // Confirmation logout handler (optional)
  const handleLogoutWithConfirmation = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      handleLogout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center h-16 px-4 border-b">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            🎓 StudentFreelance
          </Link>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActiveLink(item.href)
                    ? "bg-indigo-50 text-indigo-700 border-r-2 border-indigo-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t">
            <div className="space-y-2">
              <Link
                to="/help"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <span className="mr-3 text-lg">❓</span>
                Help & Support
              </Link>
              <Link
                to="/settings"
                className="flex items-center px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <span className="mr-3 text-lg">⚙️</span>
                Settings
              </Link>
              <button
                className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors"
                onClick={handleLogout}
                // Alternative with confirmation: onClick={handleLogoutWithConfirmation}
              >
                <span className="mr-3 text-lg">🚪</span>
                Sign Out
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-600 lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5-5 5h5zm0 0v-5a6 6 0 0 0-12 0v5" />
                </svg>
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                  3
                </span>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="h-8 w-8 bg-indigo-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {userType === "student" ? "S" : "C"}
                    </span>
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {userType === "student" ? "Shreeharsha N L" : "TechCorp Inc."}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{userType}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;