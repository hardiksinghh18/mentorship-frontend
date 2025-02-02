import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";

const ChatSection = () => {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const [name, setName] = useState('');
    const [allChats, setAllChats] = useState(null);
    const [filteredChats, setFilteredChats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleFilterChange = (e) => {
        setName(e.target.value);
    };

    const fetchRequests = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/connections/requests/${user?.username}`);
            const connections = response?.data.requests.filter(request => request.status === 'accepted');
            setAllChats(connections);
            setFilteredChats(connections);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching requests', error);
        }
    };

    const applySearchFilter = () => {
        if (!name) {
            setFilteredChats(allChats);
            return;
        }
        
        const matchingChats = allChats?.filter((chat) =>
            chat.sender.username.toLowerCase().includes(name.toLowerCase())
        );
        setFilteredChats(matchingChats);
        
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    useEffect(() => {
        applySearchFilter();
    }, [name, allChats]);

    if (!isLoggedIn) {
        navigate("/login");
    }

    return (
        <div className="bg-[#0d0d0d] min-h-screen md:mt-16 px-8 py-6 rounded-xl text-white max-w-2xl mx-auto shadow-2xl border border-gray-700">
            <div className="flex items-center gap-4 mb-6">
                <Link to={'/'} className="text-gray-600 hover:text-blue-500 transition-all text-3xl">
                    <IoArrowBack />
                </Link>
                <h2 className="text-2xl font-bold text-white">{user?.username || user?.fullName}</h2>
            </div>
            <div className="relative w-full my-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Search chats..."
                    value={name}
                    onChange={handleFilterChange}
                    className="bg-gray-800 text-white text-md px-5 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow-lg"
                />
            </div>
            <h4 className="text-lg font-semibold mb-4 text-gray-300">Messages</h4>
            {loading ? (
                 <div className="space-y-4">
                 {[...Array(5)].map((_, index) => (
                     <div key={index} className="flex items-center gap-4 p-4 bg-gray-900 rounded-lg shadow-md border border-gray-900 animate-pulse">
                         <div className="w-12 h-12 bg-gray-800 rounded-full"></div>
                         <div className="flex-1">
                             <div className="h-4 bg-gray-800 rounded w-3/4 mb-2"></div>
                             <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                         </div>
                     </div>
                 ))}
             </div>
            ):(
                <div className="space-y-3">
                {filteredChats?.map((chat) => (
                    <div
                        key={chat.id}
                        className="flex items-center gap-4 px-4 py-3  rounded-lg hover:bg-gray-900 transition-all cursor-pointer shadow-md border-b border-gray-600"
                    >
                        <div className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-full text-xl font-bold text-white shadow-md border border-gray-900">
                            {chat.sender.email.charAt(0).toUpperCase()}
                        </div>
                        <Link to={`/messages/${chat.sender.id}`} className="flex-1 overflow-hidden">
                            <p className="text-lg font-medium text-white truncate w-48">{chat.sender.username || chat.sender.fullName}</p>
                        </Link>
                    </div>
                ))}
            </div>
            )}
           
        </div>
    );
};

export default ChatSection;


{/* <div className="bg-[#0d0d0d] min-h-screen md:mt-16 px-8 py-6 rounded-xl text-white max-w-2xl mx-auto shadow-2xl border border-gray-700">
<div className="flex items-center gap-4 mb-6">
    <Link to={'/'} className="text-gray-400 hover:text-blue-500 transition-all text-3xl">
        <IoArrowBack />
    </Link>
    <h2 className="text-2xl font-bold text-white">{user?.username || user?.fullName}</h2>
</div>
<div className="relative w-full my-4">
    <input
        type="text"
        name="name"
        placeholder="Search chats..."
        value={name}
        onChange={handleFilterChange}
        className="bg-gray-800 text-white text-md px-5 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 shadow-lg"
    />
</div>
<h4 className="text-lg font-semibold mb-4 text-gray-300">Messages</h4>
<div className="space-y-3">
    {allChats?.map((chat) => (
        <div
            key={chat.id}
            className="flex items-center gap-4 px-4 py-3  rounded-lg hover:bg-gray-900 transition-all cursor-pointer shadow-md border-b border-gray-600"
        >
            <div className="w-12 h-12 flex items-center justify-center bg-gray-800 rounded-full text-xl font-bold text-white shadow-md border border-gray-900">
                {chat.sender.email.charAt(0).toUpperCase()}
            </div>
            <Link to={`/messages/${chat.sender.id}`} className="flex-1 overflow-hidden">
                <p className="text-lg font-medium text-white truncate w-48">{chat.sender.username || chat.sender.fullName}</p>
            </Link>
        </div>
    ))}
</div>
</div> */}
