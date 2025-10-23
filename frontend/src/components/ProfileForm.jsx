import axios from 'axios';

const API_URL = '/api/profile';

// Get profile
const getProfile = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(API_URL, config);
  return response.data;
};

// Update profile
const updateProfile = async (profileData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(API_URL, profileData, config);
  return response.data;
};

// Add skill
const addSkill = async (skillData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(`${API_URL}/skills`, skillData, config);
  return response.data;
};

const profileService = {
  getProfile,
  updateProfile,
  addSkill,
};

export default profileService;