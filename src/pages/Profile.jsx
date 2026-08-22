import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ProfileInfo from "../components/sections/ProfileInfo";
import Notifications from "../components/sections/Notifications";
import ProfileLoader from "../components/loaders/ProfileLoader";
import {
    useGetProfileQuery,
    useGetRequestsQuery,
    useSendRequestMutation,
    useRespondToRequestMutation,
} from "../redux/api/apiSlice";

const Profile = () => {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const { username } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn, navigate]);

    const { data: profileData, error: profileError, isLoading: loadingProfile } = useGetProfileQuery(username, {
        skip: !isLoggedIn || !username
    });

    const { data: requestsData } = useGetRequestsQuery(username, {
        skip: !isLoggedIn || !username
    });

    const [sendRequest] = useSendRequestMutation();
    const [respondToRequest] = useRespondToRequestMutation();

    const handleRequest = async (receiverId, senderId, status) => {
        try {
            await respondToRequest({ receiverId, senderId, status }).unwrap();
            toast.success(`Request ${status}`);
        } catch (error) {
            toast.error('Failed to handle request.');
        }
    };

    const handleSendRequest = async (receiverId, senderId) => {
        try {
            const response = await sendRequest({ receiverId, senderId }).unwrap();
            toast.success(response?.message || "Request sent successfully");
        } catch (error) {
            toast.error(error.data?.message || "Error sending request");
        }
    };

    const userData = profileData?.user;
    const profile = userData ? {
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
    } : null;

    const requests = requestsData?.requests || [];
    const isOwnProfile = user?.email === profile?.email;

    if (loadingProfile) return <ProfileLoader />;
    if (profileError) return <div className="h-screen bg-white text-zinc-900 flex items-center justify-center">Failed to load profile. Please try again later.</div>;

    const pendingRequests = requests.filter(r => r.status === 'pending');
    const acceptedRequestsCount = requests.filter(r => r.status === 'accepted').length || 0;

    return (
        <div className="min-h-screen bg-white text-zinc-900 pt-8 pb-20 md:pb-12">
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
                        <div className="bg-zinc-50 rounded-[2rem] border border-zinc-200 p-8 shadow-sm">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 block mb-8">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map((skill, index) => (
                                    <span key={index} className="px-4 py-2 bg-zinc-100 border border-zinc-200 rounded-full text-[11px] font-black uppercase tracking-widest text-zinc-700">
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
