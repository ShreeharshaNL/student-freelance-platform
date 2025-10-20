const User = require("../models/User");
const StudentProfile = require("../models/StudentProfileModel");
const ClientProfile = require("../models/ClientProfileModel");

// @desc    Get user profile (Student or Client)
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }

    let profile;
    if (user.role === "student") {
      profile = await StudentProfile.findOne({ user: user._id });
      
      // Create profile if doesn't exist
      if (!profile) {
        profile = await StudentProfile.create({ user: user._id });
      }
    } else if (user.role === "client") {
      profile = await ClientProfile.findOne({ user: user._id });
      
      // Create profile if doesn't exist
      if (!profile) {
        profile = await ClientProfile.create({ user: user._id });
      }
    }

    res.json({
      success: true,
      data: { 
        user: {
          ...user.toObject(),
          ...profile.toObject()
        }
      }
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error" 
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: "User not found" 
      });
    }

    // Update basic user info (name, phone)
    const { name, phone } = req.body;
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    await user.save();

    // Update role-specific profile
    let profile;
    if (user.role === "student") {
      const { title, bio, location, responseTime } = req.body;
      
      profile = await StudentProfile.findOne({ user: user._id });
      if (!profile) {
        profile = await StudentProfile.create({ user: user._id });
      }
      
      if (title !== undefined) profile.title = title;
      if (bio !== undefined) profile.bio = bio;
      if (location !== undefined) profile.location = location;
      if (responseTime !== undefined) profile.responseTime = responseTime;
      
      await profile.save();
    } else if (user.role === "client") {
      const { companyName, industryType, companySize, companyWebsite, location, description, responseTime } = req.body;
      
      profile = await ClientProfile.findOne({ user: user._id });
      if (!profile) {
        profile = await ClientProfile.create({ user: user._id });
      }
      
      if (companyName !== undefined) profile.companyName = companyName;
      if (industryType !== undefined) profile.industryType = industryType;
      if (companySize !== undefined) profile.companySize = companySize;
      if (companyWebsite !== undefined) profile.companyWebsite = companyWebsite;
      if (location !== undefined) profile.location = location;
      if (description !== undefined) profile.description = description;
      if (responseTime !== undefined) profile.responseTime = responseTime;
      
      await profile.save();
    }

    res.json({
      success: true,
      data: { 
        user: {
          ...user.toObject({ versionKey: false }),
          ...profile.toObject({ versionKey: false })
        }
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error" 
    });
  }
};

// ===== STUDENT-ONLY ENDPOINTS =====

// @desc    Add skill
// @route   POST /api/profile/skills
// @access  Private (Student only)
exports.addSkill = async (req, res) => {
  try {
    const { name, level } = req.body;

    if (!name) {
      return res.status(400).json({ 
        success: false, 
        error: "Skill name is required" 
      });
    }

    const user = await User.findById(req.user.id);
    if (user.role !== "student") {
      return res.status(403).json({ 
        success: false, 
        error: "Only students can add skills" 
      });
    }

    let profile = await StudentProfile.findOne({ user: user._id });
    if (!profile) {
      profile = await StudentProfile.create({ user: user._id });
    }

    // Check if skill already exists
    const existingSkill = profile.skills.find(s => s.name.toLowerCase() === name.toLowerCase());
    if (existingSkill) {
      return res.status(400).json({ 
        success: false, 
        error: "Skill already exists" 
      });
    }

    profile.skills.push({ 
      name, 
      level: level || 0,
      projects: 0 
    });
    
    await profile.save();

    res.json({
      success: true,
      data: { skills: profile.skills }
    });
  } catch (error) {
    console.error("Add skill error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error" 
    });
  }
};

// @desc    Delete skill
// @route   DELETE /api/profile/skills/:skillId
// @access  Private (Student only)
exports.deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.params;

    const user = await User.findById(req.user.id);
    if (user.role !== "student") {
      return res.status(403).json({ 
        success: false, 
        error: "Only students can delete skills" 
      });
    }

    const profile = await StudentProfile.findOne({ user: user._id });
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        error: "Profile not found" 
      });
    }

    profile.skills = profile.skills.filter(skill => skill._id.toString() !== skillId);
    await profile.save();

    res.json({
      success: true,
      data: { skills: profile.skills }
    });
  } catch (error) {
    console.error("Delete skill error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error" 
    });
  }
};

