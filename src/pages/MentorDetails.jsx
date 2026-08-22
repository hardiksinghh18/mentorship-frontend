import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const MentorDetails = () => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1c1e29] text-white">
      <h1 className="text-3xl font-bold">Mentor Details Page</h1>
    </div>
  );
};

export default MentorDetails;
