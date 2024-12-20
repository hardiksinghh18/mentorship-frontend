import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useSelector } from 'react-redux'; // Import useSelector to access Redux state

const Matchmaking = () => {
  const navigate = useNavigate(); // Initialize the navigate hook
  const { isLoggedIn } = useSelector((state) => state.auth); // Get isLoggedIn from Redux state

  // If not logged in, redirect to the login page
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login'); // Redirect to login page if user is not logged in
    }
  }, [isLoggedIn, navigate]); // Depend on isLoggedIn and navigate

  return (
    <div className="min-h-screen bg-gradient-to-t flex items-center justify-center from-slate-800 to-[#000104] text-white py-12 px-6 md:px-20">
      <div className="flex items-center justify-center flex-col">
        <h1 className="text-5xl font-bold text-center text-white mb-6">
          Matchmaking Feature
        </h1>
        <p className="text-2xl text-center text-slate-300 mb-8">
          Coming Soon!
        </p>
        <div className="flex justify-center">
          <div className="border-t-4 border-blue-500 w-16 mb-6"></div>
        </div>
        <p className="text-center text-slate-400">
          We're working hard to bring this feature to you. Stay tuned!
        </p>
      </div>
    </div>
  );
};

export default Matchmaking;
