// @desc    Student updates progress on a project
// @route   PUT /api/projects/:id/progress
// @access  Private (Student only)
const updateProjectProgress = async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                error: 'Only students can update progress'
            });
        }

        const { progress } = req.body;
        if (typeof progress !== 'number' || progress < 0 || progress > 100) {
            return res.status(400).json({
                success: false,
                error: 'Progress must be a number between 0 and 100'
            });
        }

        console.log('Update progress request:', { projectId: req.params.id, userId: req.user.id, progress });

        // Find the student's application for this project using Application model
        const application = await Application.findOne({
            project: req.params.id,
            student: req.user.id
        });

        if (!application) {
            console.log('Application not found for student:', { projectId: req.params.id, userId: req.user.id });
            return res.status(404).json({
                success: false,
                error: 'Application not found for this student'
            });
        }

        application.progress = progress;
        await application.save();

        res.json({
            success: true,
            data: { progress }
        });
    } catch (error) {
        console.error('Update project progress error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};
const Project = require('../models/projectModel');
const Application = require('../models/Application');
const { calculateProjectFees } = require('../utils/projectFees');

// @desc    Get projects with filtering, sorting, and pagination
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
    try {
        // --- Filtering ---
        const { 
            search, 
            category, 
            minBudget, 
            maxBudget,
            budgetType,
            experienceLevel,
            projectType,
            skills,
            featured,
            urgent,
            status
        } = req.query;
        
        let query = {};

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { skillsRequired: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        if (minBudget || maxBudget) {
            query.budget = {};
            if (minBudget) query.budget.$gte = Number(minBudget);
            if (maxBudget) query.budget.$lte = Number(maxBudget);
        }

        if (budgetType) {
            query.budgetType = budgetType;
        }

        if (experienceLevel) {
            query.experienceLevel = experienceLevel;
        }

        if (projectType) {
            query.projectType = projectType;
        }

        if (skills) {
            const skillsArray = skills.split(',');
            query.skillsRequired = { $in: skillsArray };
        }

        if (featured === 'true') {
            query.isFeatured = true;
        }

        if (urgent === 'true') {
            query.isUrgent = true;
        }

        if (status) {
            query.status = status;
        }

        // --- Sorting ---
        const { sort } = req.query;
        let sortOptions = { createdAt: -1 }; // Default: Newest first

        switch (sort) {
            case 'budget-asc':
                sortOptions = { budget: 1 };
                break;
            case 'budget-desc':
                sortOptions = { budget: -1 };
                break;
            case 'deadline-asc':
                sortOptions = { deadline: 1 };
                break;
            case 'deadline-desc':
                sortOptions = { deadline: -1 };
                break;
            case 'applications-desc':
                sortOptions = { applicationsCount: -1 };
                break;
            case 'featured':
                sortOptions = { isFeatured: -1, createdAt: -1 };
                break;
            case 'urgent':
                sortOptions = { isUrgent: -1, createdAt: -1 };
                break;
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

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private (Client only)
const createProject = async (req, res) => {
    try {
        // Check if user is a client
        if (req.user.role !== 'client') {
            return res.status(403).json({
                success: false,
                error: 'Only clients can create projects'
            });
        }

        const { 
            title, 
            description, 
            category, 
            budget,
            budgetType,
            deadline,
            skillsRequired,
            projectType,
            experienceLevel,
            isFeatured,
            isUrgent
        } = req.body;

        // Validate required fields
        if (!title || !description || !category || !budget || !budgetType || !deadline || !skillsRequired) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required fields'
            });
        }

        // Validate budget type
        if (!['fixed', 'hourly'].includes(budgetType)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid budget type'
            });
        }

        // Validate project type
        if (projectType && !['short-term', 'medium-term', 'long-term'].includes(projectType)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid project type'
            });
        }

        // Validate experience level
        if (experienceLevel && !['beginner', 'intermediate', 'expert'].includes(experienceLevel)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid experience level'
            });
        }

        // Create project with all fields
        const project = await Project.create({
            user: req.user.id,
            title,
            description,
            category,
            budget: Number(budget),
            budgetType,
            deadline: new Date(deadline),
            skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [skillsRequired],
            projectType: projectType || 'short-term',
            experienceLevel: experienceLevel || 'beginner',
            isFeatured: isFeatured || false,
            isUrgent: isUrgent || false,
            status: 'open'
        });

        res.status(201).json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Public
