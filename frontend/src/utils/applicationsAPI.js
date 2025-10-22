import API from './api';

export const applicationsAPI = {
    // Submit application for a project
    submitApplication: async (projectId, applicationData) => {
        try {
            // Validate required fields
            if (!applicationData.coverLetter?.trim()) {
                throw new Error('Cover letter is required');
            }
            if (!applicationData.proposedBudget || applicationData.proposedBudget <= 0) {
                throw new Error('Please enter a valid proposed budget');
            }
            if (!applicationData.timeline) {
                throw new Error('Please select an estimated timeline');
            }

            // Format data for submission
            const formattedData = {
                coverLetter: applicationData.coverLetter.trim(),
                proposedBudget: Number(applicationData.proposedBudget),
                timeline: applicationData.timeline,
                questions: applicationData.questions?.trim() || ''
            };

            console.log('Submitting application with data:', formattedData);
            const response = await API.post(`/projects/${projectId}/apply`, formattedData);
            return response;
        } catch (error) {
            console.error('Application submission error:', error);
            throw error;
        }
    },

    // Get student's applications
    getMyApplications: async () => {
        try {
            const response = await API.get('/applications/me');
            console.log('Get my applications response:', response);
            return response;
        } catch (error) {
            console.error('Get my applications error:', error);
            throw error;
        }
    },

    // Get all applications for a project
    getProjectApplications: async (projectId) => {
        try {
            const response = await API.get(`/applications/project/${projectId}`);
            console.log('Get project applications response:', response);
            return response;
        } catch (error) {
            console.error('Get project applications error:', error);
            throw error;
        }
    },

    // Get all projects with applications (client)
    getMyProjects: async () => {
        try {
            const response = await API.get('/projects/my-with-applications');
            console.log('Get my projects with applications response:', response);
            return response;
        } catch (error) {
            console.error('Get my projects error:', error);
            throw error;
        }
    },

    // Update application status (client)
    updateApplicationStatus: async (applicationId, status) => {
        try {
            if (!['accepted', 'rejected'].includes(status)) {
                throw new Error('Invalid application status');
            }
            const response = await API.put(`/projects/applications/${applicationId}/status`, { status });
            console.log('Update application status response:', response);
            return response;
        } catch (error) {
            console.error('Update application status error:', error);
            throw error;
        }
    },

    // Delete application (student)
    deleteApplication: async (applicationId) => {
        try {
            const response = await API.delete(`/applications/${applicationId}`);
            console.log('Delete application response:', response);
            return response;
        } catch (error) {
            console.error('Delete application error:', error);
            throw error;
        }
    }
};

export default applicationsAPI;
