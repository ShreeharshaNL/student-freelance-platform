import React, { useState, useEffect } from "react";

const EditProfileModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  userType = "student", 
  initialData = {}, 
  loading = false 
}) => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    website: "",
    companySize: "",
    industryType: "",
    skills: []
  });

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        name: initialData.name || initialData.companyName || "",
        bio: initialData.bio || initialData.description || "",
        location: initialData.location || "",
        website: initialData.website || "",
        companySize: initialData.companySize || "",
        industryType: initialData.industryType || "",
        skills: initialData.skills || []
      });
    }
  }, [isOpen, initialData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSkillAdd = (skillName) => {
    if (skillName.trim() && !formData.skills.some(skill => skill.name === skillName.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { name: skillName.trim(), level: 50, projects: 0 }]
      }));
    }
  };

  const handleSkillRemove = (skillName) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill.name !== skillName)
    }));
  };

  const handleSkillLevelChange = (skillName, level) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.map(skill => 
        skill.name === skillName ? { ...skill, level: parseInt(level) } : skill
      )
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Edit {userType === "student" ? "Profile" : "Company Profile"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
              
              {/* Name/Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {userType === "student" ? "Full Name" : "Company Name"}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder={userType === "student" ? "Enter your full name" : "Enter company name"}
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your location"
                />
              </div>

              {/* Bio/Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {userType === "student" ? "Bio" : "Company Description"}
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
                  placeholder={userType === "student" ? "Tell us about yourself..." : "Tell us about your company..."}
                />
              </div>
            </div>

            {/* Client-specific fields */}
            {userType === "client" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Company Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Industry Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry Type
                    </label>
                    <select
                      value={formData.industryType}
                      onChange={(e) => handleInputChange('industryType', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Industry</option>
                      <option value="Technology Services">Technology Services</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Company Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Size
                    </label>
                    <select
                      value={formData.companySize}
                      onChange={(e) => handleInputChange('companySize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Size</option>
                      <option value="1-10 employees">1-10 employees</option>
                      <option value="11-50 employees">11-50 employees</option>
                      <option value="51-200 employees">51-200 employees</option>
                      <option value="201-500 employees">201-500 employees</option>
                      <option value="500+ employees">500+ employees</option>
                    </select>
                  </div>
                </div>

                {/* Website */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="https://www.example.com"
                  />
                </div>
              </div>
            )}

            {/* Skills Section (for students) */}
            {userType === "student" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Skills</h3>
                
                {/* Add Skill */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a skill"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSkillAdd(e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.target.previousElementSibling;
                      handleSkillAdd(input.value);
                      input.value = '';
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Add
                  </button>
                </div>

                {/* Skills List */}
                <div className="space-y-3">
                  {formData.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900">{skill.name}</span>
                          <button
                            type="button"
                            onClick={() => handleSkillRemove(skill.name)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Level:</span>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={skill.level}
                            onChange={(e) => handleSkillLevelChange(skill.name, e.target.value)}
                            className="flex-1"
                          />
                          <span className="text-sm font-medium text-gray-900 w-12 text-right">{skill.level}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;