import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";

const ProjectsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "web-development", label: "Web Development" },
    { value: "graphic-design", label: "Graphic Design" },
    { value: "content-writing", label: "Content Writing" },
    { value: "data-entry", label: "Data Entry" },
    { value: "digital-marketing", label: "Digital Marketing" },
    { value: "mobile-app", label: "Mobile App Development" }
  ];

  const priceRanges = [
    { value: "all", label: "All Budgets" },
    { value: "0-2000", label: "₹0 - ₹2,000" },
    { value: "2000-5000", label: "₹2,000 - ₹5,000" },
    { value: "5000-10000", label: "₹5,000 - ₹10,000" },
    { value: "10000+", label: "₹10,000+" }
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "budget-high", label: "Highest Budget" },
    { value: "budget-low", label: "Lowest Budget" },
    { value: "deadline", label: "Urgent Deadline" }
  ];

  // Mock project data with realistic Indian amounts
  const allProjects = [
    {
      id: 1,
      title: "Simple Business Website",
      client: "Local Grocery Store",
      budget: "4,500",
      status: "open",
      deadline: "Dec 20, 2024",
      description: "Create a simple website for our local grocery store. Need basic pages: Home, About, Products, Contact. Should be mobile-friendly and easy to update.",
      skills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
      applications: 5,
      posted_date: "1 day ago",
      category: "web-development",
      urgency: "medium"
    },
    {
      id: 2,
      title: "Instagram Post Designs",
      client: "Fitness Trainer",
      budget: "2,200",
      status: "open",
      deadline: "Dec 15, 2024",
      description: "Need 10 Instagram post designs for fitness motivation quotes. Should be eye-catching and match our brand colors.",
      skills: ["Graphic Design", "Canva", "Social Media"],
      applications: 12,
      posted_date: "3 hours ago",
      category: "graphic-design",
      urgency: "high"
    },
    {
      id: 3,
      title: "Blog Content Writing",
      client: "Tech Startup",
      budget: "3,000",
      status: "open",
      deadline: "Dec 25, 2024",
      description: "Write 5 blog posts about technology trends. Each post should be 800-1000 words, SEO optimized, and engaging.",
      skills: ["Content Writing", "SEO", "Research"],
      applications: 8,
      posted_date: "6 hours ago",
      category: "content-writing",
      urgency: "medium"
    },
    {
      id: 4,
      title: "Product Data Entry",
      client: "E-commerce Store",
      budget: "1,800",
      status: "open",
      deadline: "Dec 12, 2024",
      description: "Enter 200 product details from PDF catalogs into our website. Need attention to detail and accuracy.",
      skills: ["Data Entry", "Excel", "Attention to Detail"],
      applications: 15,
      posted_date: "12 hours ago",
      category: "data-entry",
      urgency: "high"
    },
    {
      id: 5,
      title: "YouTube Thumbnail Design",
      client: "Educational YouTuber",
      budget: "1,500",
      status: "open",
      deadline: "Dec 18, 2024",
      description: "Create 20 YouTube thumbnails for educational videos. Should be bright, engaging, and clickable.",
      skills: ["Graphic Design", "Photoshop", "YouTube"],
      applications: 7,
      posted_date: "2 days ago",
      category: "graphic-design",
      urgency: "medium"
    },
    {
      id: 6,
      title: "WordPress Blog Setup",
      client: "Food Blogger",
      budget: "3,800",
      status: "open",
      deadline: "Dec 22, 2024",
      description: "Set up a WordPress blog for food recipes. Need theme customization, basic SEO setup, and content migration.",
      skills: ["WordPress", "SEO", "Web Development"],
      applications: 9,
      posted_date: "1 day ago",
      category: "web-development",
      urgency: "medium"
    },
    {
      id: 7,
      title: "Social Media Strategy Plan",
      client: "Small Restaurant",
      budget: "2,500",
      status: "open",
      deadline: "Dec 16, 2024",
      description: "Create a 3-month social media strategy plan for our restaurant. Include content calendar and posting schedule.",
      skills: ["Digital Marketing", "Social Media", "Strategy"],
      applications: 6,
      posted_date: "4 hours ago",
      category: "digital-marketing",
      urgency: "medium"
    },
    {
      id: 8,
      title: "Simple Mobile App UI",
      client: "Startup Founder",
      budget: "6,500",
      status: "open",
      deadline: "Jan 5, 2025",
      description: "Design UI screens for a simple to-do list mobile app. Need 8-10 screens with modern, clean design.",
      skills: ["UI/UX Design", "Figma", "Mobile Design"],
      applications: 11,
      posted_date: "2 days ago",
      category: "mobile-app",
      urgency: "low"
    }
  ];

  // Filter projects based on search and filters
  const filteredProjects = allProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || project.category === selectedCategory;
    
    const budget = parseInt(project.budget.replace(/,/g, ''));
    let matchesPrice = true;
    if (priceRange !== "all") {
      switch(priceRange) {
        case "0-2000":
          matchesPrice = budget <= 2000;
          break;
        case "2000-5000":
          matchesPrice = budget > 2000 && budget <= 5000;
          break;
        case "5000-10000":
          matchesPrice = budget > 5000 && budget <= 10000;
          break;
        case "10000+":
          matchesPrice = budget > 10000;
          break;
      }
    }
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch(sortBy) {
      case "budget-high":
        return parseInt(b.budget.replace(/,/g, '')) - parseInt(a.budget.replace(/,/g, ''));
      case "budget-low":
        return parseInt(a.budget.replace(/,/g, '')) - parseInt(b.budget.replace(/,/g, ''));
      case "deadline":
        return a.urgency === "high" ? -1 : b.urgency === "high" ? 1 : 0;
      default:
        return 0; // newest first (default order)
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Project</h1>
          <p className="text-gray-600">Discover opportunities that match your skills and grow your career</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <input
                  type="text"
                  placeholder="Search projects, skills..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
                <select
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quick Stats */}
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h4 className="font-medium text-indigo-900 mb-2">Quick Stats</h4>
                <div className="text-sm text-indigo-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Total Projects:</span>
                    <span className="font-medium">{allProjects.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Found:</span>
                    <span className="font-medium">{filteredProjects.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Avg Budget:</span>
                    <span className="font-medium">₹3,100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Projects List */}
          <div className="lg:col-span-3">
            {/* Sort and Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {filteredProjects.length} Projects Found
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {searchTerm && `Search results for "${searchTerm}"`}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <select
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Projects Grid */}
            {sortedProjects.length > 0 ? (
              <div className="space-y-6">
                {sortedProjects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                    setPriceRange("all");
                  }}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectsPage;
