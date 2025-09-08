import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

const PostProject = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    budget: "",
    budgetType: "fixed",
    deadline: "",
    skills: [],
    projectType: "short-term",
    experienceLevel: "beginner",
    attachments: []
  });

  const categories = [
    { value: "", label: "Select Category" },
    { value: "web-development", label: "Web Development" },
    { value: "graphic-design", label: "Graphic Design" },
    { value: "content-writing", label: "Content Writing" },
    { value: "data-entry", label: "Data Entry" },
    { value: "digital-marketing", label: "Digital Marketing" },
    { value: "mobile-app", label: "Mobile App Development" },
    { value: "video-editing", label: "Video Editing" },
    { value: "translation", label: "Translation" }
  ];

  const commonSkills = [
    "HTML", "CSS", "JavaScript", "React", "Node.js", "WordPress", "SEO",
    "Photoshop", "Illustrator", "Canva", "Figma", "Content Writing",
    "Data Entry", "Excel", "Social Media", "Digital Marketing",
    "Video Editing", "Translation", "Research", "Customer Service"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillToggle = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log("Project Data:", formData);
    // Handle project submission
    alert("Project posted successfully!");
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Basics</h3>
      </div>

      {/* Project Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Title *
        </label>
        <input
          type="text"
          placeholder="e.g., Create a WordPress blog for my restaurant"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
        />
        <p className="text-sm text-gray-500 mt-1">
          Write a clear, descriptive title that explains what you need
        </p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category *
        </label>
        <select
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={formData.category}
          onChange={(e) => handleInputChange('category', e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Project Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Description *
        </label>
        <textarea
          rows="6"
          placeholder="Describe your project in detail. What do you need done? What are your requirements? What should the final result look like?"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
        <p className="text-sm text-gray-500 mt-1">
          Be specific about your requirements. The more details you provide, the better proposals you'll receive.
        </p>
      </div>

      {/* Skills Required */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills Required
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {commonSkills.map(skill => (
            <button
              key={skill}
              type="button"
              onClick={() => handleSkillToggle(skill)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                formData.skills.includes(skill)
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Select the skills needed for this project. Students will see these when browsing.
        </p>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget & Timeline</h3>
      </div>

      {/* Budget Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Budget Type *
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleInputChange('budgetType', 'fixed')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              formData.budgetType === 'fixed'
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="font-medium text-gray-900">Fixed Price</div>
            <div className="text-sm text-gray-500">Pay a set amount for the entire project</div>
          </button>
          <button
            type="button"
            onClick={() => handleInputChange('budgetType', 'hourly')}
            className={`p-4 border rounded-lg text-left transition-colors ${
              formData.budgetType === 'hourly'
                ? "border-indigo-600 bg-indigo-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="font-medium text-gray-900">Hourly Rate</div>
            <div className="text-sm text-gray-500">Pay based on hours worked</div>
          </button>
        </div>
      </div>

      {/* Budget Amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {formData.budgetType === 'fixed' ? 'Project Budget *' : 'Hourly Rate *'}
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-500">₹</span>
          <input
            type="number"
            placeholder={formData.budgetType === 'fixed' ? '5000' : '200'}
            className="w-full pl-8 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.budget}
            onChange={(e) => handleInputChange('budget', e.target.value)}
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {formData.budgetType === 'fixed' 
            ? 'Set a fair budget based on the project scope'
            : 'Typical student rates: ₹150-500 per hour'
          }
        </p>
      </div>

      {/* Deadline */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Deadline *
        </label>
        <input
          type="date"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          value={formData.deadline}
          onChange={(e) => handleInputChange('deadline', e.target.value)}
          min={new Date().toISOString().split('T')[0]}
        />
      </div>

      {/* Project Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Duration
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'short-term', label: 'Short-term', desc: 'Less than 1 month' },
            { value: 'medium-term', label: 'Medium-term', desc: '1-3 months' },
            { value: 'long-term', label: 'Long-term', desc: '3+ months' }
          ].map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleInputChange('projectType', option.value)}
              className={`p-3 border rounded-lg text-center transition-colors ${
                formData.projectType === option.value
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium text-gray-900 text-sm">{option.label}</div>
              <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Student Experience Level
        </label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'beginner', label: 'Beginner', desc: 'New to freelancing' },
            { value: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
            { value: 'expert', label: 'Expert', desc: 'Highly experienced' }
          ].map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleInputChange('experienceLevel', option.value)}
              className={`p-3 border rounded-lg text-center transition-colors ${
                formData.experienceLevel === option.value
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="font-medium text-gray-900 text-sm">{option.label}</div>
              <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Review & Post</h3>
      </div>

      {/* Project Summary */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h4 className="font-semibold text-gray-900 mb-4">Project Summary</h4>
        
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-500">Title:</span>
            <p className="text-gray-900">{formData.title || "Not specified"}</p>
          </div>
          
          <div>
            <span className="text-sm font-medium text-gray-500">Category:</span>
            <p className="text-gray-900">
              {categories.find(c => c.value === formData.category)?.label || "Not selected"}
            </p>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-500">Budget:</span>
            <p className="text-gray-900">
              ₹{formData.budget || "0"} ({formData.budgetType === 'fixed' ? 'Fixed Price' : 'Per Hour'})
            </p>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-500">Deadline:</span>
            <p className="text-gray-900">{formData.deadline || "Not specified"}</p>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-500">Skills Required:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {formData.skills.length > 0 ? (
                formData.skills.map(skill => (
                  <span key={skill} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-sm">No skills selected</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-sm font-medium text-gray-500">Description:</span>
            <p className="text-gray-900 mt-1 text-sm leading-relaxed">
              {formData.description || "No description provided"}
            </p>
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Additional Options</h4>
        
        <div className="flex items-center gap-3">
          <input type="checkbox" id="featured" className="rounded" />
          <label htmlFor="featured" className="text-sm text-gray-700">
            Make this a featured project (+₹100) - Get more visibility and applications
          </label>
        </div>
        
        <div className="flex items-center gap-3">
          <input type="checkbox" id="urgent" className="rounded" />
          <label htmlFor="urgent" className="text-sm text-gray-700">
            Mark as urgent (+₹50) - Show urgency badge to attract faster responses
          </label>
        </div>
      </div>

      {/* Terms */}
      <div className="border-t pt-6">
        <div className="flex items-start gap-3">
          <input type="checkbox" id="terms" className="rounded mt-1" required />
          <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
            I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-700">Terms of Service</a> and 
            confirm that this project complies with our community guidelines. I understand that I'll be charged 
            a 5% platform fee on successful project completion.
          </label>
        </div>
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: "Project Details", completed: currentStep > 1 },
    { number: 2, title: "Budget & Timeline", completed: currentStep > 2 },
    { number: 3, title: "Review & Post", completed: false }
  ];

  return (
    <DashboardLayout userType="client">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Post a New Project</h1>
          <p className="text-gray-600 mt-1">Find talented students to help with your project</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm ${
                  step.number === currentStep
                    ? "bg-indigo-600 text-white"
                    : step.completed
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}>
                  {step.completed ? "✓" : step.number}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step.number === currentStep ? "text-indigo-600" : "text-gray-600"
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-px mx-4 ${
                    step.completed ? "bg-green-600" : "bg-gray-300"
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[400px]">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            
            {currentStep === 3 ? (
              <button
                onClick={handleSubmit}
                className="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Post Project
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>

        {/* Tips Sidebar */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Tips for Success</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✅</span>
              <p className="text-gray-700">Be specific about your requirements to get better proposals</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✅</span>
              <p className="text-gray-700">Set realistic budgets - students offer great value for money</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✅</span>
              <p className="text-gray-700">Provide examples or references to help students understand your vision</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-green-600 mt-1">✅</span>
              <p className="text-gray-700">Respond to applications quickly to show you're an active client</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PostProject;
