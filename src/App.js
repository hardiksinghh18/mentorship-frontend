import './App.css';
import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedIn, setLoggedOut } from './redux/actions/authActions';
import axios from 'axios';

// Material UI Theme Integration
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import lightTheme from './theme';

// Pages
import Home from './pages/Home';
import Discover from './pages/Discover';
import Profile from './pages/Profile';
import MentorDetails from './pages/MentorDetails';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import ProfileSetup from './pages/ProfileSetup';
import Login from './pages/Login';
import GlobalLoader from './components/loaders/GlobalLoader';
import Sidebar from './components/sections/Sidebar';

import ChatSection from './pages/ChatSection';
import ChatDM from './components/sections/ChatDM';

import Features from './pages/Features';
import UserConnections from './pages/UserConnections';

function App() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
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
      setLoading(false);
    }
  };
  
  useEffect(() => {
    verifyTokens();
  }, [dispatch, isLoggedIn]);

  if (loading) {
    return <GlobalLoader />;
  }

  return (
    <ThemeProvider theme={lightTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <Sidebar />

        <main className="md:pl-24 transition-all duration-500 bg-white min-h-screen text-zinc-900">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/explore" element={<Discover />} />
            <Route path="/messages" element={<ChatSection />} />
            <Route path="/messages/:id" element={<ChatDM />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/profile/:username/connections" element={<UserConnections />} />
            <Route path="/mentorship/:id" element={<MentorDetails />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile/setup" element={<ProfileSetup />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
