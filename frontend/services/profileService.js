import axios from 'axios';

const API_URL = 'http://localhost:5000/api/profile';

// ...existing code...

// Add these new functions before the profileService object
const addSkill = async (skillData, token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    };
    const response = await axios.post(`${API_URL}/skills`, skillData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const deleteSkill = async (skillId, token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.delete(`${API_URL}/skills/${skillId}`, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const profileService = {
  getProfile,
  updateProfile,
  addSkill,     // Add these new functions
  deleteSkill   // to the service object
};

export default profileService;