import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

const StudentEarnings = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock earnings data
  const earningsData = {
    totalEarnings: "₹12,450",
    thisMonth: "₹3,200",
    pendingPayments: "₹1,800",
    availableBalance: "₹10,650",
    completedProjects: 12,
    averageProjectValue: "₹1,038"
  };

  const transactions = [
    {
      id: 1,
      type: "payment_received",
      project: "Logo Design for Chai Corner",
      client: "Chai Corner",
      amount: "₹2,000",
      status: "completed",
      date: "2024-11-25",
      paymentMethod: "Bank Transfer"
    },
    {
      id: 2,
      type: "payment_pending",
      project: "Simple Portfolio Website", 
      client: "Small Business Owner",
      amount: "₹4,200",
      status: "pending",
      date: "2024-11-24",
      paymentMethod: "Bank Transfer"
    },
    {
      id: 3,
      type: "payment_received",
      project: "Instagram Post Designs",
      client: "Fitness Trainer",
      amount: "₹2,000",
      status: "completed",
      date: "2024-11-20",
      paymentMethod: "UPI"
    },
    {
      id: 4,
      type: "payment_received",
      project: "Social Media Graphics",
      client: "Local Restaurant", 
      amount: "₹1,800",
      status: "completed",
      date: "2024-11-18",
      paymentMethod: "Bank Transfer"
    },
    {
      id: 5,
      type: "payment_received",
      project: "WordPress Blog Setup",
      client: "Food Blogger",
      amount: "₹3,800",
      status: "completed",
      date: "2024-11-15",
      paymentMethod: "UPI"
    }
  ];

  const monthlyEarnings = [
    { month: "Nov 2024", amount: "₹3,200", projects: 4 },
    { month: "Oct 2024", amount: "₹4,500", projects: 5 },
    { month: "Sep 2024", amount: "₹2,800", projects: 3 },
    { month: "Aug 2024", amount: "₹1,950", projects: 2 }
  ];

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "transactions", label: "Transactions", icon: "💰" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "payments", label: "Payment Methods", icon: "💳" }
  ];

  const getStatusBadge = (status) => {
    const statusStyles = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Available Balance</p>
              <p className="text-2xl font-bold text-green-900">{earningsData.availableBalance}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <span className="text-2xl">📈</span>
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">This Month</p>
              <p className="text-2xl font-bold text-blue-900">{earningsData.thisMonth}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <span className="text-2xl">⏳</span>
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-medium">Pending Payments</p>
              <p className="text-2xl font-bold text-yellow-900">{earningsData.pendingPayments}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Earnings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings</h3>
        <div className="space-y-4">
          {monthlyEarnings.map((month, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{month.month}</p>
                <p className="text-sm text-gray-600">{month.projects} projects completed</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{month.amount}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-2xl">🏦</span>
            <div className="text-left">
              <p className="font-medium text-gray-900">Withdraw Earnings</p>
              <p className="text-sm text-gray-600">Transfer money to your bank account</p>
            </div>
          </button>
          
          <button className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <span className="text-2xl">📊</span>
            <div className="text-left">
              <p className="font-medium text-gray-900">Download Report</p>
              <p className="text-sm text-gray-600">Get detailed earnings report</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderTransactions = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
        <div className="flex gap-2">
          <select className="px-3 py-2 border rounded-lg text-sm">
            <option>All Time</option>
            <option>This Month</option>
            <option>Last 3 Months</option>
          </select>
          <button className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 text-sm">
            Export
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-lg ${
                transaction.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                <span className="text-xl">
                  {transaction.status === 'completed' ? '✅' : '⏳'}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{transaction.project}</p>
                <p className="text-sm text-gray-600">Client: {transaction.client}</p>
                <p className="text-xs text-gray-500">
                  {transaction.date} • {transaction.paymentMethod}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-bold text-gray-900">{transaction.amount}</p>
              {getStatusBadge(transaction.status)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">{earningsData.completedProjects}</div>
          <div className="text-sm text-gray-600">Projects Completed</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">{earningsData.averageProjectValue}</div>
          <div className="text-sm text-gray-600">Avg Project Value</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">16</div>
          <div className="text-sm text-gray-600">Days Avg Completion</div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">4.6</div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
      </div>

      {/* Earnings by Category */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings by Category</h3>
        <div className="space-y-4">
          {[
            { category: "Web Development", amount: "₹6,200", percentage: 50 },
            { category: "Graphic Design", amount: "₹3,800", percentage: 31 },
            { category: "Content Writing", amount: "₹2,450", percentage: 19 }
          ].map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{item.category}</span>
                <span className="text-sm font-bold text-gray-900">{item.amount}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      {/* Current Payment Methods */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            Add Payment Method
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-xl">🏦</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">State Bank of India</p>
                <p className="text-sm text-gray-600">Account ending in ****4567</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Primary
            </span>
          </div>
          
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-xl">📱</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">UPI</p>
                <p className="text-sm text-gray-600">priya@paytm</p>
              </div>
            </div>
            <button className="text-indigo-600 hover:text-indigo-700 text-sm">
              Edit
            </button>
          </div>
        </div>
      </div>

      {/* Withdrawal Settings */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdrawal Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Withdrawal Amount
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                defaultValue="500"
                className="w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <span className="text-gray-600">INR</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Auto-withdrawal
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm text-gray-700">
                Automatically withdraw earnings weekly
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Tax Information */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📄 Tax Information</h3>
        <div className="space-y-3 text-sm">
          <p className="text-gray-700">
            As a freelancer in India, you may need to pay taxes on your earnings. Here are some important points:
          </p>
          <ul className="space-y-1 text-gray-600 ml-4">
            <li>• Income tax is applicable if annual income exceeds ₹2.5 lakhs</li>
            <li>• Keep records of all your project payments and expenses</li>
            <li>• Consider consulting a tax advisor for proper guidance</li>
            <li>• TDS may be deducted by clients on payments above ₹30,000</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Earnings & Payments</h1>
          <p className="text-gray-600 mt-1">Track your income and manage payment methods</p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">{earningsData.totalEarnings}</div>
            <div className="text-sm text-gray-600">Total Earnings</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">{earningsData.thisMonth}</div>
            <div className="text-sm text-gray-600">This Month</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">{earningsData.completedProjects}</div>
            <div className="text-sm text-gray-600">Completed Projects</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="text-2xl font-bold text-gray-900">{earningsData.averageProjectValue}</div>
            <div className="text-sm text-gray-600">Avg Project Value</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-indigo-600 text-indigo-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === "overview" && renderOverview()}
            {activeTab === "transactions" && renderTransactions()}
            {activeTab === "analytics" && renderAnalytics()}
            {activeTab === "payments" && renderPayments()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentEarnings;
