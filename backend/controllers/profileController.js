// backend/controllers/ProfileController.js
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfileModel");
const ClientProfile = require("../models/ClientProfileModel");
const Project = require("../models/projectModel"); // ✅ Update this path if needed
const Application = require("../models/Application"); // ✅ Add Application model
const Review = require("../models/Review"); // ✅ Add this import (if you have reviews)

/* ---------- allowlists ---------- */
const CLIENT_ALLOWED = new Set([
  "companyName",
  "industryType",
  "location",
  "joinDate",
  "website",
  "companySize",
  "profileImage",
  "rating",
  "totalReviews",
  "projectsPosted",
  "totalSpent",
  "hiredStudents",
  "responseTime",
  "description",
  "postedProjects",
  "hiredHistory",
  "reviews",
  "stats",
  "monthlySpent",
  "avgRatingGiven",
]);

const STUDENT_ALLOWED = new Set([
  "title",
  "bio",
  "location",
  "responseTime",
  "website",
  "totalEarnings",
  "monthlyEarnings",
  "rating",
  "completedProjects",
]);

/* =========================================================
 * GET /api/profile  → returns ONLY the role-specific profile
 * =======================================================*/
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    let profile;
    if (user.role === "student") {
      profile = await StudentProfile.findOne({ user: user._id });
      if (!profile) profile = await StudentProfile.create({ user: user._id });

      // ✅ CALCULATE STATS FOR STUDENT (matching dashboard logic)
      try {
        console.log('🔍 Calculating stats for student:', user._id);
        console.log('🔍 Student ID type:', typeof user._id, user._id.toString());
        
        // Find ALL projects that have this student in applications array
        const allProjects = await Project.find({
          'applications.student': user._id
        }).lean();

        console.log('📦 Total projects found:', allProjects.length);

        // If no projects found, let's check all projects
        if (allProjects.length === 0) {
          console.log('⚠️ No projects found! Checking all projects with applications...');
          const allProjectsWithApps = await Project.find({
            'applications.0': { $exists: true }
          }).lean();
          console.log('📊 Total projects with applications:', allProjectsWithApps.length);
          
          if (allProjectsWithApps.length > 0) {
            console.log('🔍 Sample project applications:', 
              allProjectsWithApps.slice(0, 2).map(p => ({
                projectId: p._id,
                projectTitle: p.title,
                applications: p.applications.map(a => ({
                  studentId: a.student,
                  studentIdType: typeof a.student,
                  status: a.status,
                  proposedBudget: a.proposedBudget
                }))
              }))
            );
          }
        }

        // Build applications array like the dashboard expects
        const applications = [];
        
        allProjects.forEach(project => {
          // Find this student's application
          const studentApp = project.applications.find(
            app => app.student.toString() === user._id.toString()
          );

          if (studentApp) {
            // Create application object matching dashboard format
            const application = {
              _id: studentApp._id,
              project: {
                _id: project._id,
                title: project.title,
                category: project.category,
                status: project.status,
                budget: project.budget
              },
              student: studentApp.student,
              status: studentApp.status,
              proposedBudget: studentApp.proposedBudget,
              timeline: studentApp.timeline,
              coverLetter: studentApp.coverLetter,
              progress: studentApp.progress,
              completionDate: studentApp.completionDate,
              appliedAt: studentApp.createdAt || project.createdAt,
              createdAt: studentApp.createdAt || project.createdAt,
              updatedAt: project.updatedAt
            };
            applications.push(application);

            console.log('📋 Application:', {
              projectTitle: project.title,
              projectStatus: project.status,
              appStatus: studentApp.status,
              proposedBudget: studentApp.proposedBudget
            });
          }
        });

        console.log('📊 Total applications:', applications.length);

        // Calculate stats - check project status (not application status)
        // Count based on project.status, not app.status
        const completedApplications = applications.filter(app => 
          app.project.status === 'completed' && app.status === 'accepted'
        );
        
        const inProgressApplications = applications.filter(app => 
          app.project.status === 'in-progress' && app.status === 'accepted'
        );

        const underReviewApplications = applications.filter(app => 
          app.project.status === 'under-review' && app.status === 'accepted'
        );

        const acceptedApplications = applications.filter(app => 
          app.status === 'accepted'
        );

        console.log('📈 Application breakdown:', {
          total: applications.length,
          acceptedApps: acceptedApplications.length,
          completed: completedApplications.length,
          inProgress: inProgressApplications.length,
          underReview: underReviewApplications.length,
          details: applications.map(a => ({
            project: a.project.title,
            projectStatus: a.project.status,
            appStatus: a.status,
            budget: a.proposedBudget
          }))
        });

        // Calculate total earnings from ALL accepted applications 
        // (regardless of project status, since student gets paid when accepted)
        const totalEarnings = acceptedApplications
          .reduce((sum, app) => sum + (app.proposedBudget || 0), 0);

        // Calculate monthly earnings (last 30 days) from accepted applications
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const monthlyEarnings = acceptedApplications
          .filter(app => {
            const appDate = new Date(app.appliedAt || app.createdAt || app.updatedAt);
            return appDate >= thirtyDaysAgo;
          })
          .reduce((sum, app) => sum + (app.proposedBudget || 0), 0);

        // Completed projects count is based on project status being 'completed'
        const completedCount = completedApplications.length;

        console.log('💵 Calculated stats:', {
          completedCount,
          totalEarnings,
          monthlyEarnings,
          inProgressCount: inProgressApplications.length,
          pendingCount: applications.filter(a => a.status === 'pending').length
        });

        // Get reviews for this student (if Review model exists)
        let avgRating = 0;
        let totalReviews = 0;
        try {
          const reviews = await Review.find({ reviewee: user._id });
          totalReviews = reviews.length;
          if (totalReviews > 0) {
            avgRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews;
          }
          console.log('⭐ Reviews:', totalReviews, 'Avg rating:', avgRating);
        } catch (reviewError) {
          console.log("⚠️ Review calculation skipped");
        }

        // Update profile with calculated stats
        profile.completedProjects = completedCount;
        profile.totalEarnings = totalEarnings;
        profile.monthlyEarnings = monthlyEarnings;
        profile.rating = parseFloat(avgRating.toFixed(1)) || 0;
        profile.totalReviews = totalReviews;

        console.log('✅ Saving profile with stats:', {
          completedProjects: profile.completedProjects,
          totalEarnings: profile.totalEarnings,
          monthlyEarnings: profile.monthlyEarnings,
          rating: profile.rating,
          totalReviews: profile.totalReviews
        });

        await profile.save();
      } catch (statsError) {
        console.error("❌ Error calculating student stats:", statsError);
        console.error("Stack trace:", statsError.stack);
        // Continue without stats update
      }

    } else if (user.role === "client") {
      profile = await ClientProfile.findOne({ user: user._id });
      if (!profile) {
        profile = await ClientProfile.create({
          user: user._id,
          companyName: user.name || "New Company",
          joinDate: new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
        });
      }
      // ✅ ensure legacy docs have a usable companyName
      if (!profile.companyName || !profile.companyName.trim()) {
        profile.companyName = user.name || "New Company";
        await profile.save();
      }

      // ✅ CALCULATE STATS FOR CLIENT (optional)
      try {
        const clientProjects = await Project.find({ user: user._id });
        const completedClientProjects = clientProjects.filter(p => p.status === 'completed');
        
        let totalSpent = 0;
        completedClientProjects.forEach(project => {
          const acceptedApp = project.applications.find(app => app.status === 'accepted');
          if (acceptedApp) {
            totalSpent += acceptedApp.proposedBudget || 0;
          }
        });

        profile.projectsPosted = clientProjects.length;
        profile.totalSpent = totalSpent;

        await profile.save();
      } catch (statsError) {
        console.error("Error calculating client stats:", statsError);
      }

    } else {
      return res.status(400).json({ success: false, error: "Unsupported role" });
    }

    // Combine user and profile data for a complete response
    const responseData = {
      ...profile.toObject(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt
    };

    return res.json({ success: true, role: user.role, data: responseData });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

/* =========================================================
 * PUT /api/profile  → update role-specific fields; return profile
 * =======================================================*/
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    let Model, allowed;
    if (user.role === "student") {
      Model = StudentProfile;
      allowed = STUDENT_ALLOWED;
    } else if (user.role === "client") {
      Model = ClientProfile;
      allowed = CLIENT_ALLOWED;
    } else {
      return res.status(400).json({ success: false, error: "Unsupported role" });
    }

    // 1) Ensure a profile exists
    let profile = await Model.findOne({ user: user._id });
    if (!profile) {
      if (user.role === "client") {
        profile = await Model.create({
          user: user._id,
          companyName: user.name || "New Company",
          joinDate: new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
        });
      } else {
        profile = await Model.create({ user: user._id });
      }
    }

    // 2) Build update from whitelist (ignore undefined)
    const update = {};
    for (const k of Object.keys(req.body || {})) {
      if (allowed.has(k) && req.body[k] !== undefined) update[k] = req.body[k];
    }
    if (Object.keys(update).length === 0) {
      return res.status(400).json({ success: false, error: "No valid fields to update." });
    }

    // 3) Apply updates
    Object.assign(profile, update);

    // ✅ extra safety: ensure companyName is never empty on client
    if (user.role === "client" && (!profile.companyName || !profile.companyName.trim())) {
      profile.companyName = user.name || "New Company";
    }

    await profile.save();

    // 4) Return fresh profile with calculated stats
    const fresh = await Model.findOne({ user: user._id });

    // Recalculate stats after update for students
    if (user.role === "student") {
      try {
        const applications = await Application.find({ student: user._id }).lean();
        
        const completedCount = applications.filter(a => a.status === 'completed').length;
        const totalEarnings = applications
          .filter(a => a.status === 'completed' || a.status === 'accepted')
          .reduce((sum, a) => sum + (a.proposedBudget || 0), 0);

        fresh.completedProjects = completedCount;
        fresh.totalEarnings = totalEarnings;
        await fresh.save();
      } catch (statsError) {
        console.error("Error recalculating stats:", statsError);
      }
    }

    return res.json({ success: true, role: user.role, data: fresh });
  } catch (err) {
    console.error("Update profile error:");
    console.error("  name   :", err?.name);
    console.error("  code   :", err?.code);
    console.error("  message:", err?.message);
    console.error("  errors :", err?.errors);
    console.error("  body   :", req.body);

    return res.status(500).json({
      success: false,
      error: "Server error",
      details: {
        name: err?.name,
        code: err?.code,
        message: err?.message,
        errors: err?.errors,
      },
    });
  }
};

