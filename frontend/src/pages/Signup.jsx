import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Signup = () => {
    const [searchParams] = useSearchParams();
    const roleParam = searchParams.get('role');
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
        role: roleParam === 'client' ? 'client' : 'student'
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Update role if URL parameter changes
    useEffect(() => {
        if (roleParam === 'client' || roleParam === 'student') {
            setFormData(prev => ({ ...prev, role: roleParam }));
        }
    }, [roleParam]);

    const { name, email, password, password2, role } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();

        if (password !== password2) {
            setError('Passwords do not match');
            return;
        }

        // Validate college email for students
        if (role === 'student') {
            const collegeEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(edu|ac\.[a-z]{2}|edu\.[a-z]{2})$/i;
            if (!collegeEmailPattern.test(email)) {
                setError('Students must use a valid college email address (e.g., .edu, .ac.uk, .edu.in)');
                return;
            }
        }

        const newUser = { name, email, password, role };

        try {
            const res = await API.post('/auth/register', newUser);

            console.log('SUCCESS!', res.data);
            setError('');

            // Redirect based on role
            if (res.data.data.user.role === 'student') {
                navigate('/student/dashboard');
            } else if (res.data.data.user.role === 'client') {
                navigate('/client/dashboard');
            } else {
                navigate('/');
            }

        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.error || err.response.data.msg);
            } else {
                setError('Registration failed. Please try again.');
            }
            console.error(err);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-full max-w-md">
                <div className="mb-4">
                    <button
                        onClick={() => navigate("/")}
                        className="text-sm text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                        ← Back to Home
                    </button>
                </div>
                <h3 className="text-2xl font-bold text-center">Create Account</h3>
                <p className="text-center text-gray-600">Join our freelancing platform</p>

                <form onSubmit={onSubmit}>
                    {error && <div className="mt-4 p-2 text-sm text-red-700 bg-red-100 rounded-lg">{error}</div>}

                    <div className="mt-4">
                        <div>
                            <label className="block" htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600"
                                name="name"
                                value={name}
                                onChange={onChange}
                                required
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block" htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                placeholder={role === 'student' ? 'student@university.edu' : 'example@gmail.com'}
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                            />
                            {role === 'student' && (
                                <p className="mt-1 text-xs text-gray-500">
                                    Students must use a college email (.edu, .ac.uk, .edu.in, etc.)
                                </p>
                            )}
                        </div>
                        <div className="mt-4">
                            <label className="block">Password</label>
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600"
                                name="password"
                                value={password}
                                onChange={onChange}
                                required
                                minLength="6"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block">Confirm Password</label>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600"
                                name="password2"
                                value={password2}
                                onChange={onChange}
                                required
                                minLength="6"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block">I want to</label>
                            <select
                                name="role"
                                value={role}
                                onChange={onChange}
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600"
                            >
                                <option value="student">Work as a Student Freelancer</option>
                                <option value="client">Hire a Student</option>
                            </select>
                        </div>
                        <div className="flex items-baseline justify-between">
                            <button className="w-full px-6 py-2 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-900">Create Account</button>
                        </div>
                        {/* Link to Login */}
                        <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <a href="/login" className="text-indigo-600 hover:underline">
                                    Login
                                </a>
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
