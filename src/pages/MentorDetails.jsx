import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLoggedIn, setLoggedOut } from '../redux/actions/authActions';
import axios from 'axios';

const MentorDetails = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [authLoading, setAuthLoading] = useState(true); // Tracks auth verification loading

  // Function to verify authentication
  const verifyAuth = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_BASE_URL}/auth/verify-tokens`,
        { withCredentials: true }
      );

      if (response.data.loggedIn) {
        dispatch(setLoggedIn());
      } else {
        dispatch(setLoggedOut());
        navigate('/login');
      }
    } catch (error) {
      console.error('Error verifying tokens:', error);
      dispatch(setLoggedOut());
      navigate('/login');
    } finally {
      setAuthLoading(false); // Stop loading after auth check
    }
  };

  useEffect(() => {
    verifyAuth();
  }, [dispatch, navigate]);

  // Loading spinner during auth check
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#000104] text-white">
        <div className="text-center">
           
          <h2 className="text-2xl font-semibold">Loading...</h2>
          <p className="text-gray-400">Verifying your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1c1e29] text-white">
      <h1 className="text-3xl font-bold">Mentor Details Page</h1>
    </div>
  );
};

export default MentorDetails;
