import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setLoggedIn, setLoggedOut } from '../redux/actions/authActions';
import { useDispatch } from 'react-redux';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch=useDispatch()


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to backend
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/auth/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        { withCredentials: true }  // Send cookies with the request
      );

      // If login is successful, you can store the token and navigate the user
      if (response.data.loggedIn) {
        toast.success(response.data.message)
        dispatch(setLoggedIn()); // Update Redux state if tokens are valid
        setTimeout(()=>{
          navigate('/discover')
        },2000)
      } else {
        dispatch(setLoggedOut()); // Update Redux state if tokens are invalid

      }
    } catch (error) {
      console.error("Error during login:", error.response?.data.message || error.message);
      setErrorMessage(error.response?.data.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000104] to-slate-800">
      <div className="bg-gradient-to-t from-slate-950 to-[#000104] shadow-lg shadow-black p-8 rounded-lg w-full max-w-md text-white">
        <h1 className="text-3xl font-bold text-center mb-6">Welcome Back!</h1>
        <p className="text-sm text-gray-400 text-center mb-8">
          Please login to your account.
        </p>
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
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
          <div className="mb-6">
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
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 py-2 rounded-md text-white font-semibold"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to={"/register"} className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
