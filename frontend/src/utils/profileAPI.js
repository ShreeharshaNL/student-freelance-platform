//profileAPI.js

import API from './api'; // Your existing axios instance

export const profileAPI = {
  // Get profile
  getProfile: async () => {
    const response = await API.get('/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (data) => {
    const response = await API.put('/profile', data);
    return response.data;
  },

  // Skills
  addSkill: async (skillData) => {
    const response = await API.post('/profile/skills', skillData);
    return response.data;
  },

  updateSkill: async (skillId, skillData) => {
    const response = await API.put(`/profile/skills/${skillId}`, skillData);
    return response.data;
  },

  deleteSkill: async (skillId) => {
    const response = await API.delete(`/profile/skills/${skillId}`);
    return response.data;
  },

  // Portfolio
  addPortfolio: async (projectData) => {
    const response = await API.post('/profile/portfolio', projectData);
    return response.data;
  },

  updatePortfolio: async (projectId, projectData) => {
    const response = await API.put(`/profile/portfolio/${projectId}`, projectData);
    return response.data;
  },

  deletePortfolio: async (projectId) => {
    const response = await API.delete(`/profile/portfolio/${projectId}`);
    return response.data;
  },

  // Education
  addEducation: async (eduData) => {
    const response = await API.post('/profile/education', eduData);
    return response.data;
  },

  deleteEducation: async (eduId) => {
    const response = await API.delete(`/profile/education/${eduId}`);
    return response.data;
  },

  // Certifications
  addCertification: async (certData) => {
    const response = await API.post('/profile/certifications', certData);
    return response.data;
  },

  deleteCertification: async (certId) => {
    const response = await API.delete(`/profile/certifications/${certId}`);
    return response.data;
  },
};