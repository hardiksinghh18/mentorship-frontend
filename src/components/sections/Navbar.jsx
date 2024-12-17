import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // Dummy profile data
    const [profile, setProfile] = useState({
        name: "John Doe",
        role: "Mentor",
        bio: "Passionate full-stack developer and mentor with 5+ years of experience.",
        skills: ["React", "Node.js", "JavaScript", "Tailwind CSS"],
        profileImage: "https://via.placeholder.com/150", // Replace with actual image URL
        connections: [
            { id: 1, name: "Emily Davis", role: "Mentee" },
            { id: 2, name: "Michael Johnson", role: "Mentee" },
        ],
    });



    return (
        <div className="min-h-screen bg-gradient-to-t from-[#000104] to-slate-800 text-white p-6 md:p-12">
            <div className="max-w-6xl mx-auto bg-[#1c1e29] p-8 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Side - Connections */}
                <div className="col-span-1 bg-[#2a2c3a] p-6 rounded-md shadow-md">
                    <h2 className="text-2xl font-semibold mb-4">Connections</h2>
                    <div className="flex flex-col gap-4">
                        {profile.connections.length > 0 ? (
                            profile.connections.map((connection) => (
                                <div
                                    key={connection.id}
                                    className="flex items-center justify-between bg-[#1c1e29] p-4 rounded-md shadow-sm"
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold">{connection.name}</h3>
                                        <p className="text-slate-400 text-sm">{connection.role}</p>
                                    </div>
                                    <button className="text-red-400 hover:underline text-sm">
                                        Remove
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate-400">No connections yet.</p>
                        )}
                    </div>
                </div>

                {/* Right Side - Profile */}
                <div className="col-span-2 bg-[#2a2c3a] p-6 rounded-md shadow-md">
                    {/* Profile Header */}
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                        <img
                            src={profile.profileImage}
                            alt="Profile"
                            className="w-32 h-32 rounded-full border-4 border-gray-700"
                        />
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                            <p className="text-slate-400 mb-4">{profile.role}</p>
                            <p className="text-slate-300">{profile.bio}</p>
                        </div>
                        {/* Redirect to profile setup page */}
                        <Link
                            to="/profile/setup"
                            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 text-sm rounded-md text-white mt-4 md:mt-0"
                        >
                            Edit Profile
                        </Link>
                    </div>

                    {/* Skills Section */}
                    <div className="mt-8">
                        <h2 className="text-xl font-semibold mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-3">
                            {profile.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="bg-blue-500 text-white text-sm px-3 py-1 rounded-full"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
