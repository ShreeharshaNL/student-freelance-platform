const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const ClientProfile = require("../models/ClientProfile");
const Project = require("../models/Project");
const Application = require("../models/Application");
const Review = require("../models/Review");

/* ---------- allowlists ---------- */
const USER_ALLOWED = new Set(["name", "phone"]);

const CLIENT_ALLOWED = new Set([
  "companyName",
  "industryType",
  "location",
  "website",
  "companySize",
  "profileImage",
  "responseTime",
  "description",
]);

const STUDENT_ALLOWED = new Set([
  "title",
  "bio",
  "location",
  "responseTime",
  "website",
]);

const getMonthYear = (dateValue) => {
  if (!dateValue) return "";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
};

const buildMergedUserData = (user, profile, isOwner) => {
  const profileData = profile ? profile.toObject() : {};

  const merged = {
    ...profileData,
    userId: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
  };

  if (!isOwner) {
    delete merged.phone;
    delete merged.totalEarnings;
    delete merged.monthlyEarnings;

    if (merged.joinDate) {
      merged.joinDate = getMonthYear(merged.joinDate) || getMonthYear(user.createdAt);
    } else {
      merged.joinDate = getMonthYear(user.createdAt);
    }

    delete merged.createdAt;
  }

  return merged;
};

exports.getDashboard = async (req, res) => {
  try {
    const user = req.user; // Comes from authMiddleware

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Find user by email (protected)
exports.findUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ success: false, error: "Email is required" });
    }

    const user = await User.findOne({ email }).select("_id name email role");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({ success: true, data: { user } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  return exports.getUserProfile(req, res);
};

/* =========================================================
 * GET /api/profile or /api/users/:userId → merged user + profile
 * =======================================================*/
exports.getUserProfile = async (req, res) => {
  try {
    const requestedUserId = req.params.userId || req.user.id;
    const isOwner = requestedUserId.toString() === req.user.id.toString();

    const user = await User.findById(requestedUserId).select("-password");
    if (!user) return res.status(404).json({ success: false, error: "User not found" });

    let profile;
    if (user.role === "student") {
      profile = await StudentProfile.findOne({ user: user._id });
      if (!profile && isOwner) profile = await StudentProfile.create({ user: user._id });

      if (profile && isOwner) {
        try {
          const allProjects = await Project.find({
            "applications.student": user._id,
          }).lean();

          const applications = [];

          allProjects.forEach((project) => {
            const studentApp = project.applications.find(
              (app) => app.student.toString() === user._id.toString()
            );

            if (studentApp) {
              applications.push({
                _id: studentApp._id,
                project: {
                  _id: project._id,
                  title: project.title,
                  category: project.category,
                  status: project.status,
                  budget: project.budget,
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
                updatedAt: project.updatedAt,
              });
            }
          });

          const completedApplications = applications.filter(
            (app) => app.project.status === "completed" && app.status === "accepted"
          );

          const acceptedApplications = applications.filter(
            (app) => app.status === "accepted"
          );

          const totalEarnings = acceptedApplications.reduce(
            (sum, app) => sum + (app.proposedBudget || 0),
            0
          );

          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          const monthlyEarnings = acceptedApplications
            .filter((app) => {
              const appDate = new Date(app.appliedAt || app.createdAt || app.updatedAt);
              return appDate >= thirtyDaysAgo;
            })
            .reduce((sum, app) => sum + (app.proposedBudget || 0), 0);

          let avgRating = 0;
          let totalReviews = 0;
          try {
            const reviews = await Review.find({ reviewee: user._id });
            totalReviews = reviews.length;
            if (totalReviews > 0) {
              avgRating =
                reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                totalReviews;
            }
          } catch (reviewError) {
            console.log("⚠️ Review calculation skipped");
          }

          profile.completedProjects = completedApplications.length;
          profile.totalEarnings = totalEarnings;
          profile.monthlyEarnings = monthlyEarnings;
          profile.rating = parseFloat(avgRating.toFixed(1)) || 0;
          profile.totalReviews = totalReviews;

          await profile.save();
        } catch (statsError) {
          console.error("❌ Error calculating student stats:", statsError);
        }
      }
    } else if (user.role === "client") {
      profile = await ClientProfile.findOne({ user: user._id });
      if (!profile && isOwner) {
        profile = await ClientProfile.create({
          user: user._id,
          companyName: user.name || "New Company",
          joinDate: new Date().toLocaleString("en-US", { month: "long", year: "numeric" }),
        });
      }

      if (profile && isOwner) {
        if (!profile.companyName || !profile.companyName.trim()) {
          profile.companyName = user.name || "New Company";
          await profile.save();
        }

        try {
          const clientProjects = await Project.find({ user: user._id });
          const completedClientProjects = clientProjects.filter(
            (p) => p.status === "completed"
          );

          let totalSpent = 0;
          completedClientProjects.forEach((project) => {
            const acceptedApp = project.applications.find(
              (app) => app.status === "accepted"
            );
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
      }
    } else {
      return res.status(400).json({ success: false, error: "Unsupported role" });
    }

    if (!profile) return res.status(404).json({ success: false, error: "Profile not found" });

    const responseData = buildMergedUserData(user, profile, isOwner);

    return res.json({ success: true, data: responseData });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.getProfile = async (req, res) => {
  return exports.getUserProfile(req, res);
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

    const profileUpdate = {};
    const userUpdate = {};

    for (const k of Object.keys(req.body || {})) {
      if (allowed.has(k) && req.body[k] !== undefined) profileUpdate[k] = req.body[k];
      if (USER_ALLOWED.has(k) && req.body[k] !== undefined) userUpdate[k] = req.body[k];
    }

    if (Object.keys(profileUpdate).length === 0 && Object.keys(userUpdate).length === 0) {
      return res.status(400).json({ success: false, error: "No valid fields to update." });
    }

    if (userUpdate.name && typeof userUpdate.name === "string") {
      userUpdate.name = userUpdate.name.trim();
    }

    if (userUpdate.phone && typeof userUpdate.phone === "string") {
      userUpdate.phone = userUpdate.phone.trim();
    }

    Object.assign(profile, profileUpdate);

    if (user.role === "client" && (!profile.companyName || !profile.companyName.trim())) {
      profile.companyName = user.name || "New Company";
    }

    if (Object.keys(userUpdate).length > 0) {
      Object.assign(user, userUpdate);
      await user.save();
    }

    await profile.save();

    const fresh = await Model.findOne({ user: user._id });
    const freshUser = await User.findById(user._id).select("-password");

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

    const responseData = buildMergedUserData(freshUser, fresh, true);
    return res.json({ success: true, data: responseData });
  } catch (err) {
    console.error("Update profile error:", err);
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

/* ======= Student-only endpoints ======= */
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

    const merged = buildMergedUserData(user, profile, true);
    return res.json({ success: true, data: merged });
  } catch (err) {
    console.error("Add skill error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.updateSkill = async (req, res) => {
  try {
    const { skillId } = req.params;
    const { name, level } = req.body;

    const user = await User.findById(req.user.id);
    if (user.role !== "student")
      return res.status(403).json({ success: false, error: "Only students can update skills" });

    const profile = await StudentProfile.findOne({ user: user._id });
    if (!profile) return res.status(404).json({ success: false, error: "Profile not found" });

    const skill = profile.skills.id(skillId);
    if (!skill) return res.status(404).json({ success: false, error: "Skill not found" });

    if (name !== undefined) {
      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, error: "Skill name is required" });
      }
      skill.name = name.trim();
    }

    if (level !== undefined) {
      skill.level = Number(level) || 0;
    }

    await profile.save();

    const merged = buildMergedUserData(user, profile, true);
    return res.json({ success: true, data: merged });
  } catch (err) {
    console.error("Update skill error:", err);
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

    const merged = buildMergedUserData(user, profile, true);
    return res.json({ success: true, data: merged });
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

    const merged = buildMergedUserData(user, profile, true);
    return res.json({ success: true, data: merged });
  } catch (err) {
    console.error("Add portfolio error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

exports.updatePortfolioProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, image, technologies, link } = req.body;

    const user = await User.findById(req.user.id);
    if (user.role !== "student")
      return res.status(403).json({ success: false, error: "Only students can update portfolio projects" });

    const profile = await StudentProfile.findOne({ user: user._id });
    if (!profile) return res.status(404).json({ success: false, error: "Profile not found" });

    const portfolioItem = profile.portfolio.id(projectId);
    if (!portfolioItem)
      return res.status(404).json({ success: false, error: "Portfolio project not found" });

    if (title !== undefined) {
      if (!title || !title.trim()) {
        return res.status(400).json({ success: false, error: "Title is required" });
      }
      portfolioItem.title = title.trim();
    }

    if (description !== undefined) {
      if (!description || !description.trim()) {
        return res.status(400).json({ success: false, error: "Description is required" });
      }
      portfolioItem.description = description.trim();
    }

    if (image !== undefined) portfolioItem.image = image || "💼";
    if (technologies !== undefined) portfolioItem.technologies = technologies || [];
    if (link !== undefined) portfolioItem.link = link || "#";

    await profile.save();

    const merged = buildMergedUserData(user, profile, true);
    return res.json({ success: true, data: merged });
  } catch (err) {
    console.error("Update portfolio error:", err);
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

    const merged = buildMergedUserData(user, profile, true);
    return res.json({ success: true, data: merged });
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

    const merged = buildMergedUserData(user, profile, true);
    return res.json({ success: true, data: merged });
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

    const merged = buildMergedUserData(user, profile, true);
    return res.json({ success: true, data: merged });
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

    const merged = buildMergedUserData(user, profile, true);
    return res.json({ success: true, data: merged });
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

    const merged = buildMergedUserData(user, profile, true);
    return res.json({ success: true, data: merged });
  } catch (err) {
    console.error("Delete certification error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};
