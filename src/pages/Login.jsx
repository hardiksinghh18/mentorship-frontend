import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { setLoggedIn, setLoggedOut } from "../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isLoggedIn } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/api/auth/login`,
        { email: formData.email, password: formData.password },
        { withCredentials: true }
      );

      if (response.data.loggedIn) {
        toast.success(response.data.message);
        dispatch(setLoggedIn());
        setTimeout(() => {
          navigate("/discover");
        }, 500);
      } else {
        dispatch(setLoggedOut());
      }
    } catch (error) {
      setErrorMessage(error.response?.data.message || "Something went wrong. Please try again.");
    }
  };


  if (isLoggedIn) {
    navigate("/");
    return;
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
      <div className="max-w-md w-full bg-[#131313] p-8 md:mt-12 rounded-xl shadow-lg border border-gray-800 text-white">
        <div className="flex flex-col items-center">
          <FaUserCircle className="text-gray-400 text-6xl mb-4" />
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-400 mt-1">Sign in to your account</p>
        </div>

        {errorMessage && <div className="text-red-500 text-center mt-4">{errorMessage}</div>}

        <form onSubmit={handleSubmit} className="mt-6">
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
          </div>

          <div className="mb-6">
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
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 text-white py-3 rounded-lg font-semibold transition-all"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-400">
            Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