/* ======= Student-only endpoints (unchanged) ======= */
exports.addSkill = async (req, res) => {
  try {
    const { name, level } = req.body;
    if (!name) return res.status(400).json({ success: false, error: "Skill name is required" });

    const user = await User.findById(req.user.id);
    if (user.role !== "student")
      return res.status(403).json({ success: false, error: "Only students can add skills" });

    let profile = await StudentProfile.findOne({ user: user._id });
    if (!profile) profile = await StudentProfile.create({ user: user._id });

    const exists = profile.skills.find((s) => s.name.toLowerCase() === name.toLowerCase());
    if (exists) return res.status(400).json({ success: false, error: "Skill already exists" });

    profile.skills.push({ name, level: level || 0, projects: 0 });
    await profile.save();

    return res.json({ success: true, data: { skills: profile.skills } });
  } catch (err) {
    console.error("Add skill error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    const user = await User.findById(req.user.id);
    if (user.role !== "student")
      return res.status(403).json({ success: false, error: "Only students can delete skills" });

    const profile = await StudentProfile.findOne({ user: user._id });
    if (!profile) return res.status(404).json({ success: false, error: "Profile not found" });

    profile.skills = profile.skills.filter((s) => s._id.toString() !== skillId);
    await profile.save();

    return res.json({ success: true, data: { skills: profile.skills } });
  } catch (err) {
    console.error("Delete skill error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.addPortfolioProject = async (req, res) => {
  try {
    const { title, description, image, technologies, link } = req.body;
    if (!title || !description)
      return res.status(400).json({ success: false, error: "Title and description are required" });

    const user = await User.findById(req.user.id);
    if (user.role !== "student")
      return res.status(403).json({ success: false, error: "Only students can add portfolio projects" });

    let profile = await StudentProfile.findOne({ user: user._id });
    if (!profile) profile = await StudentProfile.create({ user: user._id });

    profile.portfolio.push({
      title,
      description,
      image: image || "💼",
      technologies: technologies || [],
      link: link || "#",
    });
    await profile.save();

    return res.json({ success: true, data: { portfolio: profile.portfolio } });
  } catch (err) {
    console.error("Add portfolio error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.deletePortfolioProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const user = await User.findById(req.user.id);
    if (user.role !== "student")
      return res.status(403).json({ success: false, error: "Only students can delete portfolio projects" });

    const profile = await StudentProfile.findOne({ user: user._id });
    if (!profile) return res.status(404).json({ success: false, error: "Profile not found" });

    profile.portfolio = profile.portfolio.filter((p) => p._id.toString() !== projectId);
    await profile.save();

    return res.json({ success: true, data: { portfolio: profile.portfolio } });
  } catch (err) {
    console.error("Delete portfolio error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.addEducation = async (req, res) => {
  try {
    const { degree, school, year, status } = req.body;
    if (!degree || !school)
      return res.status(400).json({ success: false, error: "Degree and school are required" });

    const user = await User.findById(req.user.id);
    if (user.role !== "student")
      return res.status(403).json({ success: false, error: "Only students can add education" });

    let profile = await StudentProfile.findOne({ user: user._id });
    if (!profile) profile = await StudentProfile.create({ user: user._id });

    profile.education.push({ degree, school, year, status });
    await profile.save();

    return res.json({ success: true, data: { education: profile.education } });
  } catch (err) {
    console.error("Add education error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.deleteEducation = async (req, res) => {
  try {
    const { eduId } = req.params;
    const user = await User.findById(req.user.id);
    if (user.role !== "student")
      return res.status(403).json({ success: false, error: "Only students can delete education" });

    const profile = await StudentProfile.findOne({ user: user._id });
    if (!profile) return res.status(404).json({ success: false, error: "Profile not found" });

    profile.education = profile.education.filter((e) => e._id.toString() !== eduId);
    await profile.save();

    return res.json({ success: true, data: { education: profile.education } });
  } catch (err) {
    console.error("Delete education error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.addCertification = async (req, res) => {
  try {
    const { name, issuer, year } = req.body;
    if (!name || !issuer)
      return res.status(400).json({ success: false, error: "Name and issuer are required" });

    const user = await User.findById(req.user.id);
    if (user.role !== "student")
      return res.status(403).json({ success: false, error: "Only students can add certifications" });

    let profile = await StudentProfile.findOne({ user: user._id });
    if (!profile) profile = await StudentProfile.create({ user: user._id });

    profile.certifications.push({ name, issuer, year });
    await profile.save();

    return res.json({ success: true, data: { certifications: profile.certifications } });
  } catch (err) {
    console.error("Add certification error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.deleteCertification = async (req, res) => {
  try {
    const { certId } = req.params;
    const user = await User.findById(req.user.id);
    if (user.role !== "student")
      return res.status(403).json({ success: false, error: "Only students can delete certifications" });

    const profile = await StudentProfile.findOne({ user: user._id });
    if (!profile) return res.status(404).json({ success: false, error: "Profile not found" });

    profile.certifications = profile.certifications.filter((c) => c._id.toString() !== certId);
    await profile.save();

    return res.json({ success: true, data: { certifications: profile.certifications } });
  } catch (err) {
    console.error("Delete certification error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};