import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { FiMessageSquare } from "react-icons/fi";
import ChatLoader from "../components/loaders/ChatLoader";
import { setHideMobileNav } from "../redux/actions/uiActions";
import GlobalLoader from "../components/loaders/GlobalLoader";

const ChatSection = () => {
  const dispatch = useDispatch();
  const { user, isLoggedIn, isChecking } = useSelector((state) => state.auth);
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

  const [isReceiverTyping, setIsReceiverTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

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

      socketRef.current.on("userTyping", ({ senderId }) => {
        if (senderId === currentId) {
          setIsReceiverTyping(true);
        }
      });

      socketRef.current.on("userStoppedTyping", ({ senderId }) => {
        if (senderId === currentId) {
          setIsReceiverTyping(false);
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
  }, [messages, isReceiverTyping]);

  const handleTyping = () => {
    if (socketRef.current && currentId) {
      socketRef.current.emit("typing", { senderId: user?.id, receiverId: currentId });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      typingTimeoutRef.current = setTimeout(() => {
        socketRef.current.emit("stopTyping", { senderId: user?.id, receiverId: currentId });
      }, 2000);
    }
  };

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
      setIsReceiverTyping(false);
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

  useEffect(() => {
    dispatch(setHideMobileNav(isChatOpen));

    return () => {
      dispatch(setHideMobileNav(false));
    };
  }, [isChatOpen, dispatch]);

  const sendMessage = async () => {
    if (message.trim() && socketRef.current) {
      try {
        const chatMessage = { senderId: user?.id, receiverId: currentId, message, createdAt: new Date().toISOString() };

        socketRef.current.emit("sendMessage", chatMessage);
        socketRef.current.emit("stopTyping", { senderId: user?.id, receiverId: currentId });

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

  if (isChecking) {
    return <GlobalLoader />;
  }

  if (!isLoggedIn) {
    navigate("/login");
    return null;
  }

  if (loadingChats) {
    return <ChatLoader />;
  }

  return (
    <div className="max-w-7xl mx-auto w-full flex h-dvh md:h-[calc(100vh-120px)] bg-black text-white selection:bg-white selection:text-black overflow-hidden mt-0 md:mt-28 md:border-x md:border-white/5">
      {/* Sidebar (Conversations List) */}
      <div 
        className={`w-full md:w-[320px] lg:w-[380px] flex-shrink-0 bg-black border-r border-white/5 flex flex-col transition-all duration-500 ${
          isChatOpen ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-5 md:p-8 space-y-8 flex flex-col h-full overflow-y-auto no-scrollbar pb-32 md:pb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-xl md:text-2xl font-black tracking-tighter text-white">Messages</h1>
            </div>
          </div>


          <div className="relative group">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-2xl px-5 py-3.5 text-xs font-bold text-white placeholder:text-zinc-700 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all pl-11"
            />
            <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-white transition-colors" size={18} />
          </div>

          <div className="space-y-6 flex-1">
            <h3 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">Recent Activity</h3>
            
            <div className="space-y-1.5">
              {filteredChats.length === 0 ? (
                <div className="py-10 px-4 border border-dashed border-white/5 rounded-3xl text-center">
                  <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                    {allChats.length === 0 ? "No active synchronization" : "No results"}
                  </p>
                </div>
              ) : (
                filteredChats?.map((chat) => (
                  <div
                    key={chat.sender.id}
                    onClick={() => {
                      setCurrentId(chat.sender.id);
                      setIsChatOpen(true);
                    }}
                    className={`flex items-center gap-3.5 p-3.5 rounded-2xl transition-all cursor-pointer group ${
                      currentId === chat.sender.id 
                        ? "bg-white/[0.05] border border-white/10" 
                        : "bg-transparent border border-transparent hover:bg-white/[0.02] hover:border-white/5"
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                      currentId === chat.sender.id ? "bg-white text-black" : "bg-zinc-900 text-zinc-500 group-hover:bg-white group-hover:text-black"
                    }`}>
                      {chat.sender.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-white truncate tracking-tight">{chat.sender.username}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content (Active Chat) */}
      <div className={`flex-1 flex flex-col bg-black relative transform transition-all duration-500 ${
        isChatOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
      }`}>
        {currentId ? (
          <>
            <div className="px-5 md:px-8 py-4 md:py-6 border-b border-white/5 flex items-center justify-between bg-black/60 backdrop-blur-2xl sticky top-0 z-10">
              <div className="flex items-center gap-4 md:gap-6">
                <button 
                  className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-white transition-colors"
                  onClick={() => setIsChatOpen(false)}
                >
                  <IoArrowBack size={20} />
                </button>
                <Link to={`/profile/${receiver?.username}`} className="flex items-center gap-3 md:gap-4 group">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-zinc-900 rounded-lg md:rounded-xl flex items-center justify-center text-white text-[10px] font-black group-hover:bg-white group-hover:text-black transition-all">
                    {receiver?.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-sm md:text-lg font-black text-white tracking-tighter leading-none">
                      {receiver?.username}
                    </h2>
                  </div>
                </Link>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 md:p-12 space-y-6 md:space-y-8 no-scrollbar pb-32 md:pb-40">
              {loadingMessages ? (
                Array(6).fill().map((_, i) => (
                  <div
                    key={i}
                    className={`h-10 md:h-12 w-1/3 bg-white/[0.02] animate-pulse rounded-2xl ${i % 2 === 0 ? "ml-auto" : "mr-auto"}`}
                  />
                ))
              ) : (
                messages?.map((msg, index) => {
                  const isMe = msg.senderId === user?.id;
                  return (
                    <div key={index} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] md:max-w-[70%] px-5 py-3.5 text-xs md:text-sm font-medium tracking-tight leading-relaxed transition-all break-words ${
                        isMe 
                          ? "bg-white text-black rounded-2xl md:rounded-3xl rounded-tr-none shadow-xl shadow-white/5 font-bold" 
                          : "bg-white/[0.03] border border-white/5 text-white rounded-2xl md:rounded-3xl rounded-tl-none shadow-lg"
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
              
              {isReceiverTyping && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.02] border border-white/5 text-zinc-500 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full animate-bounce"></div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10 mb-0 bg-gradient-to-t from-black via-black/90 to-transparent z-20 pb-8 md:pb-10">
              <div className="max-w-4xl mx-auto relative group">
                <input
                  type="text"
                  placeholder="Say hello..."
                  className="w-full bg-white/[0.08] backdrop-blur-lg border border-white/10 rounded-2xl md:rounded-[2rem] px-6 md:px-8 py-4 md:py-5 pr-[70px] md:pr-24 text-xs md:text-sm font-bold text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/30 focus:bg-white/[0.12] transition-all shadow-2xl"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button 
                  onClick={sendMessage}
                  className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full text-white hover:text-zinc-400 hover:bg-white/5 transition-all active:scale-90 z-10"
                >
                  <FaPaperPlane size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center">
              <FiMessageSquare className="text-zinc-600 w-7 h-7 md:w-8 md:h-8" />
            </div>
            <div className="space-y-2 md:space-y-3">
              <h2 className="text-lg md:text-xl font-black tracking-tighter text-white">Select a chat</h2>
              <p className="text-zinc-600 text-xs md:text-sm max-w-xs mx-auto">
                Select a connection from the list to start messaging.
              </p>
            </div>
            {allChats.length === 0 && (
              <Link
                to="/explore"
                className="px-8 py-3 bg-white text-black font-black text-[9px] uppercase tracking-[0.3em] rounded-full hover:bg-zinc-200 transition-all"
              >
                Find Connections
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSection;