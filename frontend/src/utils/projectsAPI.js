import API from './api';

export const projectsAPI = {
    // Create new project
    createProject: async (projectData) => {
        return API.post('/projects', projectData);
    },

    // Get all projects (with optional filters)
    getProjects: async (params) => {
        return API.get('/projects', { params });
    },

    // Get project by ID
    getProjectById: async (id) => {
        return API.get(`/projects/${id}`);
    },

    // Get client's projects
    getMyProjects: async () => {
        return API.get('/projects/my');
    },

    // Submit application
    submitApplication: async (projectId, applicationData) => {
        return API.post(`/projects/${projectId}/applications`, applicationData);
    },

    // Get project applications (for client)
    getProjectApplications: async (projectId) => {
        return API.get(`/projects/${projectId}/applications`);
    },

    // Get student's applications
    getMyApplications: async () => {
        try {
            const response = await API.get('/projects/my-applications');
            console.log('API getMyApplications response:', response);
            return response;
        } catch (error) {
            console.error('Error in getMyApplications:', error);
            throw error;
        }
    },

    // Update application status (for client)
    updateApplicationStatus: async (projectId, applicationId, status) => {
        return API.put(`/projects/${projectId}/applications/${applicationId}`, { status });
    },

    // Update project progress (for student)
    updateProjectProgress: async (projectId, progress) => {
        return API.put(`/projects/${projectId}/progress`, { progress });
    }
};