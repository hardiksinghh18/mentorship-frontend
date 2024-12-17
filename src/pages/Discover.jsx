import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Discover = () => {

    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const navigate=useNavigate()
    const users = [
        {
            id: 1,
            name: "John Doe",
            role: "Mentor",
            skills: ["React", "Node.js", "JavaScript"],
            bio: "Passionate about helping others learn full-stack development.",
        },
        {
            id: 2,
            name: "Jane Smith",
            role: "Mentee",
            skills: ["Python", "Data Analysis", "SQL"],
            bio: "Looking for guidance in data engineering and analytics.",
        },
        {
            id: 3,
            name: "Michael Johnson",
            role: "Mentor",
            skills: ["Machine Learning", "AI", "Python"],
            bio: "Excited to mentor aspiring data scientists and ML engineers.",
        },
        {
            id: 4,
            name: "Emily Davis",
            role: "Mentee",
            skills: ["UI/UX Design", "Figma", "HTML/CSS"],
            bio: "Seeking mentorship to transition from design to front-end development.",
        },
    ];


    useEffect(() => {
        console.log(isLoggedIn)
        // If the user is not logged in, redirect to the login page
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-t from-slate-800 to-[#000104] text-white py-12 px-6 md:px-20">
            <h1 className="text-4xl font-bold text-center mb-10">
                Discover Mentors and Mentees
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="bg-[#1c1e29] rounded-lg shadow-lg p-6 flex flex-col justify-between hover:scale-105 transition-transform"
                    >
                        <h2 className="text-2xl font-semibold mb-2">{user.name}</h2>
                        <p className="text-lg font-medium text-blue-400 mb-2">{user.role}</p>
                        <p className="text-sm text-slate-300 mb-4">
                            <span className="font-semibold text-white">Skills:</span>{" "}
                            {user.skills.join(", ")}
                        </p>
                        <p className="text-sm text-slate-400 italic mb-6">"{user.bio}"</p>
                        <button className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity">
                            Connect
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Discover;
