import './App.css';
import Navbar from './components/sections/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedIn, setLoggedOut } from './redux/actions/authActions'; // Redux actions
import axios from 'axios'; // Axios for API calls

// Pages
import Home from './pages/Home';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import MentorDetails from './pages/MentorDetails';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import Login from './pages/Login';
import Matchmaking from './pages/Matchmaking';

// Toast Notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  // Function to verify tokens on app load
  const verifyTokens = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/verify-tokens`, { withCredentials: true }); // API to verify tokens
      
      if (response.data.loggedIn) {
        dispatch(setLoggedIn()); // Update Redux state if tokens are valid
      } else {
        dispatch(setLoggedOut()); // Update Redux state if tokens are invalid
      }
    } catch (error) {
      console.error('Error verifying tokens:', error);
      dispatch(setLoggedOut()); // Update Redux state on error
    }
  };

  // Check authentication status when app loads
  useEffect(() => {
    // if(!isLoggedIn) return;
    verifyTokens();
  }, []);

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer
        className={'text-sm'}
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* Navbar */}
      <Navbar isLoggedIn={isLoggedIn} />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/matchmaking" element={<Matchmaking />} />
        <Route path="/profile/" element={<Profile />} />
        <Route path="/mentorship/:id" element={<MentorDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profilesetup" element={<ProfileSetup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
