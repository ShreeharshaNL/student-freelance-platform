const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.'
      });
    }

    // Check if bearer token
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format. Use Bearer token.'
      });
    }

    const token = tokenParts[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from database
    const user = await UserModel.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Attach user to request object (without password)
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired'
      });
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Middleware to check if user is a student
const isStudent = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Students only.'
    });
  }
};

// Middleware to check if user is a client
const isClient = (req, res, next) => {
  if (req.user && req.user.role === 'client') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Clients only.'
    });
  }
};

// Middleware to check if user is either student or client (authenticated)
const isAuthenticated = verifyToken;

// Optional authentication - doesn't fail if no token, but adds user if valid token
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }

    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return next();
    }

    const token = tokenParts[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await UserModel.findById(decoded.id);
      
      if (user) {
        req.user = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        };
      }
    } catch (err) {
      // Token is invalid, but we don't fail - just continue without user
      console.log('Optional auth: Invalid token provided');
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next();
  }
};

// Middleware to check if user owns the resource
const isOwner = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (!resourceUserId) {
      return res.status(400).json({
        success: false,
        message: 'Resource user ID not found'
      });
    }

    if (req.user.id !== parseInt(resourceUserId)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this resource.'
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  isStudent,
  isClient,
  isAuthenticated,
  optionalAuth,
  isOwner
};