import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    phone: ""
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'student') {
        navigate('/student/dashboard');
      } else if (user.role === 'client') {
        navigate('/client/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain at least one letter and one number";
    }
    
    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    // Phone validation (optional)
    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);
      
      if (!result.success) {
        setErrors({ general: result.error || "Registration failed. Please try again." });
      }
      // If successful, the AuthContext will handle navigation
    } catch (error) {
      setErrors({ general: error.message || "An unexpected error occurred." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
          <p className="text-gray-600 mt-2">Join our freelancing platform</p>
        </div>
        
        {/* General Error Message */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{errors.general}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              value={formData.name}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name}</p>
            )}
          </div>
          
          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>
          
          {/* Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className={`w-full px-4 py-3 pr-12 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>
          
          {/* Confirm Password Field */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 pr-12 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
          
          {/* Role Selection */}
          <div className="mb-4">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              I want to
            </label>
            <select
              id="role"
              name="role"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={formData.role}
              onChange={handleChange}
              disabled={isLoading}
            >
              <option value="student">Work as a Student Freelancer</option>
              <option value="client">Hire Student Talent</option>
            </select>
          </div>
          
          {/* Phone Field (Optional) */}
          <div className="mb-6">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number (Optional)
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter your phone number"
              className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
            )}
          </div>
          
          {/* Terms and Conditions */}
          <div className="mb-6">
            <label className="flex items-start">
              <input
                type="checkbox"
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded mt-0.5"
                required
              />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
                  Terms and Conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
