import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Matchmaking = () => {
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const navigate=useNavigate()
    // Dummy data
    const mentors = [
        {
            id: 1,
            name: "John Doe",
            skills: ["React", "Node.js", "JavaScript"],
            bio: "Experienced full-stack developer passionate about mentoring.",
        },
        {
            id: 2,
            name: "Michael Johnson",
            skills: ["Machine Learning", "Python", "AI"],
            bio: "Helping data science enthusiasts break into AI.",
        },
    ];

    const mentees = [
        {
            id: 1,
            name: "Emily Davis",
            interests: ["React", "CSS", "JavaScript"],
            bio: "Front-end developer looking to learn React.",
        },
        {
            id: 2,
            name: "Jane Smith",
            interests: ["Python", "Data Science", "AI"],
            bio: "Aspiring data scientist seeking guidance in Python and AI.",
        },
    ];

    const [matches, setMatches] = useState([]);


    useEffect(() => {
        // If the user is not logged in, redirect to the login page
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);


    const findMatches = () => {
        const results = mentees.map((mentee) => {
            const matchedMentors = mentors.filter((mentor) =>
                mentor.skills.some((skill) => mentee.interests.includes(skill))
            );
            return { mentee, matchedMentors };
        });
        setMatches(results);
    };


   

    return (
        <div className="min-h-screen bg-gradient-to-t from-slate-800 to-[#000104] text-white py-12 px-6 md:px-20">
            <h1 className="text-4xl font-bold text-center mb-10">
                Find Your Perfect Match
            </h1>

            <div className="text-center mb-8">
                <button
                    onClick={findMatches}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-2 rounded-md text-lg font-semibold text-white hover:opacity-90 transition-opacity"
                >
                    Find Matches
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {matches.length === 0 ? (
                    <p className="text-center text-slate-300">
                        Click "Find Matches" to see suggested mentorship connections.
                    </p>
                ) : (
                    matches.map(({ mentee, matchedMentors }) => (
                        <div
                            key={mentee.id}
                            className="bg-[#1c1e29] rounded-lg shadow-lg p-6"
                        >
                            <h2 className="text-2xl font-semibold text-white mb-4">
                                Mentee: {mentee.name}
                            </h2>
                            <p className="text-sm text-slate-400 mb-4">
                                <span className="font-semibold text-white">Interests:</span>{" "}
                                {mentee.interests.join(", ")}
                            </p>
                            <p className="text-sm text-slate-300 mb-6 italic">
                                "{mentee.bio}"
                            </p>
                            <h3 className="text-lg font-semibold text-blue-400 mb-4">
                                Suggested Mentors:
                            </h3>
                            {matchedMentors.length > 0 ? (
                                matchedMentors.map((mentor) => (
                                    <div key={mentor.id} className="mb-4">
                                        <p className="font-medium text-white">
                                            {mentor.name}
                                        </p>
                                        <p className="text-sm text-slate-300">
                                            Skills: {mentor.skills.join(", ")}
                                        </p>
                                        <p className="text-sm text-slate-400 italic">
                                            "{mentor.bio}"
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400">
                                    No matches found for this mentee.
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Matchmaking;
