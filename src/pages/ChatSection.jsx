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

  useEffect(() => {
    if (!isLoggedIn || !user?.id) return;

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
      <div className="flex items-center justify-center h-screen bg-[#0d0d0d] text-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Loading chats...</h2>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    navigate("/login");
  }

  return (
    <div className="flex h-[100vh] bg-[#0d0d0d]">
      {/* Sidebar (Chats List) */}
      <div className={`w-full md:w-80 bg-[#131313] p-4 flex flex-col ${isChatOpen ? "hidden md:flex" : "flex"}`}>
        <div className="flex gap-4 items-center font-bold mb-6">
          <Link to={'/'} className="text-2xl text-gray-300 hover:text-white transition">
            <IoArrowBack />
          </Link>
          <h2 className="text-xl text-white">Chats</h2>
        </div>

        {/* Search Box */}
        <div className="relative w-full mb-4">
          <input
            type="text"
            placeholder="Search Messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1a1a] text-white px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 border border-gray-700"
          />
          <BiSearch className="absolute right-3 top-3 text-gray-400" />
        </div>

        <h3 className="text-gray-400 mb-2">Recent</h3>

        {/* Chat List */}
        <div className="space-y-2 overflow-y-auto flex-1">
          {loadingChats ? (
            Array(5).fill().map((_, i) => (
              <div key={i} className="h-14 bg-gray-700 animate-pulse rounded-lg" />
            ))
          ) : filteredChats.length === 0 ? (
            <div className="text-gray-400 text-center p-4">
              {allChats.length === 0 ? (
                "You have no connections. Connect with others to start chatting."
              ) : (
                "No results found."
              )}
            </div>
          ) : (
            filteredChats?.map((chat) => (
              <div
                key={chat.sender.id}
                onClick={() => {
                  setCurrentId(chat.sender.id);
                  setIsChatOpen(true);
                }}
                className="flex items-center p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#262626] cursor-pointer transition"
              >
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                  {chat.sender.username.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="text-white font-medium">{chat.sender.username}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Section */}
      <div className={`w-full md:flex-1 flex flex-col ${isChatOpen ? "flex" : "hidden md:flex"}`}>
        {currentId ? (
          <>
            {/* Header */}
            <div className="bg-[#1a1a1a] p-2 flex items-center border-b border-gray-700 md:mt-16">
              <button className="md:hidden text-white text-2xl hover:text-gray-300 transition" onClick={() => setIsChatOpen(false)}>
                <IoArrowBack />
              </button>
              <Link to={`/profile/${receiver?.username}`} className="ml-4 flex items-center">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                  {receiver?.username.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-sm md:text-lg ml-4 font-semibold text-white">{receiver?.username}</h2>
              </Link>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scroll">
              {loadingMessages ? (
                Array(6).fill().map((_, i) => (
                  <div
                    key={i}
                    className={`h-8 w-1/3 bg-gray-700 animate-pulse rounded-xl ${i % 2 === 0 ? "ml-auto" : "mr-auto"}`}
                  />
                ))
              ) : (
                messages?.map((msg, index) => (
                  <div key={index} className={`flex ${msg.senderId === user?.id ? "justify-end" : "justify-start"} gap-2`}>
                    <div className={`px-4 py-2 rounded-xl text-white ${msg.senderId === user?.id ? "bg-blue-600" : "bg-[#1a1a1a]"}`}>
                      {msg.message}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Message Input */}
            <div className="md:p-4 pb-20  bg-[#1a1a1a] flex items-center border-t border-gray-700">
              {/* <FaRegSmile className="text-gray-400 text-xl cursor-pointer hover:text-white transition" /> */}
              <input
                type="text"
                className="ml-3 w-full p-2 bg-[#131313] text-white rounded-lg focus:ring-2 focus:ring-blue-500 border border-gray-700"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button onClick={sendMessage} className="ml-3 bg-blue-600 p-3 rounded-lg text-white hover:bg-blue-700 transition">
                <FaPaperPlane />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 text-center p-4">
            {allChats.length === 0 ? (
              <>
                <p className="mb-4">You have no connections yet.</p>
                <Link
                  to="/discover"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Find Friends
                </Link>
              </>
            ) : (
              "Select a chat to start messaging"
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSection;