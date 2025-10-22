const Project = require('../models/projectModel');

// @desc    Get projects with filtering, sorting, and pagination
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        // --- Filtering ---
        const { search, category, minBudget, maxBudget } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } }, // Case-insensitive search
                { description: { $regex: search, $options: 'i' } },
                { skillsRequired: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        if (minBudget || maxBudget) {
            query.budget = {};
            if (minBudget) query.budget.$gte = Number(minBudget); // Greater than or equal to
            if (maxBudget) query.budget.$lte = Number(maxBudget); // Less than or equal to
        }

        // --- Sorting ---
        const { sort } = req.query;
        let sortOptions = { createdAt: -1 }; // Default: Newest first

        if (sort === 'budget-asc') {
            sortOptions = { budget: 1 }; // Ascending budget
        } else if (sort === 'budget-desc') {
            sortOptions = { budget: -1 }; // Descending budget
        }

        // --- Pagination ---
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10; // Default 10 projects per page
        const skip = (page - 1) * limit;

        // --- Execute Query ---
        const projects = await Project.find(query)
            .populate('user', 'name') // Get the name of the user who posted
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const totalProjects = await Project.countDocuments(query);
        const totalPages = Math.ceil(totalProjects / limit);

        res.json({
            projects,
            page,
            totalPages,
            totalProjects,
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
};

const createProject = async (req, res) => {
    // We can move the create logic here later if we want
};


module.exports = {
    getProjects,
};