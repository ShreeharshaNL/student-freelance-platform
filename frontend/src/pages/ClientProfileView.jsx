import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../context/AuthContext";
import API from "../utils/api";

const ClientProfileView = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientProfile = async () => {
      try {
        setLoading(true);
        const response = await API.get(`/user/${clientId}`);
        if (response.data.success) {
          setClient(response.data.data);
        } else {
          setError(response.data.error || "Failed to load client profile");
        }
      } catch (err) {
        console.error("Error fetching client profile:", err);
        setError(err.response?.data?.error || "Failed to load client profile");
      } finally {
        setLoading(false);
      }
    };

    fetchClientProfile();
  }, [clientId]);

  if (loading) {
    return (
      <DashboardLayout userType={user?.role || "student"}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userType={user?.role || "student"}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Profile</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!client) {
    return (
      <DashboardLayout userType={user?.role || "student"}>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Client Not Found</h2>
          <p className="text-yellow-600 mb-4">This client profile is not available.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const initials = client.name
    ? client.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "C";

  return (
    <DashboardLayout userType={user?.role || "student"}>
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:gap-6 -mt-16 mb-6">
              <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg">
                {initials}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
                <p className="text-gray-600 mt-1">{client.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">{client.rating || 0}</div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">{client.projectsPosted || 0}</div>
                <div className="text-sm text-gray-600">Projects Posted</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">{client.hiredStudents || 0}</div>
                <div className="text-sm text-gray-600">Students Hired</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600">
                  {client.createdAt ? new Date(client.createdAt).getFullYear() : "N/A"}
                </div>
                <div className="text-sm text-gray-600">Member Since</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
              {client.description && (
                <div className="mb-4">
                  <p className="text-gray-700">{client.description}</p>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900 mt-1">{client.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Location</label>
                  <p className="text-gray-900 mt-1">{client.location || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Phone</label>
                  <p className="text-gray-900 mt-1">{client.phone || "Not specified"}</p>
                </div>
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Company Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Company Name</label>
                  <p className="text-gray-900 mt-1">{client.companyName || "Not specified"}</p>
                </div>
                {client.industryType && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Industry</label>
                    <p className="text-gray-900 mt-1">{client.industryType}</p>
                  </div>
                )}
                {client.companySize && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Company Size</label>
                    <p className="text-gray-900 mt-1">{client.companySize}</p>
                  </div>
                )}
                {client.website && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Website</label>
                    <p className="text-gray-900 mt-1">
                      <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                        {client.website}
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📧</span>
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm font-medium text-gray-900">{client.email}</p>
                  </div>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📱</span>
                    <div>
                      <p className="text-xs text-gray-600">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{client.phone}</p>
                    </div>
                  </div>
                )}
                {client.location && (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📍</span>
                    <div>
                      <p className="text-xs text-gray-600">Location</p>
                      <p className="text-sm font-medium text-gray-900">{client.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-gray-900">{client.rating || 0}</span>
                    <span className="text-yellow-500">⭐</span>
                  </div>
                </div>
                {client.totalReviews > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Reviews</span>
                    <span className="font-bold text-gray-900">{client.totalReviews}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Projects Posted</span>
                  <span className="font-bold text-gray-900">{client.projectsPosted || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Students Hired</span>
                  <span className="font-bold text-gray-900">{client.hiredStudents || 0}</span>
                </div>
                {client.totalSpent && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Spent</span>
                    <span className="font-bold text-gray-900">{client.totalSpent}</span>
                  </div>
                )}
                {client.responseTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Response Time</span>
                    <span className="font-bold text-gray-900">{client.responseTime}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-bold text-gray-900">
                    {client.createdAt
                      ? new Date(client.createdAt).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => navigate(-1)}
              className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ClientProfileView;
