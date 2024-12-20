import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setLoggedIn, setLoggedOut } from '../redux/actions/authActions';
import { useDispatch } from 'react-redux';


const Register = () => {
    const [formData, setFormData] = useState({ email: '', username: '', password: '', confirmPassword: '' });
const dispatch=useDispatch()
const navigate=useNavigate()
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
           
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/auth/register`, {
                email: formData.email,
                username: formData.username,
                password: formData.password,
            }, { withCredentials: true });

           
            if (response.data.loggedIn) {
                toast.success(response.data.message)
                dispatch(setLoggedIn()); // Update Redux state if tokens are valid
                setTimeout(()=>{
                    navigate('/discover')
                  },10)
            } else {
                dispatch(setLoggedOut()); // Update Redux state if tokens are invalid
              
            }
        } catch (error) {
            console.error("Error during registration:", error.response.data.message);

            if (error.response && error.response.data) {
                // Handle specific error messages sent by the backend
                toast.error(error.response.data.message || "Registration failed");
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen  flex items-center justify-center bg-gradient-to-br from-[#000104] to-slate-800">
            <div className="bg-gradient-to-t mt-12 from-slate-950 to-[#000104] shadow-lg shadow-black p-8 rounded-lg w-full max-w-md text-white">
                <h1 className="text-2xl font-bold text-center mb-2">Create Your Account</h1>
                <p className="text-sm text-gray-400 text-center mb-8">
                    Sign up to start your mentorship journey.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-xs font-semibold mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-xs font-semibold mb-2">
                            Username
                        </label>
                        <input
                            type="test"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 py-2 rounded-md text-white font-semibold"
                    >
                        Register
                    </button>
                </form>
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to={'/login'} className="text-blue-500 hover:underline">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
