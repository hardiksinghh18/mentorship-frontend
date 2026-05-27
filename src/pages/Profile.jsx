import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { setLoggedIn, setLoggedOut } from "../redux/actions/authActions";
import ProfileInfo from "../components/sections/ProfileInfo";
import Notifications from "../components/sections/Notifications";
import ProfileLoader from "../components/loaders/ProfileLoader";

const Profile = () => {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const { username } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [authLoading, setAuthLoading] = useState(true);
    const [profile, setProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [error, setError] = useState(null);
    const [requests, setRequests] = useState(null);

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
                navigate("/login");
            }
        } catch (error) {
            dispatch(setLoggedOut());
            navigate("/login");
        } finally {
            setAuthLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        try {
            setLoadingProfile(true);
            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/users/${username}`,
                { withCredentials: true }
            );
            if (response.data) {
                const userData = response.data.user;
                setProfile({
                    id: userData.id,
                    fullName: userData.fullName || userData.username || "Guest",
                    username: userData.username || "Not provided",
                    role: userData.role || "Not specified",
                    bio: userData.bio || "No bio available.",
                    skills: Array.isArray(userData.skills) ? userData.skills : (userData.skills ? userData.skills.split(",").map(s => s.trim()) : []),
                    education: Array.isArray(userData.education) ? userData.education : [],
                    experience: Array.isArray(userData.experience) ? userData.experience : [],
                    email: userData.email || "Not provided",
                    receivedRequests: userData.receivedRequests,
                    sentRequests: userData.sentRequests,
                    socialLinks: userData.socialLinks,
                });
            } else {
                setError("User not found.");
            }
        } catch (error) {
            setError("Failed to load profile. Please try again later.");
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleLogout = () => {
        dispatch(setLoggedOut());
        toast.success("Logged out successfully");
        navigate("/login");
    };

    useEffect(() => {
        verifyAuth();
    }, [dispatch, navigate]);

    useEffect(() => {
        if (isLoggedIn && username) {
            fetchUserProfile();
        }
    }, [isLoggedIn, username]);

    const fetchRequests = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/connections/requests/${username}`);
            setRequests(response?.data.requests);
        } catch (error) {
            console.error('Error fetching requests', error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [user]);

    const handleRequest = async (receiverId, senderId, status) => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/api/connections/requests/handleRequest`,
                { receiverId, senderId, status },
                { withCredentials: true }
            );
            if (response.data.success) {
                setRequests((prev) => prev?.filter((r) => r.id !== senderId));
                fetchRequests();
                toast.success(`Request ${status}`);
            }
        } catch (error) {
            toast.error('Failed to handle request.');
        }
    };

    const handleSendRequest = async (receiverId, senderId) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/connections/send`, { receiverId, senderId });
            toast.success(response?.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error sending request");
        }
    };

    const isOwnProfile = user?.email === profile?.email;

    if (authLoading || loadingProfile) return <ProfileLoader />;
    if (error) return <div className="h-screen bg-black text-white flex items-center justify-center">{error}</div>;

    const pendingRequests = requests?.filter(r => r.status === 'pending');
    const acceptedRequestsCount = requests?.filter(r => r.status === 'accepted').length || 0;

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black pt-8 pb-20 md:pb-12">
            <div className="max-w-[1800px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
                
                {/* Main Content Area */}
                {profile && (
                    <div className="lg:col-span-8">
                        <ProfileInfo 
                            profile={profile} 
                            isOwnProfile={isOwnProfile} 
                            currentUserId={user?.id} 
                            onSendRequest={handleSendRequest}
                            connectionCount={acceptedRequestsCount}
                        />
                    </div>
                )}

                {/* Sidebar Area */}
                <div className="lg:col-span-4 flex flex-col gap-12">
                    {isOwnProfile && pendingRequests && (
                        <Notifications pendingRequests={pendingRequests} handleRequest={handleRequest} />
                    )}

                    {/* Skills Sidebar Section */}
                    {profile?.skills?.length > 0 && (
                        <div className="bg-black rounded-[2rem] border border-white/[0.03] p-8">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 block mb-8">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map((skill, index) => (
                                    <span key={index} className="px-4 py-2 bg-white/[0.03] border border-white/5 rounded-full text-[11px] font-black uppercase tracking-widest text-zinc-400">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
};

export default Profile;
