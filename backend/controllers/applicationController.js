const Application = require('../models/Application');
const Project = require('../models/projectModel');

// @desc    Submit application for a project
// @route   POST /api/applications/project/:projectId
// @access  Private (Students only)
exports.submitApplication = async (req, res) => {
    try {
        // Log incoming request for debugging
        console.log('Submit application request:', {
            user: req.user,
            params: req.params,
            body: req.body
        });

        // Check if user is a student
        if (!req.user || req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                error: 'Only students can submit applications'
            });
        }

        const { projectId } = req.params;
        const { coverLetter, proposedBudget, timeline, questions } = req.body;

        // Validate required fields
        if (!coverLetter || proposedBudget === undefined || !timeline) {
            return res.status(400).json({
                success: false,
                error: 'Please provide all required fields'
            });
        }

        // Validate budget is a positive number
        if (typeof proposedBudget !== 'number' || proposedBudget <= 0) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid budget amount'
            });
        }

        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found'
            });
        }

        // Check if project is still open
        if (project.status !== 'open') {
            return res.status(400).json({
                success: false,
                error: 'This project is no longer accepting applications'
            });
        }

        // Check if student has already applied
        const existingApplication = await Application.findOne({
            project: projectId,
            student: req.user.id
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                error: 'You have already applied to this project'
            });
        }

        try {
            // Create application
            const application = await Application.create({
                project: projectId,
                student: req.user.id,
                coverLetter,
                proposedBudget,
                timeline,
                questions: questions || '',
                status: 'pending' // Set initial status
            });

            // Increment project applications count
            await Project.findByIdAndUpdate(projectId, {
                $inc: { applicationsCount: 1 }
            });

            // Populate the application with project and student details
            const populatedApplication = await Application.findById(application._id)
                .populate('project', 'title budget status')
                .populate('student', 'name email');

            console.log('Application created successfully:', populatedApplication);

            res.status(201).json({
                success: true,
                data: populatedApplication
            });
        } catch (dbError) {
            console.error('Database error:', dbError);
            throw new Error('Failed to create application in database');
        }
    } catch (error) {
        console.error('Submit application error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get all applications for client's projects
// @route   GET /api/applications/my-projects-applications
// @access  Private (Clients only)
exports.getApplicationsForMyProjects = async (req, res) => {
    try {
        // Check if user is a client
        if (!req.user || req.user.role !== 'client') {
            return res.status(403).json({
                success: false,
                error: 'Only clients can access this endpoint'
            });
        }

        // Find all projects owned by the client
        const projects = await Project.find({ user: req.user.id });
        const projectIds = projects.map(project => project._id);

        // Find all applications for these projects
        const applications = await Application.find({
            project: { $in: projectIds }
        })
        .populate('student', 'name email')
        .populate('project', 'title budget status')
        .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: applications
        });
    } catch (error) {
        console.error('Get applications for my projects error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get applications for a project
// @route   GET /api/projects/:projectId/applications
// @access  Private (Project owner only)
exports.getProjectApplications = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Check if project exists and user is owner
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found'
            });
        }

        // Only project owner can view applications
        if (project.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to view these applications'
            });
        }

        const applications = await Application.find({ project: projectId })
            .populate('student', 'name email')
            .sort('-createdAt');

        res.json({
            success: true,
            data: applications
        });
    } catch (error) {
        console.error('Get project applications error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Get my applications (as a student)
// @route   GET /api/applications/me
// @access  Private (Students only)
exports.getMyApplications = async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({
                success: false,
                error: 'Only students can view their applications'
            });
        }

        const applications = await Application.find({ student: req.user.id })
            .populate({
                path: 'project',
                select: 'title description budget status',
                populate: {
                    path: 'user',
                    select: 'name'
                }
            })
            .sort('-createdAt');

        res.json({
            success: true,
            data: applications
        });
    } catch (error) {
        console.error('Get my applications error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Delete an application
// @route   DELETE /api/applications/:applicationId  OR /api/applications/:id
// @access  Private (Application owner only)
exports.deleteApplication = async (req, res) => {
    try {
        const applicationId = req.params.applicationId || req.params.id;

        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({
                success: false,
                error: 'Application not found'
            });
        }

        // Check if user is the application owner
        if (application.student.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this application'
            });
        }

        // Decrement project applications count
        await Project.findByIdAndUpdate(application.project, {
            $inc: { applicationsCount: -1 }
        });

        await application.remove();

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Delete application error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};

// @desc    Update application status (accept/reject)
// @route   PUT /api/applications/:applicationId  OR /api/applications/:id
// @access  Private (Project owner only)
exports.updateApplicationStatus = async (req, res) => {
    try {
        const applicationId = req.params.applicationId || req.params.id;
        const { status } = req.body;

        if (!['accepted', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }

        // Find application and populate project
        const application = await Application.findById(applicationId)
            .populate('project');

        if (!application) {
            return res.status(404).json({
                success: false,
                error: 'Application not found'
            });
        }

        // Check if project exists and user is owner
        if (!application.project) {
            return res.status(404).json({
                success: false,
                error: 'Project not found'
            });
        }

        if (application.project.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to update application status'
            });
        }

        // If accepting application, check if project is still open
        if (status === 'accepted' && application.project.status !== 'open') {
            return res.status(400).json({
                success: false,
                error: 'Project is no longer open'
            });
        }

        // If accepting, update project status to in-progress and application to in_progress
        if (status === 'accepted') {
            application.project.status = 'in-progress';
            await application.project.save();

            // Reject all other applications for this project
            await Application.updateMany(
                {
                    project: application.project._id,
                    _id: { $ne: applicationId },
                    status: 'pending'
                },
                { status: 'rejected' }
            );
            
            // Set the accepted application to in_progress
            application.status = 'in_progress';
        } else {
            application.status = status;
        }
        
        await application.save();

        res.json({
            success: true,
            data: application
        });
    } catch (error) {
        console.error('Update application status error:', error);
        res.status(500).json({
            success: false,
            error: 'Server error'
        });
    }
};