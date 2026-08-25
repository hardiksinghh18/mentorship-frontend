import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedIn } from './redux/actions/authActions';

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

import UserConnections from './pages/UserConnections';
import RoadmapList from './pages/roadmaps';
import RoadmapCreate from './pages/roadmaps/RoadmapCreate';
import RoadmapView from './pages/roadmaps/RoadmapView';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const hasInitialized = useRef(false);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const isLandingPage = location.pathname === '/' && !isLoggedIn;

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const initializeAuth = async () => {
      try {
        await dispatch(setLoggedIn());
      } catch (error) {
        console.error('Error verifying session:', error);
      } finally {
        setLoading(false);
      }
    };
    initializeAuth();
  }, [dispatch]);

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

        {!isLandingPage && <Sidebar />}

        <main className={`${isLandingPage ? '' : 'md:pl-24'} transition-all duration-500 bg-white min-h-screen text-zinc-900`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/roadmaps" element={<RoadmapList />} />
            <Route path="/explore" element={<Discover />} />
            <Route path="/roadmaps/create" element={<RoadmapCreate />} />
            <Route path="/roadmaps/:id" element={<RoadmapView />} />
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
