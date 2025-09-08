import React from "react";

const StatsCard = ({ icon, title, value, subtitle, trend, trendDirection }) => {
  const getTrendColor = () => {
    if (!trend) return "";
    return trendDirection === "up" ? "text-green-600" : "text-red-600";
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    return trendDirection === "up" ? "↗" : "↘";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-indigo-50 rounded-lg">
          <span className="text-2xl">{icon}</span>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
            <span>{getTrendIcon()}</span>
            <span>{trend}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-gray-600 font-medium">{title}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};

export default StatsCard;
