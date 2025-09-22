const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const UserModel = require('../models/UserModel');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('Password must contain at least one letter and one number'),
  body('role')
    .isIn(['student', 'client'])
    .withMessage('Role must be either student or client'),
  body('phone')
    .optional()
    .isMobilePhone('en-IN')
    .withMessage('Please provide a valid Indian mobile number')
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      role: user.role 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { 
      expiresIn: '7d' 
    }
  );
};

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user details
    const user = await UserModel.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    req.user = user;
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
    
    return res.status(500).json({ 
      success: false,
      message: 'Error authenticating token' 
    });
  }
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    const emailExists = await UserModel.emailExists(email);
    if (emailExists) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already registered' 
      });
    }

    // Create new user
    const newUser = await UserModel.create({
      name,
      email,
      password,
      role,
      phone
    });

    // Generate token
    const token = generateToken(newUser);

    // Send response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error registering user',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', loginValidation, async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Verify password
    const isPasswordValid = await UserModel.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(user);

    // Remove password from user object
    delete user.password;

    // Send response
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          rating: user.rating,
          isVerified: user.is_verified
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/auth/verify-token
// @desc    Verify JWT token
// @access  Public
router.post('/verify-token', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user details
    const user = await UserModel.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Remove password from user object
    delete user.password;

    res.json({
      success: true,
      message: 'Token is valid',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          rating: user.rating,
          isVerified: user.is_verified
        }
      }
    });

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
    
    console.error('Token verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error verifying token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/auth/refresh-token
// @desc    Refresh JWT token
// @access  Private
router.post('/refresh-token', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
    }

    // Verify current token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user details
    const user = await UserModel.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Generate new token
    const newToken = generateToken(user);

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newToken
      }
    });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid or expired token' 
      });
    }
    
    console.error('Token refresh error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error refreshing token',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (simple client-side logout)
// @access  Private
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Since you're using simple JWT tokens, logout is mainly client-side
    // The client will delete the token from localStorage
    // You can optionally log this action or update last activity
    
    const userId = req.user.id;
    
    // Optional: Update last activity
    await UserModel.updateLastActivity?.(userId);
    
    res.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

module.exports = router;