import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { setLoggedIn, setLoggedOut } from "../redux/actions/authActions";
import ProfileInfo from "../components/sections/ProfileInfo";
import Notifications from "../components/sections/Notifications";
import Connections from "../components/sections/Connections";

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

    // Verify Authentication API Request
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
                navigate("/login"); // Redirect to login page if not logged in
            }
        } catch (error) {
            console.error("Error verifying authentication:", error);
            dispatch(setLoggedOut());
            navigate("/login"); // Redirect to login page on error
        } finally {
            setAuthLoading(false);
        }
    };

    // Fetch User Profile by Username
    const fetchUserProfile = async () => {
        try {
            setLoadingProfile(true);

            const response = await axios.get(
                `${process.env.REACT_APP_BACKEND_BASE_URL}/users/${username}`,
                { withCredentials: true }
            );

            if (response.data) {
                setProfile({
                    id: response?.data.user.id,
                    fullName: response?.data.user.fullName || response?.data.user.username || "Guest",
                    username: response?.data.user.username || "Not provided",
                    role: response?.data.user.role || "Not specified",
                    bio: response?.data.user.bio || "No bio available.",
                    skills: response?.data.user.skills
                        ? response?.data.user.skills.split(",").map((skill) => skill.trim())
                        : [],
                    interests: response?.data.user.interests
                        ? response?.data.user.interests.split(",").map((interest) => interest.trim())
                        : [],
                    email: response?.data.user.email || "Not provided",
                    receivedRequests: response?.data.user.receivedRequests,
                    sentRequests: response?.data.user.sentRequests,
                });
            } else {
                setError("User not found.");
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
            setError("Failed to load profile. Please try again later.");
        } finally {
            setLoadingProfile(false);
        }
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
                // Update the requests state to reflect the change
                setRequests((prevRequests) =>
                    prevRequests.filter((request) => request.id !== senderId)
                );
                fetchRequests();
                toast.success(`Request ${status}`);
            }
        } catch (error) {
            console.error('Error accepting request:', error);
            alert('Failed to accept request. Please try again.');
        }
    };

    const handleSendRequest = async (receiverId, senderId) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/connections/send`, { receiverId, senderId });
            toast.success(response?.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error sending request");
            console.error(error.response?.data?.message);
        }
    };

    const handleRemoveConnection = async (connection) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/connections/remove`, {
                data: {
                    senderId: connection.sender.id,
                    receiverId: connection.receiverId,
                },
                withCredentials: true,
            });

            if (response.data.success) {
                setProfile((prevProfile) => ({
                    ...prevProfile,
                    connections: prevProfile.connections.filter((conn) => conn.id !== connection.id),
                }));

                fetchRequests();
                toast.success('Connection removed successfully.');
            } else {
                toast.error(response.data.error || 'Failed to remove connection.');
            }
        } catch (error) {
            console.error('Error removing connection:', error);
            toast.error('An error occurred while removing the connection.');
        }
    };

    const isOwnProfile = user?.email === profile?.email;

    if (authLoading || loadingProfile) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#000104] text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold">Loading...</h2>
                    <p className="text-gray-400">
                        {authLoading ? "Verifying session..." : "Loading profile..."}
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#000104] text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold">Error</h2>
                    <p>{error}</p>
                    <Link
                        to="/discover"
                        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 text-sm rounded-md text-white shadow-md hover:shadow-lg mt-4 inline-block"
                    >
                        Go Back to Discover
                    </Link>
                </div>
            </div>
        );
    }

    const pendingRequests = requests?.filter(request => request.status === 'pending');
    const acceptedRequests = requests?.filter(request => request.status === 'accepted');

    return (
        <div className="min-h-screen bg-gradient-to-t from-slate-800 to-[#000104] text-white p-6 md:p-12">
            <div className="max-w-6xl mx-auto px-2 py-6 md:px-8 md:py-8 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-8">
                {profile && <div className="md:col-span-2">
                    <ProfileInfo profile={profile} isOwnProfile={isOwnProfile} currentUserId={user?.id} onSendRequest={handleSendRequest} />
                </div>}

                <div className="md:col-span-1 flex flex-col gap-8">
                    {isOwnProfile && pendingRequests && (
                        <Notifications pendingRequests={pendingRequests} handleRequest={handleRequest} />
                    )}

                    {acceptedRequests && (
                        <Connections acceptedRequests={acceptedRequests} isOwnProfile={isOwnProfile} handleRemoveConnection={handleRemoveConnection} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
