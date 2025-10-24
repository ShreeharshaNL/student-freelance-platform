import React from 'react';

const CategoryChart = ({ data = [], title = "Category Breakdown" }) => {
  // Use only real data provided
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="font-semibold text-gray-900 mb-6">{title}</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No category data available yet</p>
        </div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + (item.count || 0), 0);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="font-semibold text-gray-900 mb-6">{title}</h3>
      
      {/* Pie Chart Visualization */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {data.map((item, index) => {
              let startAngle = 0;
              for (let i = 0; i < index; i++) {
                startAngle += (data[i].percentage / 100) * 360;
              }
              const endAngle = startAngle + (item.percentage / 100) * 360;
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              
              const x1 = 50 + 40 * Math.cos(startRad);
              const y1 = 50 + 40 * Math.sin(startRad);
              const x2 = 50 + 40 * Math.cos(endRad);
              const y2 = 50 + 40 * Math.sin(endRad);
              
              const largeArc = item.percentage > 50 ? 1 : 0;
              
              const colors = {
                'bg-blue-500': '#3B82F6',
                'bg-purple-500': '#A855F7',
                'bg-pink-500': '#EC4899',
                'bg-green-500': '#10B981',
                'bg-gray-500': '#6B7280',
                'bg-indigo-500': '#6366F1',
                'bg-red-500': '#EF4444',
                'bg-yellow-500': '#EAB308'
              };

              return (
                <path
                  key={index}
                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={colors[item.color] || '#6B7280'}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-xs text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-sm text-gray-700">{item.category || `Category ${index + 1}`}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{item.percentage || 0}%</span>
              <span className="text-xs text-gray-500">({item.count || 0})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryChart;
