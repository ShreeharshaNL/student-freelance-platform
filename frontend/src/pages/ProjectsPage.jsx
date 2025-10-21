import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProjectCard from "../components/ProjectCard";

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

  // --- Filter options (Your existing data is perfect) ---
  const categories = [ /* ...your categories array... */ ];
  const priceRanges = [ /* ...your priceRanges array... */ ];
  const sortOptions = [ /* ...your sortOptions array... */ ];

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
        const res = await axios.get(`http://localhost:5000/api/projects?${params.toString()}`);
        
        setProjects(res.data.projects);
        setTotalProjects(res.data.totalProjects);
        setTotalPages(res.data.totalPages);

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Header Section (No changes) */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Next Project</h1>
          <p className="text-gray-600">Discover opportunities that match your skills and grow your career</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar (No changes to the JSX structure) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
                {/* ... your filter inputs (search, category, price range) ... they will work as is */}
            </div>
          </div>

          {/* Projects List */}
          <div className="lg:col-span-3">
            {/* Sort and Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <div>
                {/* 5. UPDATE: Use state from backend */}
                <h2 className="text-xl font-semibold text-gray-900">
                  {totalProjects} Projects Found
                </h2>
                {/* ... */}
              </div>
              {/* ... your sort dropdown ... it will work as is */}
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
      <Footer />
    </div>
  );
};

export default ProjectsPage;