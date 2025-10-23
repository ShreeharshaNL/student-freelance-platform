// backend/controllers/ProfileController.js
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfileModel");
const ClientProfile = require("../models/ClientProfileModel");

/* ---------- allowlists ---------- */
const CLIENT_ALLOWED = new Set([
  "companyName",
  "industryType",
  "location",
  "joinDate",
  "website",        // matches model + frontend
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
]);

const STUDENT_ALLOWED = new Set([
  "title",
  "bio",
  "location",
  "responseTime",
  "website",
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

    // 4) Return fresh profile
    const fresh = await Model.findOne({ user: user._id });
    return res.json({ success: true, role: user.role, data: fresh });
  } catch (err) {
    // High-signal logging so you can see real cause
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
