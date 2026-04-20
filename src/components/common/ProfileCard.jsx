import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserPlus, FaUserCheck, FaClock } from "react-icons/fa"; // Icons for different states

const ProfileCard = ({ profile, currentUserId, matchScore }) => {
  const { id, name, role, skills, username, bio, receivedRequests, sentRequests } = profile;

  const [buttonStatus, setButtonStatus] = useState("connect");

  const determineButtonStatus = () => {
    const receivedRequest = receivedRequests?.find(
      (req) => req.senderId === currentUserId && req.receiverId === id
    );
    const sentRequest = sentRequests?.find(
      (req) => req.receiverId === currentUserId && req.senderId === id
    );

    if (receivedRequest?.status === "accepted" || sentRequest?.status === "accepted") {
      return "connected";
    }
    if (receivedRequest?.status === "pending" || sentRequest?.status === "pending") {
      return "pending";
    }
    return "connect";
  };

  const onSendRequest = async (receiverId, senderId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/connections/send`, { receiverId, senderId });
      toast.success(response.data.message);
      setButtonStatus("pending");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending request");
    }
  };

  useEffect(() => {
    setButtonStatus(determineButtonStatus());
  }, [receivedRequests, sentRequests, currentUserId, id]);

  const handleSendRequest = async () => {
    if (buttonStatus === "connect") {
      await onSendRequest(id, currentUserId);
    }
  };

  const getButtonConfig = () => {
    switch (buttonStatus) {
      case "connected":
        return { 
          text: "Connected", 
          icon: <FaUserCheck size={14} />, 
          className: "bg-white/10 text-white cursor-default" 
        };
      case "pending":
        return { 
          text: "Pending", 
          icon: <FaClock size={14} />, 
          className: "bg-white/5 text-white/50 cursor-default" 
        };
      default:
        return { 
          text: "Connect", 
          icon: <FaUserPlus size={14} />, 
          className: "bg-white text-black hover:bg-white/90" 
        };
    }
  };

  const btnConfig = getButtonConfig();

  return (
    <div className="group relative bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 rounded-[2rem] p-8 border border-white/[0.05] hover:border-white/10">
      {/* Editorial Layout */}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        
        {/* Profile Image & Avatar */}
        <div className="relative shrink-0">
          <Link to={`/profile/${username}`} className="block w-20 h-20 rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 group-hover:border-white/20 transition-all duration-500">
             <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-white/20 group-hover:text-white/40 transition-colors">
               {username[0]?.toUpperCase()}
             </div>
          </Link>
          {matchScore && (
            <div className="absolute -bottom-2 -right-2 bg-white text-black text-[10px] font-black px-2 py-1 rounded-md shadow-2xl tracking-tighter">
              {matchScore}% MATCH
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <Link to={`/profile/${username}`} className="text-2xl font-bold text-white tracking-tight hover:text-zinc-300 transition-colors">
                  {name}
                </Link>
                {role && (
                  <span className="px-2.5 py-1 bg-white text-black text-[9px] font-black uppercase tracking-[0.2em] rounded border border-white">
                    {role}
                  </span>
                )}
              </div>
              <Link to={`/profile/${username}`} className="block text-zinc-500 text-base font-bold tracking-tight mt-1 opacity-80 italic lowercase hover:text-white transition-colors">
                @{username}
              </Link>
            </div>

            <button
              onClick={handleSendRequest}
              disabled={buttonStatus !== "connect"}
              className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full text-xs font-black tracking-widest uppercase transition-all active:scale-[0.98] ${btnConfig.className}`}
            >
              {btnConfig.icon}
              {btnConfig.text}
            </button>
          </div>

          {bio && (
            <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl font-medium">
              {bio.length > 120 ? `${bio.slice(0, 117)}...` : bio}
            </p>
          )}

          {/* Tags */}
          <div className="pt-2 flex flex-wrap gap-2">
            {skills?.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/[0.03] border border-white/[0.05] rounded-lg text-[10px] font-bold text-zinc-500 uppercase tracking-wider group-hover:border-white/10 transition-colors"
              >
                {skill}
              </span>
            ))}
            {skills?.length > 4 && (
              <span className="px-3 py-1 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                +{skills.length - 4} MORE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Subtle Bottom Light Leak */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
};

export default ProfileCard;




// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "react-toastify";

// const ProfileCard = ({ profile, currentUserId,matchScore }) => {
//     const { id, name, role, skills, username, interests, receivedRequests, sentRequests } = profile;
// console.log(typeof skills)
//     const [buttonStatus, setButtonStatus] = useState("connect");

//     const determineButtonStatus = () => {
//         const receivedRequest = receivedRequests?.find(
//             (req) => req.senderId === currentUserId && req.receiverId === id
//         );
//         const sentRequest = sentRequests?.find(
//             (req) => req.receiverId === currentUserId && req.senderId === id
//         );

//         if (receivedRequest?.status === "accepted" || sentRequest?.status === "accepted") {
//             return "connected";
//         }
//         if (receivedRequest?.status === "pending" || sentRequest?.status === "pending") {
//             return "pending";
//         }
//         return "connect";
//     };
//     const onSendRequest = async (receiverId, senderId) => {
//         try {
//           const response = await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/connections/send`, { receiverId, senderId });
//           toast.success(response.data.message);
//         } catch (error) {
//           toast.error(error.response?.data?.message || "Error sending request");
//           console.error(error.response?.data?.message);
//         }
//       };


//     useEffect(() => {
//         setButtonStatus(determineButtonStatus());
//     }, [receivedRequests, sentRequests, currentUserId, id]);

//     const handleButtonClick = async () => {
//         if (buttonStatus === "connect") {
//             await onSendRequest(id, currentUserId);
//             setButtonStatus("pending");
//         }
//     };

//     const buttonText =
//         buttonStatus === "pending"
//             ? "Pending"
//             : buttonStatus === "connected"
//                 ? "Connected"
//                 : "Connect";

//     const buttonStyle =
//         buttonStatus === "pending"
//             ? "bg-green-500 hover:bg-green-600"
//             : buttonStatus === "connected"
//                 ? "bg-gray-500 cursor-not-allowed"
//                 : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90";

//     return (
//         <div className="bg-[#0d0d0d] w-screen md:w-[45rem] relative px-4 py-6 rounded-2xl shadow-xl flex md:flex-row  gap-8">
           
//            {matchScore&&  <span className="bg-gradient-to-r  from-blue-700 to-purple-700 absolute top-4 right-4 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md">
//                     Match-score :  {matchScore}
//                         </span>}
//             {/* Left Section: Name and Role */}
//             <div>
//                 <Link to={`/profile/${username}`} className="  flex-shrink-0 w-10 h-10 md:w-20 md:h-20 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
//                     {username[0]?.toUpperCase()}
//                 </Link>
//             </div>


//             {/* Middle Section: Profile Details */}
//             <div className="flex-grow flex flex-col gap-2">
//                 <div className="flex items-center gap-4 relative">
//                     <Link to={`/profile/${username}`} className="text-lg font-bold text-white hover:text-blue-500">{username}</Link>
//                     {role && (
//                         <span className="bg-gradient-to-r  from-blue-700 to-purple-700 relative bottom-2 right-2 text-white text-[.6rem] font-bold px-2 py-1 rounded-lg shadow-md">
//                             {role}
//                         </span>
//                     )}

                 
                   
//                 </div>

//                 <div className="w-full bg-slate-800 h-[.1rem]" />
//                 <div className="mt-2">
//                     <h3 className="text-sm font-semibold text-white mb-2">Skills:</h3>
//                     {skills?.length > 0 ? (
//                         <div className="flex flex-wrap gap-2 mt-1">
//                             {skills?.map((skill, index) => (
//                                 <span
//                                     key={index}
//                                     className="text-white text-xs font-semibold px-3 py-1 rounded-full border border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
//                                     style={{
//                                         background: "linear-gradient(to right, rgba(29, 78, 216, 0.15), rgba(126, 34, 206, 0.15)), #1f2937",
//                                     }}
//                                 >
//                                     {skill}
//                                 </span>


//                             ))}
//                         </div>
//                     ) : (
//                         <p className="text-sm text-gray-400">No skills listed.</p>
//                     )}
//                 </div>



//                 <div className="mt-2 hidden  md:block">
//                     <h3 className="text-sm font-semibold text-white mb-2">Interests:</h3>
//                     {interests?.length > 0 ? (
//                         <div className="flex flex-wrap gap-2 mt-1">
//                             {interests?.map((interest, index) => (
//                                 <span
//                                     key={index}
//                                     className="text-white text-xs font-semibold px-3 py-1 rounded-full border border-gray-600 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
//                                     style={{
//                                         background: "linear-gradient(to right, rgba(29, 78, 216, 0.15), rgba(126, 34, 206, 0.15)), #1f2937",
//                                     }}
//                                 >
//                                     {interest}
//                                 </span>

//                             ))}
//                         </div>
//                     ) : (
//                         <p className="text-sm text-gray-400">No interests listed.</p>
//                     )}
//                 </div>

//             </div>

//             {/* Right Section: Actions */}
//             <div className="md:flex flex-col hidden md:h-40 items-center justify-end gap-2">
               
//                 <button
//                     onClick={handleButtonClick}
//                     className={`${buttonStyle} text-white px-4 py-2 rounded-md text-sm font-semibold transition-opacity w-full`}
//                     disabled={buttonStatus !== "connect"}
//                 >
//                     {buttonText}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default ProfileCard;
