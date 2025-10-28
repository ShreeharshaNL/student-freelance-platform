import React from 'react';

const HiringActivityChart = ({ applications = [], title = "Hiring Activity" }) => {
  // If no applications, show empty state
  if (!applications || applications.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="font-semibold text-gray-900 mb-6">{title}</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No hiring activity yet</p>
          <p className="text-sm text-gray-400 mt-2">Applications will appear here once students start applying</p>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalApplications = applications.length;
  const pendingApplications = applications.filter(a => a.status === 'pending').length;
  const acceptedApplications = applications.filter(a => a.status === 'accepted').length;
  const rejectedApplications = applications.filter(a => a.status === 'rejected').length;
  const reviewedApplications = acceptedApplications + rejectedApplications;
  
  const responseRate = totalApplications > 0 
    ? Math.round((reviewedApplications / totalApplications) * 100) 
    : 0;

  // Calculate percentages for visual bars
  const pendingPercentage = totalApplications > 0 
    ? Math.round((pendingApplications / totalApplications) * 100) 
    : 0;
  const acceptedPercentage = totalApplications > 0 
    ? Math.round((acceptedApplications / totalApplications) * 100) 
    : 0;
  const rejectedPercentage = totalApplications > 0 
    ? Math.round((rejectedApplications / totalApplications) * 100) 
    : 0;

  // Get average response time (mock for now, can be enhanced)
  const avgResponseTime = pendingApplications > 0 ? "Pending" : "< 24h";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="font-semibold text-gray-900 mb-6">{title}</h3>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Total Applications</p>
          <p className="text-2xl font-bold text-blue-600">{totalApplications}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Response Rate</p>
          <p className="text-2xl font-bold text-green-600">{responseRate}%</p>
        </div>
      </div>

      {/* Application Breakdown */}
      <div className="space-y-4">
        {/* Pending */}
        {pendingApplications > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                Pending Review
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {pendingApplications} ({pendingPercentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${pendingPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Accepted */}
        {acceptedApplications > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                Accepted
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {acceptedApplications} ({acceptedPercentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-400 to-green-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${acceptedPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Rejected */}
        {rejectedApplications > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span className="w-3 h-3 bg-gray-500 rounded-full"></span>
                Declined
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {rejectedApplications} ({rejectedPercentage}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-gray-400 to-gray-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${rejectedPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Avg Response Time</p>
          <p className="text-sm font-semibold text-gray-900">{avgResponseTime}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Hired Students</p>
          <p className="text-sm font-semibold text-gray-900">{acceptedApplications}</p>
        </div>
      </div>
    </div>
  );
};

export default HiringActivityChart;
