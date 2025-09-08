import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ProjectDetail = () => {
  const { id } = useParams();
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    proposedBudget: "",
    timeline: "",
    questions: ""
  });

  // Mock project data - in real app, this would come from API based on ID
  const project = {
    id: 1,
    title: "WordPress Blog Setup for Food Blogger",
    client: {
      name: "Ravi Kumar",
      company: "Foodie Delights Blog",
      location: "Mumbai, Maharashtra",
      rating: 4.7,
      projectsPosted: 8,
      hiredStudents: 12,
      memberSince: "Jan 2024",
      avatar: "RK"
    },
    budget: "₹3,800",
    budgetType: "fixed",
    status: "open",
    deadline: "Dec 22, 2024",
    postedDate: "3 days ago",
    applications: 9,
    description: `I'm looking for a talented student to help me set up a professional WordPress blog for my food content. This is a great opportunity for someone who wants to gain real-world experience while earning money.

**What I need:**
- Complete WordPress installation and setup
- Food blog theme installation and customization
- Basic SEO optimization setup
- Contact forms and newsletter signup
- Social media integration
- Mobile-responsive design
- Basic speed optimization

**What you'll get:**
- Real-world experience with WordPress
- A great portfolio project
- Positive review upon completion
- Potential for future projects

**Requirements:**
- Basic knowledge of WordPress
- Understanding of SEO basics  
- Attention to detail
- Good communication skills
- Ability to work within deadlines`,
    skills: ["WordPress", "SEO", "Web Development", "HTML/CSS"],
    experienceLevel: "Beginner",
    projectType: "Short-term",
    category: "Web Development",
    attachments: [
      { name: "brand-colors.pdf", size: "2.3 MB" },
      { name: "reference-sites.txt", size: "1.1 KB" }
    ],
    faqs: [
      {
        question: "Is this suitable for beginners?",
        answer: "Yes! This project is perfect for students who have basic WordPress knowledge and want to gain experience."
      },
      {
        question: "Will I get ongoing support?",
        answer: "Absolutely. I'll be available for questions and provide clear feedback throughout the project."
      },
      {
        question: "Can this lead to more projects?",
        answer: "Yes, if you do great work, I have several other websites that need development help."
      }
    ]
  };

  const similarProjects = [
    {
      id: 2,
      title: "E-commerce Website Setup",
      budget: "₹5,500",
      client: "Tech Store",
      applications: 15
    },
    {
      id: 3,
      title: "Portfolio Website Design",
      budget: "₹2,800",
      client: "Photographer",
      applications: 8
    },
    {
      id: 4,
      title: "Blog Content Management",
      budget: "₹1,200",
      client: "Travel Blogger", 
      applications: 12
    }
  ];

  const handleApplicationSubmit = () => {
    console.log("Application submitted:", applicationData);
    alert("Application submitted successfully!");
    setShowApplicationForm(false);
  };

  const renderApplicationForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Apply for Project</h3>
            <button 
              onClick={() => setShowApplicationForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter *
            </label>
            <textarea
              rows="6"
              placeholder="Tell the client why you're perfect for this project. Mention your relevant experience and what makes you stand out..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={applicationData.coverLetter}
              onChange={(e) => setApplicationData(prev => ({...prev, coverLetter: e.target.value}))}
            />
            <p className="text-sm text-gray-500 mt-1">Be specific and personalized</p>
          </div>

          {/* Proposed Budget */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proposed Budget *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-500">₹</span>
              <input
                type="number"
                placeholder="3500"
                className="w-full pl-8 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={applicationData.proposedBudget}
                onChange={(e) => setApplicationData(prev => ({...prev, proposedBudget: e.target.value}))}
              />
            </div>
            <p className="text-sm text-gray-500 mt-1">Client's budget: {project.budget}</p>
          </div>

          {/* Timeline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Timeline *
            </label>
            <select
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={applicationData.timeline}
              onChange={(e) => setApplicationData(prev => ({...prev, timeline: e.target.value}))}
            >
              <option value="">Select timeline</option>
              <option value="3-5 days">3-5 days</option>
              <option value="1 week">1 week</option>
              <option value="2 weeks">2 weeks</option>
              <option value="3-4 weeks">3-4 weeks</option>
            </select>
          </div>

          {/* Questions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Questions for Client (Optional)
            </label>
            <textarea
              rows="3"
              placeholder="Any questions about the project requirements, timeline, or expectations?"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={applicationData.questions}
              onChange={(e) => setApplicationData(prev => ({...prev, questions: e.target.value}))}
            />
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex gap-3">
          <button
            onClick={() => setShowApplicationForm(false)}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApplicationSubmit}
            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Submit Application
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>📅 Posted {project.postedDate}</span>
                    <span>📍 {project.client.location}</span>
                    <span>📝 {project.applications} applications</span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Open
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Budget:</span>
                  <span className="text-xl font-bold text-indigo-600">{project.budget}</span>
                  <span className="text-gray-500">({project.budgetType})</span>
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Deadline:</span>
                  <span className="text-gray-700">{project.deadline}</span>
                </div>
                <div className="h-4 w-px bg-gray-300"></div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Experience:</span>
                  <span className="text-gray-700">{project.experienceLevel}</span>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setShowApplicationForm(true)}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
              >
                Apply Now
              </button>
            </div>

            {/* Project Description */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Description</h2>
              <div className="prose prose-gray max-w-none">
                {project.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Attachments */}
            {project.attachments && project.attachments.length > 0 && (
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Files</h3>
                <div className="space-y-3">
                  {project.attachments.map((file, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <span className="text-2xl">📄</span>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{file.size}</p>
                      </div>
                      <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {project.faqs.map((faq, index) => (
                  <div key={index} className="border-b pb-4 last:border-b-0">
                    <h4 className="font-medium text-gray-900 mb-2">Q: {faq.question}</h4>
                    <p className="text-gray-600 text-sm">A: {faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Client Info */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Client</h3>
              
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                  {project.client.avatar}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{project.client.name}</h4>
                  <p className="text-sm text-gray-600">{project.client.company}</p>
                  <p className="text-xs text-gray-500">{project.client.location}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-900">{project.client.rating}</span>
                    <span className="text-yellow-500">⭐</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Projects Posted</span>
                  <span className="font-medium text-gray-900">{project.client.projectsPosted}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Students Hired</span>
                  <span className="font-medium text-gray-900">{project.client.hiredStudents}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium text-gray-900">{project.client.memberSince}</span>
                </div>
              </div>

              <button className="w-full mt-4 px-4 py-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors">
                View Client Profile
              </button>
            </div>

            {/* Similar Projects */}
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Projects</h3>
              <div className="space-y-4">
                {similarProjects.map((similar) => (
                  <div key={similar.id} className="border-b pb-4 last:border-b-0">
                    <h4 className="font-medium text-gray-900 mb-1 hover:text-indigo-600 cursor-pointer">
                      {similar.title}
                    </h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">by {similar.client}</span>
                      <span className="font-medium text-gray-900">{similar.budget}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{similar.applications} applications</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-xl border border-green-200">
              <h4 className="font-semibold text-gray-900 mb-3">💡 Application Tips</h4>
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Read the project description carefully</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Mention specific relevant experience</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Ask thoughtful questions</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span>Propose a realistic timeline</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showApplicationForm && renderApplicationForm()}
      <Footer />
    </div>
  );
};

export default ProjectDetail;
