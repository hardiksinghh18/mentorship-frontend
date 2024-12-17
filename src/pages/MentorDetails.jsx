import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const MentorDetails = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const navigate=useNavigate()
  useEffect(() => {
    // If the user is not logged in, redirect to the login page
    if (!isLoggedIn) {
        navigate('/login');
    }
}, [isLoggedIn, navigate]);
  return (
    <div>
      Mentor Details page
    </div>
  )
}

export default MentorDetails
