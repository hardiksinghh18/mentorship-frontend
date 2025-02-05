import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLoggedIn, setLoggedOut } from '../redux/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';

const Register = () => {
    const [formData, setFormData] = useState({ email: '', username: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({}); // State to store validation errors
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {  isLoggedIn } = useSelector((state) => state.auth);
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateUsername = (username) => {
        return username.trim().length > 0 && !/\s/.test(username);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{6,}$/;
        return passwordRegex.test(password);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Validate inputs on the fly
        const newErrors = { ...errors };
        switch (name) {
            case 'email':
                if (!validateEmail(value)) {
                    newErrors.email = 'Please enter a valid email address.';
                } else {
                    delete newErrors.email;
                }
                break;
            case 'username':
                if (!validateUsername(value)) {
                    newErrors.username = 'Username cannot contain spaces and must not be empty.';
                } else {
                    delete newErrors.username;
                }
                break;
            case 'password':
                if (!validatePassword(value)) {
                    newErrors.password = 'Password must be at least 6 characters long, contain one uppercase letter, one digit, and one symbol.';
                } else {
                    delete newErrors.password;
                }
                break;
            case 'confirmPassword':
                if (value !== formData.password) {
                    newErrors.confirmPassword = 'Passwords do not match.';
                } else {
                    delete newErrors.confirmPassword;
                }
                break;
            default:
                break;
        }
        setErrors(newErrors);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation before submission
        const newErrors = {};
        if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address.';
        }
        if (!validateUsername(formData.username)) {
            newErrors.username = 'Username cannot contain spaces and must not be empty.';
        }
        if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 6 characters long, contain one uppercase letter, one digit, and one symbol.';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error('Please fix the errors before submitting.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/auth/register`, {
                email: formData.email,
                username: formData.username,
                password: formData.password,
            }, { withCredentials: true });

            if (response.data.loggedIn) {
                toast.success(response.data.message);
                dispatch(setLoggedIn());
                setTimeout(() => {
                    navigate('/discover');
                }, 500);
            } else {
                dispatch(setLoggedOut());
            }
        } catch (error) {
            toast.error(error.response?.data.message || "Registration failed");
        }
    };


    if (isLoggedIn) {
        navigate("/");
        return;
      }
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
            <div className="max-w-md w-full bg-[#131313] p-8 rounded-xl shadow-lg border border-gray-800 text-white">
                <div className="flex flex-col items-center">
                    <FaUserCircle className="text-gray-400 text-6xl mb-4" />
                    <h1 className="text-3xl font-bold">Create Your Account</h1>
                    <p className="text-gray-400 mt-1">Sign up to start your journey</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-6">
                    {/* Email Field */}
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Enter your email"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Username Field */}
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Enter your username"
                        />
                        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Enter your password"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-6">
                        <label className="block text-gray-400 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
                            placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white py-3 rounded-lg font-semibold transition-all"
                    >
                        Register
                    </button>
                </form>

                {/* Login Link */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">Already have an account? <Link to={'/login'} className="text-blue-500 hover:underline">Login</Link></p>
                </div>
            </div>
        </div>
    );
};

export default Register;