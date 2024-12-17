import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
            <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
            <p className="mb-6 text-lg">The page you're looking for doesn't exist.</p>
            <Link
                to="/"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Go Back Home
            </Link>
        </div>
    );
};

export default NotFound;