const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('user', 'name email')
            .populate({
                path: 'applications.student',
                select: 'name email skills location'
            })
            .lean();

        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found'
            });
        }

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error('Get project by ID error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get client's projects
// @route   GET /api/projects/my-projects
// @access  Private (Client only)
const getMyProjects = async (req, res) => {
    try {
        if (req.user.role !== 'client') {
            return res.status(403).json({
                success: false,
                error: 'Only clients can view their projects'
            });
        }

        const projects = await Project.find({ user: req.user.id })
            .sort('-createdAt');

        res.json({
            success: true,
            data: projects
        });
    } catch (error) {
        console.error('Get my projects error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Calculate project fees
// @route   POST /api/projects/calculate-fees
// @access  Private (Client only)
// @desc    Apply to a project
// @route   POST /api/projects/:id/apply
// @access  Private (Students only)
const applyToProject = async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                error: 'Only students can apply to projects'
            });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found'
            });
        }

        // Check if student has already applied
        const hasApplied = project.applications.some(
            app => app.student.toString() === req.user.id
        );
        if (hasApplied) {
            return res.status(400).json({
                success: false,
                error: 'You have already applied to this project'
            });
        }

        const { proposedBudget, timeline, coverLetter, questions } = req.body;

        // Validate required fields
        if (!proposedBudget || !timeline || !coverLetter) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required fields'
            });
        }

        // Add application
        project.applications.push({
            student: req.user.id,
            proposedBudget: Number(proposedBudget),
            timeline,
            coverLetter,
            questions
        });

        // Update applications count
        project.applicationsCount = project.applications.length;
        await project.save();

        const populatedProject = await Project.findById(project._id)
            .populate('applications.student', 'name email skills location');

        // Return the newly added application
        const newApplication = populatedProject.applications[
            populatedProject.applications.length - 1
        ];

        res.status(201).json({
            success: true,
            data: newApplication
        });
    } catch (error) {
        console.error('Apply to project error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get my applications
// @route   GET /api/projects/my-applications
// @access  Private (Students only)
const getMyApplications = async (req, res) => {
    try {
        console.log('getMyApplications called for user:', {
            userId: req.user.id,
            role: req.user.role
        });

        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                error: 'Access denied'
            });
        }

        // Use the Application model directly instead of embedded applications
        const applications = await Application.find({ student: req.user.id })
            .populate({
                path: 'project',
                select: 'title budget deadline status description',
                populate: {
                    path: 'user',
                    select: 'name email'
                }
            });

        console.log('Found applications for student:', {
            userId: req.user.id,
            count: applications.length,
            applications: applications.map(a => ({
                id: a._id,
                projectId: a.project?._id,
                projectTitle: a.project?.title,
                status: a.status,
                progress: a.progress,
                createdAt: a.createdAt
            }))
        });

        // Format the response with all necessary fields
        const formattedApplications = applications.map(app => ({
            _id: app._id,
            project: {
                _id: app.project?._id,
                title: app.project?.title,
                budget: app.project?.budget,
                deadline: app.project?.deadline,
                status: app.project?.status,
                description: app.project?.description,
                client: app.project?.user
            },
            status: app.status || 'pending',
            proposedBudget: app.proposedBudget,
            timeline: app.timeline,
            coverLetter: app.coverLetter,
            progress: app.progress || 0,
            questions: app.questions,
            appliedAt: app.createdAt,
            updatedAt: app.updatedAt
        }));

        console.log('Sending formatted applications:', {
            count: formattedApplications.length,
            statuses: formattedApplications.map(a => a.status)
        });

        res.json({
            success: true,
            data: formattedApplications
        });
    } catch (error) {
        console.error('Get my applications error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

const calculateFees = async (req, res) => {
    try {
        if (req.user.role !== 'client') {
            return res.status(403).json({
                success: false,
                error: 'Only clients can calculate project fees'
            });
        }

        const { budget, isFeatured, isUrgent } = req.body;

        if (!budget) {
            return res.status(400).json({
                success: false,
                error: 'Please provide project budget'
            });
        }

        const fees = calculateProjectFees({
            budget: Number(budget),
            isFeatured: isFeatured || false,
            isUrgent: isUrgent || false
        });

        res.json({
            success: true,
            data: fees
        });
    } catch (error) {
        console.error('Calculate fees error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get client's projects with applications
// @route   GET /api/projects/my-projects-with-applications
// @access  Private (Client only)
const getMyProjectsWithApplications = async (req, res) => {
    try {
        if (req.user.role !== 'client') {
            return res.status(403).json({
                success: false,
                error: 'Only clients can view their projects'
            });
        }

        // Get all projects first
        const projects = await Project.find({ user: req.user.id })
            .sort('-createdAt');

    // Get all applications for these projects
        const projectIds = projects.map(p => p._id);
        const applications = await Application.find({ project: { $in: projectIds } })
            .populate('student', 'name email skills location rating completedProjects portfolio');

        // Map applications to their respective projects
        const projectsWithApplications = projects.map(project => {
            const projectApps = applications.filter(app => app.project.toString() === project._id.toString());
            return {
                ...project.toObject(),
                applications: projectApps
            };
        });

        res.json({
            success: true,
            data: projectsWithApplications
        });
    } catch (error) {
        console.error('Get my projects with applications error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Update application status
// @route   PUT /api/projects/applications/:id/status
// @access  Private (Client only)
const updateApplicationStatus = async (req, res) => {
    try {
        if (req.user.role !== 'client') {
            return res.status(403).json({
                success: false,
                error: 'Only clients can update application status'
            });
        }

        const { status } = req.body;
        if (!status || !['pending', 'accepted', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }

        const applicationId = req.params.id || req.params.applicationId;

        // Find the project containing this application
        const project = await Project.findOne({
            'applications._id': applicationId,
            user: req.user.id
        });

        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Application not found or unauthorized'
            });
        }

        // Update the application status
        project.applications.id(applicationId).status = status;
        await project.save();

        res.json({
            success: true,
            data: project.applications.id(applicationId)
        });
    } catch (error) {
        console.error('Update application status error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Client only)
const updateProject = async (req, res) => {
    try {
        if (req.user.role !== 'client') {
            return res.status(403).json({
                success: false,
                error: 'Only clients can update projects'
            });
        }

        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found'
            });
        }

        // Check if user is the project owner
        if (project.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to update this project'
            });
        }

        const { 
            title, 
            description, 
            category, 
            budget,
            budgetType,
            deadline,
            skillsRequired,
            projectType,
            experienceLevel,
            isFeatured,
            isUrgent
        } = req.body;

        // Validate required fields
        if (!title || !description || !category || !budget || !budgetType || !deadline || !skillsRequired) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required fields'
            });
        }

        // Validate budget type
        if (!['fixed', 'hourly'].includes(budgetType)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid budget type'
            });
        }

        // Validate project type
        if (projectType && !['short-term', 'medium-term', 'long-term'].includes(projectType)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid project type'
            });
        }

        // Validate experience level
        if (experienceLevel && !['beginner', 'intermediate', 'expert'].includes(experienceLevel)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid experience level'
            });
        }

        // Update project fields
        project.title = title;
        project.description = description;
        project.category = category;
        project.budget = Number(budget);
        project.budgetType = budgetType;
        project.deadline = new Date(deadline);
        project.skillsRequired = Array.isArray(skillsRequired) ? skillsRequired : [skillsRequired];
        project.projectType = projectType || 'short-term';
        project.experienceLevel = experienceLevel || 'beginner';
        project.isFeatured = isFeatured || false;
        project.isUrgent = isUrgent || false;

        await project.save();

        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

module.exports = {
    getProjects,
    createProject,
    getProjectById,
    getMyProjects,
    getMyProjectsWithApplications,
    calculateFees,
    applyToProject,
    getMyApplications,
    updateApplicationStatus,
    updateProjectProgress
    updateProject
};