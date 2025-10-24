import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { applicationsAPI } from '../utils/applicationsAPI';
import { useNavigate } from 'react-router-dom';
import { normalizeStatus } from '../utils/status';

const ClientActive = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeHires, setActiveHires] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActiveHires = async () => {
      try {
        setLoading(true);
        const res = await applicationsAPI.getMyProjects();
        if (!res.data.success) {
          throw new Error(res.data.error || 'Failed to fetch projects');
        }

        const projects = res.data.data || [];
        // For each project, find accepted or in-progress application
        const hires = projects
          .map(project => {
            const acceptedApp = (project.applications || []).find(a => normalizeStatus(a.status) === 'in_progress');
            if (!acceptedApp) return null;
            return {
              projectId: project._id,
              projectTitle: project.title,
              budget: project.budget,
              student: acceptedApp.student,
              applicationId: acceptedApp._id,
              startedAt: acceptedApp.createdAt,
              projectStatus: project.status
            };
          })
          .filter(Boolean);

        setActiveHires(hires);
      } catch (err) {
        console.error('Error fetching active hires:', err);
        setError(err.message || 'Failed to load active hires');
      } finally {
        setLoading(false);
      }
    };

    fetchActiveHires();
  }, []);

  if (loading) {
    return (
      <DashboardLayout userType="client">
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout userType="client">
        <div className="p-4 bg-red-50 text-red-800 rounded-lg">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="client">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Active Hires</h1>
            <p className="text-gray-600 mt-1">Students you've hired — manage ongoing work and message them</p>
          </div>
        </div>

        {activeHires.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No active hires yet</h3>
            <p className="text-gray-600">Once you accept applications, active hires will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeHires.map(hire => (
              <div key={hire.applicationId} className="bg-white p-4 rounded-lg border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                      {hire.student.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{hire.student.name}</h3>
                      <p className="text-sm text-gray-600">{hire.student.location || 'Not specified'}</p>
                      <div className="text-sm text-gray-600 mt-2">
                        <span className="font-medium">{hire.projectTitle}</span> • ₹{hire.budget}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <button
                      onClick={() => navigate(`/client/messages?userId=${hire.student._id}`)}
                      className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm"
                    >
                      Message
                    </button>
                    <button
                      onClick={() => navigate(`/projects/${hire.projectId}`)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      View Project
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ClientActive;
