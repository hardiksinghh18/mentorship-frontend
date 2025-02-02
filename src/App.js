import './App.css';
import Navbar from './components/sections/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
import ChatSection from './pages/ChatSection';
import ChatDM from './components/sections/ChatDM';


function App() {
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
// Inside App component
const [loading, setLoading] = useState(true);


  const verifyTokens = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/auth/verify-tokens`, { withCredentials: true });
     
      if (response.data.loggedIn) {
       
        dispatch(setLoggedIn());
      
      } else {
        dispatch(setLoggedOut());
      }
    } catch (error) {
      console.error('Error verifying tokens:', error);
      dispatch(setLoggedOut());
    } finally {
      setLoading(false); // Token verification is complete
    }
  };
  
  useEffect(() => {
   
    verifyTokens();
  }, [dispatch,isLoggedIn]);


  if (loading) {
   return <div className="flex items-center justify-center h-screen bg-[#000104] text-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading...</h2>
        </div>
      </div>// Replace with a spinner or styled loading component
  }
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
        <Route path="/messages" element={<ChatSection />} />
        <Route path="/messages/:id" element={<ChatDM />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/mentorship/:id" element={<MentorDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/setup" element={<ProfileSetup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
