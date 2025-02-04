import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaPaperPlane, FaRegSmile } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";

const ChatSection = () => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [allChats, setAllChats] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [receiver, setReceiver] = useState(null);
  const [currentId, setCurrentId] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Redirect to login if user is not logged in
  // useEffect(() => {
   
  // }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;

    // Initialize socket connection (Only once)
    if (!socketRef.current) {
      socketRef.current = io(process.env.REACT_APP_BACKEND_BASE_URL, {
        transports: ["websocket"],
      });

      socketRef.current.emit("registerUser", user?.id);

      socketRef.current.on("receiveMessage", (newMessage) => {
        if (newMessage.senderId === currentId || newMessage.receiverId === currentId) {
          setMessages((prev) => [...prev, newMessage]);
        }
      });
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [isLoggedIn, user?.id, currentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/chat/${user?.id}/${currentId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
    setLoadingMessages(false);
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/user/${currentId}`);
      setReceiver(response?.data.user);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchChats = async () => {
    setLoadingChats(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/connections/requests/${user?.username}`);
      let connections = response?.data.requests.filter(request => request.status === "accepted");
      
      setAllChats(connections);
      setFilteredChats(connections);

      if (connections.length > 0) {
        setCurrentId(connections[0]?.sender?.id || "");
      }
    } catch (error) {
      console.error("Error fetching chats", error);
    }
    setLoadingChats(false);
  };

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      fetchChats();
    }
  }, [isLoggedIn, user?.id]);

  useEffect(() => {
    if (currentId) {
      fetchMessages();
      fetchUserDetails();
    }
  }, [currentId]);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredChats(allChats);
    } else {
      const filtered = allChats.filter(chat =>
        chat.sender.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredChats(filtered);
    }
  }, [searchTerm, allChats]);

  const sendMessage = async () => {
    if (message.trim() && socketRef.current) {
      try {
        const chatMessage = { senderId: user?.id, receiverId: currentId, message, createdAt: new Date().toISOString() };

        socketRef.current.emit("sendMessage", chatMessage);

        await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/chat/send`, chatMessage);
        setMessages((prev) => [...prev, chatMessage]);
        setMessage("");

        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };


  
  if (loadingChats) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#000104] text-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading chats...</h2>
        </div>
      </div>
    );
  }
  if (isLoggedIn === false) {
    navigate("/login");
  }


  return (
    <div className="flex h-[calc(100vh-4rem)] bg-[#0e0e0e]">
      
      {/* Sidebar (Chats List) */}
      <div className={`w-full md:w-80 bg-[#131313] p-4 flex flex-col ${isChatOpen ? "hidden md:flex" : "flex"}`}>
        
        <div className="flex gap-4 items-center font-bold mb-6">
          <Link to={'/'} className="text-2xl"><IoArrowBack /></Link>
          <h2 className="text-xl text-white">Chats</h2>
        </div>

        {/* Search Box */}
        <div className="relative w-full mb-4">
          <input
            type="text"
            placeholder="Search Messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
          />
          <BiSearch className="absolute right-3 top-3 text-gray-400" />
        </div>

        <h3 className="text-gray-400 mb-2">Recent</h3>

        {/* Chat List Skeleton */}
        <div className="space-y-2 overflow-y-auto flex-1">
          {loadingChats ? (
            Array(5).fill().map((_, i) => (
              <div key={i} className="h-14 bg-gray-700 animate-pulse rounded-md" />
            ))
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.sender.id}
                onClick={() => {
                  setCurrentId(chat.sender.id);
                  setIsChatOpen(true);
                }}
                className="flex items-center p-3 rounded-md border-b border-gray-700 hover:bg-gray-800 cursor-pointer transition"
              >
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                  {chat.sender.username.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">{chat.sender.username}</p>
                  <p className="text-gray-400 text-sm truncate">{chat.message || "New Message"}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Section */}
      <div className={`w-full md:flex-1 flex flex-col ${isChatOpen ? "flex" : "hidden md:flex"}`}>
        
        {/* Header */}
        <div className="bg-gray-900 p-4 flex items-center">
          <button className="md:hidden text-white text-2xl" onClick={() => setIsChatOpen(false)}>
            <IoArrowBack />
          </button>
          <div className="ml-4 flex items-center">
            <h2 className="ml-3 text-lg font-semibold text-white">{receiver?.username}</h2>
          </div>
        </div>

        {/* Messages Skeleton */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loadingMessages ? (
            Array(6).fill().map((_, i) => (
              <div key={i} className="h-10 w-2/3 bg-gray-700 animate-pulse rounded-md" />
            ))
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"} gap-2`}>
                <div className={`px-4 py-2 rounded-xl text-white ${msg.senderId === user?.id ? "bg-blue-600" : "bg-gray-700"}`}>
                  {msg.message}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef}></div>

          
        </div>
        <div className="p-4 bg-gray-800 flex  items-center">
          <FaRegSmile className="text-gray-400 text-xl cursor-pointer" />
          <input
            type="text"
            className="ml-3 w-full p-2 bg-gray-700 text-white rounded-full focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
         />
            <button onClick={sendMessage} className="ml-3 bg-blue-500 p-3 rounded-full text-white">
            <FaPaperPlane />
            </button>
          </div>
        

      </div>
    </div>
  );
};

export default ChatSection;



// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import { Link, useNavigate } from "react-router-dom";
// import { FaPaperPlane, FaRegSmile } from "react-icons/fa";
// import { IoArrowBack } from "react-icons/io5";
// import { BiSearch } from "react-icons/bi";

// const ChatSection = () => {
//   const { user, isLoggedIn } = useSelector((state) => state.auth);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [allChats, setAllChats] = useState(null);
//   const [filteredChats, setFilteredChats] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [receiver, setReceiver] = useState(null);
//   const [currentId, setCurrentId] = useState('');
//   const [isChatOpen, setIsChatOpen] = useState(false);
//   const navigate = useNavigate();
//   const messagesEndRef = useRef(null); // Ref to track chat end
//   const [socket, setSocket] = useState(null);

 

//   // Initialize Socket Connection
//   useEffect(() => {
//     const socketConnection = io(process.env.REACT_APP_BACKEND_BASE_URL, {
//       transports: ["websocket"],
//     });
//     setSocket(socketConnection);

//     socketConnection.on("receiveMessage", (newMessage) => {
//       setMessages((prev) => [...prev, newMessage]);
//     });

//     return () => {
//       socketConnection.disconnect();
//     };
//   }, []);

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   // Fetch Messages
//   const fetchMessages = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/chat/${user?.id}/${currentId}`);
//       setMessages(response?.data);
//     } catch (error) {
//       console.log("Error fetching messages:", error);
//     }
//   };

//   // Fetch User Details
//   const fetchUserDetails = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/user/${currentId}`);
//       setReceiver(response?.data.user);
//     } catch (error) {
//       console.log("Error fetching user details:", error);
//     }
//   };

//   // Fetch Recent Chats
//   const fetchChats = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/connections/requests/${user?.username}`);
//       const connections = response?.data.requests.filter(request => request.status === "accepted");
//       setAllChats(connections);
//       setCurrentId(connections[0]?.id)
//       setFilteredChats(connections);
//     } catch (error) {
//       console.error("Error fetching chats", error);
//     }
//   };

//   // Apply Search Filter
//   useEffect(() => {
//     if (!searchTerm) {
//       setFilteredChats(allChats);
//     } else {
//       const filtered = allChats?.filter(chat =>
//         chat.sender.username.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredChats(filtered);
//     }
//   }, [searchTerm, allChats]);

//   useEffect(() => {
//     fetchMessages();
//     fetchUserDetails();
//     fetchChats();
//   }, []);

//   useEffect(() => {
//     fetchMessages();
//     fetchUserDetails();
//   }, [currentId]);

  
//   const sendMessage = async () => {
//     if (message.trim()) {
//       try {
//         const chatMessage = { senderId: user?.id, receiverId: currentId, createdAt: new Date().toISOString(), message };

//         if (socket) {
//           socket.emit("sendMessage", chatMessage);
//         }

//         await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/chat/send`, chatMessage);
//         setMessage("");

//         // Scroll to bottom after sending a message
//         setTimeout(() => {
//           messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//         }, 100);
        
//       } catch (error) {
//         console.log("Error sending message:", error);
//       }
//     }
//   };
//   if (!isLoggedIn) {
//     navigate("/login");
//   }


//   return (
//     <div className="flex h-[calc(100vh-4rem)] bg-[#0e0e0e]">
      
//       {/* Sidebar (Chats List) */}
//       <div className={`w-full md:w-80 bg-[#131313] p-4 flex flex-col transition-transform duration-300 ease-in-out ${isChatOpen ? "hidden md:flex" : "flex"}`}>
        
//         <div className="flex gap-4 items-center font-bold mb-6">
//           <Link to={'/'} className="text-2xl "><IoArrowBack /></Link>
//           <h2 className="text-xl text-white">Chats</h2>
//         </div>

//         {/* Search Box */}
//         <div className="relative w-full mb-4">
//           <input
//             type="text"
//             placeholder="Search Messages..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full bg-gray-900 text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
//           />
//           <BiSearch className="absolute right-3 top-3 text-gray-400" />
//         </div>

//         <h3 className="text-gray-400 mb-2">Recent</h3>

//         {/* Chat List */}
//         <div className="space-y-2 overflow-y-auto flex-1">
//           {filteredChats?.map((chat) => (
//             <div
//               key={chat.sender.id}
//               onClick={() => {
//                 setCurrentId(chat.sender.id);
//                 setIsChatOpen(true); // Open DM section
//               }}
//               className="flex items-center p-3 rounded-md border-b border-gray-700 hover:bg-gray-800 hover:cursor-pointer transition"
//             >
//               <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
//                 {chat.sender.username.charAt(0).toUpperCase()}
//               </div>
//               <div className="ml-3">
//                 <p className="text-white font-medium">{chat.sender.username}</p>
//                 <p className="text-gray-400 text-sm truncate">{chat.message || "New Message"}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Chat Section (DM View) */}
//       <div className={`w-full md:flex-1 flex flex-col transition-transform duration-300 ease-in-out ${isChatOpen ? "flex" : "hidden md:flex"}`}>
        
//         {/* Header */}
//         <div className="bg-gray-900 p-4 flex items-center">
//           <button className="md:hidden text-white text-2xl" onClick={() => setIsChatOpen(false)}>
//             <IoArrowBack />
//           </button>

//           <div className="ml-4 flex items-center">
//             <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
//               {receiver?.username?.charAt(0).toUpperCase()}
//             </div>
//             <h2 className="ml-3 text-lg font-semibold text-white">{receiver?.username}</h2>
//           </div>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                {messages?.map((msg, index) => (
//            <div key={index} className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"} gap-2`}>
//              <div className={`px-4 py-2 rounded-xl text-white ${msg.senderId === user?.id ? "bg-blue-600" : "bg-gray-700"}`}>
//               {msg.message}
//               </div>
//                </div>
//                ))}
//             <div ref={messagesEndRef}></div> {/* Auto-scroll anchor */}
//           </div>

//           <div className="p-4 bg-gray-800 flex items-center">
//          <FaRegSmile className="text-gray-400 text-xl cursor-pointer" />
//          <input
//            type="text"
//            className="ml-3 w-full p-2 bg-gray-700 text-white rounded-full focus:ring-2 focus:ring-blue-500"
//            placeholder="Type a message..."
//            value={message}
//            onChange={(e) => setMessage(e.target.value)}
//          />
//          <button onClick={sendMessage} className="ml-3 bg-blue-500 p-3 rounded-full text-white">
//            <FaPaperPlane />
//          </button>
//        </div>

//          </div>
         
      
//     </div>
//   );
// };

// export default ChatSection;

// // import React, { useEffect, useState } from "react";
// // import io from "socket.io-client";
// // import axios from "axios";
// // import { useSelector } from "react-redux";
// // import { Link, useNavigate, useParams } from "react-router-dom";
// // import { FaPaperPlane, FaRegSmile } from "react-icons/fa";
// // import { IoArrowBack,IoMenu  } from "react-icons/io5";
// // import { BiSearch } from "react-icons/bi";



// // const ChatSection = () => {
// //   const { user, isLoggedIn } = useSelector((state) => state.auth);
// //   const [message, setMessage] = useState("");
// //   const [messages, setMessages] = useState([]);
// //   const [allChats, setAllChats] = useState(null);
// //   const [filteredChats, setFilteredChats] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [receiver, setReceiver] = useState(null);
// //   const [currentId, setCurrentId] = useState('');
// //   const [isChatOpen, setIsChatOpen] = useState(false); // Track whether DM section is open


// // //   const { id } = useParams();
// //   const [socket, setSocket] = useState(null);
// // const navigate =useNavigate()

// //   useEffect(() => {
// //     if (!isLoggedIn) {
// //       navigate("/login");
// //     }
// //   }, [isLoggedIn]);

// //   // Initialize Socket Connection
// //   useEffect(() => {
// //     const socketConnection = io(process.env.REACT_APP_BACKEND_BASE_URL, {
// //       transports: ["websocket"],
// //     });
// //     setSocket(socketConnection);

// //     socketConnection.on("receiveMessage", (newMessage) => {
// //       setMessages((prev) => [...prev, newMessage]);
// //     });

// //     return () => {
// //       socketConnection.disconnect();
// //     };
// //   }, []);

// //   // Fetch Messages
// //   const fetchMessages = async () => {
// //     try {
// //       const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/chat/${user?.id}/${currentId}`);
// //       setMessages(response?.data);
// //     } catch (error) {
// //       console.log("Error fetching messages:", error);
// //     }
// //   };

// //   // Fetch User Details
// //   const fetchUserDetails = async () => {
// //     try {
// //       const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/user/${currentId}`);
// //       setReceiver(response?.data.user);
// //     } catch (error) {
// //       console.log("Error fetching user details:", error);
// //     }
// //   };

// //   // Fetch Recent Chats
// //   const fetchChats = async () => {
// //     try {
// //       const response = await axios.get(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/connections/requests/${user?.username}`);
// //       const connections = response?.data.requests.filter(request => request.status === "accepted");
// //       setAllChats(connections);
// //       setCurrentId(connections[0]?.id)
// //       setFilteredChats(connections);
// //     } catch (error) {
// //       console.error("Error fetching chats", error);
// //     }
// //   };

// //   // Apply Search Filter
// //   useEffect(() => {
// //     if (!searchTerm) {
// //       setFilteredChats(allChats);
// //     } else {
// //       const filtered = allChats?.filter(chat =>
// //         chat.sender.username.toLowerCase().includes(searchTerm.toLowerCase())
// //       );
// //       setFilteredChats(filtered);
// //     }
// //   }, [searchTerm, allChats]);

// //   useEffect(() => {
    
// //     fetchMessages();
// //     fetchUserDetails();
// //     fetchChats();
// //   }, []);
// //   useEffect(() => {
// //     fetchMessages();
// //     fetchUserDetails();
   
// //   }, [currentId]);
   
// //   const sendMessage = async () => {
// //     if (message.trim()) {
// //       try {
// //         const chatMessage = { senderId: user?.id, receiverId: currentId, createdAt: new Date().toISOString(), message };

// //         if (socket) {
// //           socket.emit("sendMessage", chatMessage);
// //         }

// //         await axios.post(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/chat/send`, chatMessage);
// //         setMessage("");
// //       } catch (error) {
// //         console.log("Error sending message:", error);
// //       }
// //     }
// //   };

// //   const formatTime = (timestamp) => {
// //     const date = new Date(timestamp);
// //     return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
// //   };

// //   return (
// //     <div className="flex h-[calc(100vh-4rem)] bg-[#0e0e0e]">
      
// //     {/* Sidebar (Chats List) */}
// //     <div className={`w-full md:w-80 bg-[#131313] p-4 flex flex-col transition-transform duration-300 ease-in-out ${isChatOpen ? "hidden md:flex" : "flex"}`}>
      
// //       <div className="flex gap-4 items-center font-bold mb-6">
// //       <Link to={'/'} className="text-2xl "><IoArrowBack /></Link>
// //       <h2 className="text-xl  text-white ">Chats</h2>
// //       </div>

// //       {/* Search Box */}
// //       <div className="relative w-full mb-4">
// //         <input
// //           type="text"
// //           placeholder="Search Messages..."
// //           value={searchTerm}
// //           onChange={(e) => setSearchTerm(e.target.value)}
// //           className="w-full bg-gray-900 text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-blue-500"
// //         />
// //         <BiSearch className="absolute right-3 top-3 text-gray-400" />
// //       </div>

// //       <h3 className="text-gray-400 mb-2">Recent</h3>

// //       {/* Chat List */}
// //       <div className="space-y-2 overflow-y-auto flex-1">
// //         {filteredChats?.map((chat) => (
// //           <div
// //             key={chat.sender.id}
// //             onClick={() => {
// //               setCurrentId(chat.sender.id);
// //               setIsChatOpen(true); // Open DM section
// //             }}
// //             className="flex items-center p-3 rounded-md border-b border-gray-700 hover:bg-gray-800 hover:cursor-pointer transition"
// //           >
// //             <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
// //               {chat.sender.username.charAt(0).toUpperCase()}
// //             </div>
// //             <div className="ml-3">
// //               <p className="text-white font-medium">{chat.sender.username}</p>
// //               <p className="text-gray-400 text-sm truncate">{chat.message || "New Message"}</p>
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>

// //     {/* Chat Section (DM View) */}
// //     <div className={`w-full md:flex-1 flex flex-col transition-transform duration-300 ease-in-out ${isChatOpen ? "flex" : "hidden md:flex"}`}>
      
// //       {/* Header */}
// //       <div className="bg-gray-900 p-4 flex items-center">
// //         {/* Back Button (Only on Mobile) */}
// //         <button className="md:hidden text-white text-2xl" onClick={() => setIsChatOpen(false)}>
// //           <IoArrowBack />
// //         </button>

// //         <div className="ml-4 flex items-center">
// //           <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
// //             {receiver?.username?.charAt(0).toUpperCase()}
// //           </div>
// //           <h2 className="ml-3 text-lg font-semibold text-white">{receiver?.username}</h2>
// //         </div>
// //       </div>

// //       {/* Messages */}
// //       <div className="flex-1 overflow-y-auto p-4 space-y-4">
// //         {messages?.map((msg, index) => (
// //           <div key={index} className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"} items-end gap-2`}>
// //             <div className={`text-xs text-gray-400 ${msg.senderId === user?.id ? "right-2" : "left-2"}`}>
// //               {formatTime(msg.createdAt)}
// //             </div>
// //             <div className={`px-4 py-2 rounded-xl text-white ${msg.senderId === user?.id ? "bg-blue-600" : "bg-gray-700"}`}>
// //               {msg.message}
// //             </div>
// //           </div>
// //         ))}
// //       </div>

// //       {/* Input Section */}
// //       <div className="p-4 bg-gray-800 flex items-center">
// //         <FaRegSmile className="text-gray-400 text-xl cursor-pointer" />
// //         <input
// //           type="text"
// //           className="ml-3 w-full p-2 bg-gray-700 text-white rounded-full focus:ring-2 focus:ring-blue-500"
// //           placeholder="Type a message..."
// //           value={message}
// //           onChange={(e) => setMessage(e.target.value)}
// //         />
// //         <button onClick={sendMessage} className="ml-3 bg-blue-500 p-3 rounded-full text-white">
// //           <FaPaperPlane />
// //         </button>
// //       </div>
// //     </div>
// //   </div>
// //   );
// // };

// // export default ChatSection;





