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

    // Update project
    updateProject: async (id, projectData) => {
        return API.put(`/projects/${id}`, projectData);
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
        return API.get('/applications/me');
    },

    // Update application status (for client)
    updateApplicationStatus: async (projectId, applicationId, status) => {
        return API.put(`/projects/${projectId}/applications/${applicationId}`, { status });
    }
};