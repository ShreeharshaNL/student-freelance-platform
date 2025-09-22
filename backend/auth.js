const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const UserModel = require('./models/UserModel');

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

module.exports = router;
