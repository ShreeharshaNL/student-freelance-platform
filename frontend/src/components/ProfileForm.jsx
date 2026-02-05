import API from '../utils/api';

// Use centralized API instance so requests go to the configured backend
const getProfile = async () => {
  const response = await API.get('/profile');
  return response.data;
};

const updateProfile = async (profileData) => {
  const response = await API.put('/profile', profileData);
  return response.data;
};

const addSkill = async (skillData) => {
  const response = await API.post('/profile/skills', skillData);
  return response.data;
};

const profileService = {
  getProfile,
  updateProfile,
  addSkill,
};

export default profileService;