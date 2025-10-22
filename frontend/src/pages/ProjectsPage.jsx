import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import ProjectCard from "../components/ProjectCard";
import API from "../utils/api"; // Import our API utility

// (Optional but recommended) A custom hook to debounce the search term
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
};


const ProjectsPage = () => {
  // --- State for Filters (Your existing state is perfect) ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  
  // --- 1. NEW: State for data, loading, errors, and pagination ---
  const [projects, setProjects] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProjects, setTotalProjects] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 2. NEW: Debounce the search term to prevent API calls on every keystroke ---
  const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms delay

  // --- Filter options ---
  const categories = [
    { value: "all", label: "All Categories" },
    { value: "web-development", label: "Web Development" },
    { value: "mobile-app", label: "Mobile App Development" },
    { value: "graphic-design", label: "Graphic Design" },
    { value: "content-writing", label: "Content Writing" },
    { value: "digital-marketing", label: "Digital Marketing" },
    { value: "video-editing", label: "Video Editing" },
    { value: "data-entry", label: "Data Entry" },
    { value: "translation", label: "Translation" }
  ];

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-100", label: "Under $100" },
    { value: "100-500", label: "₹100 - ₹500" },
    { value: "500-1000", label: "₹500 - ₹1000" },
    { value: "1000-5000", label: "₹1000 - ₹5000" },
    { value: "5000+", label: "₹5000+" }
  ];

  const sortOptions = [
    { value: "newest", label: "Most Recent" },
    { value: "budget-high", label: "Budget: High to Low" },
    { value: "budget-low", label: "Budget: Low to High" }
  ];

  // --- 3. NEW: useEffect hook to fetch data when filters change ---
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      try {
        // Build the query parameters
        const params = new URLSearchParams();
        if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);
        if (selectedCategory !== 'all') params.append('category', selectedCategory);
        
        // Handle price range
        if (priceRange !== 'all') {
            if (priceRange.includes('+')) {
                params.append('minBudget', priceRange.replace('+', ''));
            } else {
                const [min, max] = priceRange.split('-');
                params.append('minBudget', min);
                params.append('maxBudget', max);
            }
        }
        
        // Handle sorting (mapping frontend values to backend values)
        if (sortBy === 'budget-high') params.append('sort', 'budget-desc');
        if (sortBy === 'budget-low') params.append('sort', 'budget-asc');

        params.append('page', page);
        params.append('limit', 9); // Or how many you want per page

        // Make the API call
        const response = await API.get(`/projects?${params.toString()}`);
        
        if (response.data.success === false) {
          throw new Error(response.data.error || 'Failed to fetch projects');
        }

        setProjects(response.data.projects);
        setTotalProjects(response.data.totalProjects);
        setTotalPages(response.data.totalPages);

      } catch (err) {
        setError("Failed to fetch projects. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
    // This effect runs whenever a filter or the page number changes
  }, [debouncedSearchTerm, selectedCategory, priceRange, sortBy, page]);


  // --- 4. REMOVED: The mock 'allProjects' array and the frontend filtering/sorting logic ---
  // The backend now does all the heavy lifting!

  return (
    <DashboardLayout userType="student">
      <div className="space-y-6">
        {/* Header Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Browse Projects</h1>
          <p className="text-gray-600 mt-1">Discover opportunities that match your skills and grow your career</p>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar (No changes to the JSX structure) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                {/* Search Input */}
                <div className="mb-6">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                    Search Projects
                  </label>
                  <input
                    type="text"
                    id="search"
                    placeholder="Search by title or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    id="priceRange"
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {priceRanges.map(range => (
                      <option key={range.value} value={range.value}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
            </div>
          </div>

          {/* Projects List */}
          <div className="lg:col-span-3">
            {/* Sort and Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {totalProjects} Projects Found
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Browse available projects that match your criteria
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* --- 6. NEW: Handle Loading and Error states --- */}
            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : error ? (
                <div className="text-center py-12 text-red-500">{error}</div>
            ) : (
                <>
                    {/* Projects Grid */}
                    {projects.length > 0 ? (
                        <div className="space-y-6">
                            {/* 7. UPDATE: Map over 'projects' from state */}
                            {projects.map(project => (
                                <ProjectCard key={project._id} project={project} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            {/* ... your 'No projects found' JSX ... */}
                        </div>
                    )}

                    {/* --- 8. NEW: Pagination Controls --- */}
                    <div className="mt-8 flex justify-center items-center gap-4">
                        <button 
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
                            disabled={page === 1}
                            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button 
                            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))} 
                            disabled={page === totalPages}
                            className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
          </div>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
};

export default ProjectsPage;