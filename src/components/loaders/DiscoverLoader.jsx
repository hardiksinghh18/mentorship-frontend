import React from "react";

const DiscoverLoader = () => {
    return (
        <div className="animate-pulse space-y-4 flex gap-8 md:gap-32 items-center mt-16 md:mt-24">
            {/* Sidebar skeleton */}
            {/* <div className="h-screen hidden md:block bg-[#262626] md:w-[25%] w-0"></div> */}

            {/* Main content skeleton */}
            <div className="w-full md:px-80 space-y-6">
                {/* Skeleton for the heading */}
                <div className="h-8 bg-[#262626] rounded w-full"></div>

                {/* Skeleton for profile cards */}
                {[1, 2, 3, 4].map((_, index) => (
                    <div key={index} className="p-4 bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-800">
                        <div className="flex items-center space-x-4">
                            {/* Skeleton for profile image */}
                            <div className="h-12 w-12 bg-[#262626] rounded-full"></div>

                            {/* Skeleton for profile details */}
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-[#262626] rounded w-3/4"></div>
                                <div className="h-4 bg-[#262626] rounded w-1/2"></div>
                                <div className="h-4 bg-[#262626] rounded w-2/3"></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiscoverLoader;