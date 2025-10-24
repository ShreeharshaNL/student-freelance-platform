const User = require("../models/User");

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
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    let userData = user.toObject();

    if (user.role === "client") {
      const ClientProfile = require("../models/ClientProfileModel");
      const clientProfile = await ClientProfile.findOne({ user: userId });
      
      if (clientProfile) {
        userData = {
          ...userData,
          companyName: clientProfile.companyName,
          industryType: clientProfile.industryType,
          location: clientProfile.location,
          website: clientProfile.website,
          companySize: clientProfile.companySize,
          profileImage: clientProfile.profileImage,
          rating: clientProfile.rating,
          totalReviews: clientProfile.totalReviews,
          projectsPosted: clientProfile.projectsPosted,
          totalSpent: clientProfile.totalSpent,
          hiredStudents: clientProfile.hiredStudents,
          responseTime: clientProfile.responseTime,
          description: clientProfile.description,
          postedProjects: clientProfile.postedProjects,
          hiredHistory: clientProfile.hiredHistory,
          reviews: clientProfile.reviews,
        };
      }
    } else if (user.role === "student") {
      const StudentProfile = require("../models/StudentProfileModel");
      const studentProfile = await StudentProfile.findOne({ user: userId });
      
      if (studentProfile) {
        userData = {
          ...userData,
          ...studentProfile.toObject(),
        };
      }
    }

    res.status(200).json({ success: true, data: userData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