// @desc    Add portfolio project
// @route   POST /api/profile/portfolio
// @access  Private (Student only)
exports.addPortfolioProject = async (req, res) => {
  try {
    const { title, description, image, technologies, link } = req.body;

    if (!title || !description) {
      return res.status(400).json({ 
        success: false, 
        error: "Title and description are required" 
      });
    }

    const user = await User.findById(req.user.id);
    if (user.role !== "student") {
      return res.status(403).json({ 
        success: false, 
        error: "Only students can add portfolio projects" 
      });
    }

    let profile = await StudentProfile.findOne({ user: user._id });
    if (!profile) {
      profile = await StudentProfile.create({ user: user._id });
    }

    profile.portfolio.push({ 
      title, 
      description, 
      image: image || "💼",
      technologies: technologies || [],
      link: link || "#"
    });
    
    await profile.save();

    res.json({
      success: true,
      data: { portfolio: profile.portfolio }
    });
  } catch (error) {
    console.error("Add portfolio error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error" 
    });
  }
};

// @desc    Delete portfolio project
// @route   DELETE /api/profile/portfolio/:projectId
// @access  Private (Student only)
exports.deletePortfolioProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const user = await User.findById(req.user.id);
    if (user.role !== "student") {
      return res.status(403).json({ 
        success: false, 
        error: "Only students can delete portfolio projects" 
      });
    }

    const profile = await StudentProfile.findOne({ user: user._id });
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        error: "Profile not found" 
      });
    }

    profile.portfolio = profile.portfolio.filter(project => project._id.toString() !== projectId);
    await profile.save();

    res.json({
      success: true,
      data: { portfolio: profile.portfolio }
    });
  } catch (error) {
    console.error("Delete portfolio error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error" 
    });
  }
};

// @desc    Add education
// @route   POST /api/profile/education
// @access  Private (Student only)
exports.addEducation = async (req, res) => {
  try {
    const { degree, school, year, status } = req.body;

    if (!degree || !school) {
      return res.status(400).json({ 
        success: false, 
        error: "Degree and school are required" 
      });
    }

    const user = await User.findById(req.user.id);
    if (user.role !== "student") {
      return res.status(403).json({ 
        success: false, 
        error: "Only students can add education" 
      });
    }

    let profile = await StudentProfile.findOne({ user: user._id });
    if (!profile) {
      profile = await StudentProfile.create({ user: user._id });
    }

    profile.education.push({ degree, school, year, status });
    await profile.save();

    res.json({
      success: true,
      data: { education: profile.education }
    });
  } catch (error) {
    console.error("Add education error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error" 
    });
  }
};

// @desc    Delete education
// @route   DELETE /api/profile/education/:eduId
// @access  Private (Student only)
exports.deleteEducation = async (req, res) => {
  try {
    const { eduId } = req.params;

    const user = await User.findById(req.user.id);
    if (user.role !== "student") {
      return res.status(403).json({ 
        success: false, 
        error: "Only students can delete education" 
      });
    }

    const profile = await StudentProfile.findOne({ user: user._id });
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        error: "Profile not found" 
      });
    }

    profile.education = profile.education.filter(edu => edu._id.toString() !== eduId);
    await profile.save();

    res.json({
      success: true,
      data: { education: profile.education }
    });
  } catch (error) {
    console.error("Delete education error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error" 
    });
  }
};

// @desc    Add certification
// @route   POST /api/profile/certifications
// @access  Private (Student only)
exports.addCertification = async (req, res) => {
  try {
    const { name, issuer, year } = req.body;

    if (!name || !issuer) {
      return res.status(400).json({ 
        success: false, 
        error: "Name and issuer are required" 
      });
    }

    const user = await User.findById(req.user.id);
    if (user.role !== "student") {
      return res.status(403).json({ 
        success: false, 
        error: "Only students can add certifications" 
      });
    }

    let profile = await StudentProfile.findOne({ user: user._id });
    if (!profile) {
      profile = await StudentProfile.create({ user: user._id });
    }

    profile.certifications.push({ name, issuer, year });
    await profile.save();

    res.json({
      success: true,
      data: { certifications: profile.certifications }
    });
  } catch (error) {
    console.error("Add certification error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error" 
    });
  }
};

// @desc    Delete certification
// @route   DELETE /api/profile/certifications/:certId
// @access  Private (Student only)
exports.deleteCertification = async (req, res) => {
  try {
    const { certId } = req.params;

    const user = await User.findById(req.user.id);
    if (user.role !== "student") {
      return res.status(403).json({ 
        success: false, 
        error: "Only students can delete certifications" 
      });
    }

    const profile = await StudentProfile.findOne({ user: user._id });
    if (!profile) {
      return res.status(404).json({ 
        success: false, 
        error: "Profile not found" 
      });
    }

    profile.certifications = profile.certifications.filter(cert => cert._id.toString() !== certId);
    await profile.save();

    res.json({
      success: true,
      data: { certifications: profile.certifications }
    });
  } catch (error) {
    console.error("Delete certification error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Server error" 
    });
  }
};