import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: '',
        role: 'student'
    });

    const [error, setError] = useState('');
    const navigate = useNavigate(); // For redirection

    const { name, email, password, password2, role } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();

        if (password !== password2) {
            setError('Passwords do not match');
            return;
        }

        const newUser = { name, email, password, role };

        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const body = JSON.stringify(newUser);

            const res = await axios.post('http://localhost:5000/api/auth/register', body, config);

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
                                placeholder="example@gmail.com"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-600"
                                name="email"
                                value={email}
                                onChange={onChange}
                                required
                            />
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
