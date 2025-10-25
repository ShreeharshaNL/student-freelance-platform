const Submission = require("../models/Submission");
const Project = require("../models/projectModel");
const Application = require("../models/Application");

exports.createSubmission = async (req, res) => {
  try {
    const { projectId, title, description, fileUrl, githubUrl, liveUrl } = req.body;
    const studentId = req.user._id;

    if (!projectId || !title || !description) {
      return res.status(400).json({
        success: false,
        error: "Project ID, title, and description are required",
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        error: "Project not found",
      });
    }

    const application = await Application.findOne({
      project: projectId,
      student: studentId,
    });

    if (!application) {
      return res.status(403).json({
        success: false,
        error: "You have not applied to this project",
      });
    }

    if (application.status !== "accepted" && 
        application.status !== "in_progress" && 
        application.status !== "changes_requested" &&
        application.status !== "rejected") {
      return res.status(403).json({
        success: false,
        error: "Cannot submit work in current application status: " + application.status,
      });
    }

    const latestSubmission = await Submission.findOne({ project: projectId })
      .sort({ version: -1 })
      .limit(1);

    const version = latestSubmission ? latestSubmission.version + 1 : 1;

    console.log('Creating submission:', {
      projectId,
      studentId,
      currentAppStatus: application.status,
      isResubmission: version > 1
    });

    const submission = await Submission.create({
      project: projectId,
      student: studentId,
      client: project.user,
      version,
      title,
      description,
      fileUrl: fileUrl || "",
      githubUrl: githubUrl || "",
      liveUrl: liveUrl || "",
      status: "under_review",
    });

    await submission.populate([
      { path: "student", select: "name email" },
      { path: "project", select: "title budget" },
    ]);

    console.log('Updating project status to under_review:', projectId);
    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { status: "under_review" },
      { new: true }
    );
    console.log('Project updated:', { _id: updatedProject._id, status: updatedProject.status });

    // Update application status to under_review
    console.log('Updating application status to under_review:', { projectId, studentId });
    const updatedApp = await Application.findOneAndUpdate(
      { project: projectId, student: studentId },
      { status: "under_review" },
      { new: true }
    );
    console.log('Application updated:', { 
      _id: updatedApp?._id, 
      status: updatedApp?.status, 
      project: updatedApp?.project,
      student: updatedApp?.student 
    });

    res.status(201).json({
      success: true,
      data: submission,
      message: 'Submission created and application status updated to under_review',
      applicationStatus: updatedApp?.status
    });
  } catch (err) {
    console.error("Error creating submission:", err);
    res.status(500).json({
      success: false,
      error: err.message || "Failed to create submission",
    });
  }
};

exports.getProjectSubmissions = async (req, res) => {
  try {
    const { projectId } = req.params;

    const submissions = await Submission.find({ project: projectId })
      .sort({ version: -1 })
      .populate("student", "name email")
      .populate("client", "name email")
      .populate("feedback.createdBy", "name");

    res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (err) {
    console.error("Error fetching submissions:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch submissions",
    });
  }
};

exports.getMySubmissions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { role } = req.user;

    const query = role === "student" 
      ? { student: userId }
      : { client: userId };

    const submissions = await Submission.find(query)
      .sort({ createdAt: -1 })
      .populate("student", "name email")
      .populate("client", "name email")
      .populate("project", "title budget");

    res.status(200).json({
      success: true,
      data: submissions,
    });
  } catch (err) {
    console.error("Error fetching my submissions:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch submissions",
    });
  }
};

exports.reviewSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const { action, comment, requestedChanges } = req.body;
    const clientId = req.user._id;

    if (!action || !["approve", "request_changes", "reject"].includes(action)) {
      return res.status(400).json({
        success: false,
        error: "Valid action is required (approve, request_changes, reject)",
      });
    }

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: "Submission not found",
      });
    }

    if (submission.client.toString() !== clientId.toString()) {
      return res.status(403).json({
        success: false,
        error: "You can only review submissions for your projects",
      });
    }

    if (action === "approve") {
      submission.status = "approved";
      submission.approvedAt = new Date();
      submission.approvedBy = clientId;

      await Project.findByIdAndUpdate(submission.project, {
        status: "completed",
      });

      await Application.findOneAndUpdate(
        { project: submission.project, student: submission.student },
        { status: "completed" }
      );
    } else if (action === "request_changes") {
      submission.status = "changes_requested";
      submission.feedback = {
        comment: comment || "",
        requestedChanges: requestedChanges || [],
        createdAt: new Date(),
        createdBy: clientId,
      };

      const updatedProject = await Project.findByIdAndUpdate(
        submission.project,
        { status: "in_progress" },
        { new: true }
      );
      console.log('Project updated to in_progress:', { _id: updatedProject._id, status: updatedProject.status });

      // Update application to changes_requested status
      const updatedApp = await Application.findOneAndUpdate(
        { project: submission.project, student: submission.student },
        { status: "changes_requested" },
        { new: true }
      );
      console.log('Application updated to changes_requested:', { 
        _id: updatedApp?._id, 
        status: updatedApp?.status 
      });
    } else if (action === "reject") {
      submission.status = "rejected";
      submission.feedback = {
        comment: comment || "",
        createdAt: new Date(),
        createdBy: clientId,
      };

      const updatedProject = await Project.findByIdAndUpdate(
        submission.project,
        { status: "in_progress" },
        { new: true }
      );
      console.log('Project updated to in_progress:', { _id: updatedProject._id, status: updatedProject.status });

      // Update application to rejected status
      const updatedApp = await Application.findOneAndUpdate(
        { project: submission.project, student: submission.student },
        { status: "rejected" },
        { new: true }
      );
      console.log('Application updated to rejected:', { 
        _id: updatedApp?._id, 
        status: updatedApp?.status 
      });
    }

    await submission.save();

    await submission.populate([
      { path: "student", select: "name email" },
      { path: "client", select: "name email" },
      { path: "project", select: "title budget" },
    ]);

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (err) {
    console.error("Error reviewing submission:", err);
    res.status(500).json({
      success: false,
      error: "Failed to review submission",
    });
  }
};

exports.deleteSubmission = async (req, res) => {
  try {
    const { submissionId } = req.params;
    const userId = req.user._id;

    const submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: "Submission not found",
      });
    }

    if (submission.student.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: "You can only delete your own submissions",
      });
    }

    if (submission.status === "approved") {
      return res.status(400).json({
        success: false,
        error: "Cannot delete approved submissions",
      });
    }

    await submission.deleteOne();

    res.status(200).json({
      success: true,
      message: "Submission deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting submission:", err);
    res.status(500).json({
      success: false,
      error: "Failed to delete submission",
    });
  }
};

exports.getSubmissionById = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await Submission.findById(submissionId)
      .populate("student", "name email")
      .populate("client", "name email")
      .populate("project", "title budget description")
      .populate("feedback.createdBy", "name");

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: "Submission not found",
      });
    }

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (err) {
    console.error("Error fetching submission:", err);
    res.status(500).json({
      success: false,
      error: "Failed to fetch submission",
    });
  }
};
