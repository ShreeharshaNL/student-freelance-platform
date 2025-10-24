import React from 'react';

const EarningChart = ({ data = [], title = "Monthly Earnings" }) => {
  // Use only real data provided
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="font-semibold text-gray-900 mb-6">{title}</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No earnings data available yet</p>
        </div>
      </div>
    );
  }

  // Find max value for scaling
  const maxAmount = Math.max(...data.map(d => d.amount || 0), 1);
  const scale = 100 / maxAmount;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">{item.month || `Month ${index + 1}`}</span>
              <span className="text-sm font-semibold text-gray-900">₹{(item.amount || 0).toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(item.amount || 0) * scale}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total Earnings</span>
          <span className="text-lg font-bold text-indigo-600">
            ₹{data.reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EarningChart;
