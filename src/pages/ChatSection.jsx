import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaPaperPlane } from "react-icons/fa";
import { IoArrowBack } from "react-icons/io5";
import { BiSearch } from "react-icons/bi";
import { FiMessageSquare } from "react-icons/fi";
import ChatLoader from "../components/loaders/ChatLoader";
import GlobalLoader from "../components/loaders/GlobalLoader";
import { setHideMobileNav } from "../redux/actions/uiActions";
import { useGetRequestsQuery, useGetUserByIdQuery, useGetChatMessagesQuery, useSendChatMessageMutation } from "../redux/api/apiSlice";

const ChatSection = () => {
  const dispatch = useDispatch();
  const { user, isLoggedIn, isChecking } = useSelector((state) => state.auth);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentId, setCurrentId] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const [isReceiverTyping, setIsReceiverTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const { data: requestsData, isFetching: loadingChats } = useGetRequestsQuery(user?.username, {
    skip: !isLoggedIn || !user?.username
  });

  const { data: receiverData } = useGetUserByIdQuery(currentId, {
    skip: !currentId
  });

  const { data: chatMessagesData, isFetching: loadingMessages } = useGetChatMessagesQuery({
    senderId: user?.id,
    receiverId: currentId
  }, {
    skip: !user?.id || !currentId
  });

  const [sendChatMessage] = useSendChatMessageMutation();

  const receiver = receiverData?.user || null;

  const allChats = React.useMemo(() => {
    return (requestsData?.requests || []).filter(request => request.status === "accepted");
  }, [requestsData]);

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

  useEffect(() => {
    if (chatMessagesData) {
      setMessages(chatMessagesData);
    }
  }, [chatMessagesData]);

  useEffect(() => {
    if (currentId) {
      setIsReceiverTyping(false);
    }
  }, [currentId]);

  const [filteredChats, setFilteredChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

        await sendChatMessage(chatMessage).unwrap();
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
    <div className="max-w-[1440px] mx-auto w-full flex h-dvh md:h-[calc(100vh-40px)] bg-white text-zinc-900 overflow-hidden mt-0 md:mt-4 md:border-x md:border-zinc-200">
      {/* Sidebar (Conversations List) */}
      <div 
        className={`w-full md:w-[320px] lg:w-[380px] flex-shrink-0 bg-zinc-50 border-r border-zinc-200 flex flex-col transition-all duration-500 ${
          isChatOpen ? "hidden md:flex" : "flex"
        }`}
      >
        <div className="p-5 md:p-8 md:pt-4 space-y-8 flex flex-col h-full overflow-y-auto no-scrollbar pb-32 md:pb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Messages</h1>
            </div>
          </div>


          <div className="relative group">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-zinc-200 rounded-2xl px-5 py-3.5 text-xs font-bold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 transition-all pl-11 shadow-sm"
            />
            <BiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" size={18} />
          </div>

          <div className="space-y-6 flex-1">
            <h3 className="text-xs font-semibold text-zinc-400 ml-1">Recent Activity</h3>
            
            <div className="space-y-1.5">
              {filteredChats.length === 0 ? (
                <div className="py-10 px-4 border border-dashed border-zinc-200 rounded-3xl text-center">
                  <p className="text-zinc-400 text-xs font-semibold">
                    {allChats.length === 0 ? "No active conversations" : "No results"}
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
                        ? "bg-white border border-zinc-200 shadow-sm" 
                        : "bg-transparent border border-transparent hover:bg-zinc-100/80"
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                      currentId === chat.sender.id ? "bg-zinc-900 text-white" : "bg-zinc-200 text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white"
                    }`}>
                      {chat.sender.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-zinc-900 truncate tracking-tight">{chat.sender.username}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content (Active Chat) */}
      <div className={`flex-1 flex flex-col bg-white relative transform transition-all duration-500 ${
        isChatOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
      }`}>
        {currentId ? (
          <>
            <div className="px-5 md:px-8 py-4 border-b border-zinc-200 flex items-center justify-between bg-white/80 backdrop-blur-2xl sticky top-0 z-10">
              <div className="flex items-center gap-4 md:gap-6">
                <button 
                  className="md:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 transition-colors"
                  onClick={() => setIsChatOpen(false)}
                >
                  <IoArrowBack size={20} />
                </button>
                <Link to={`/profile/${receiver?.username}`} className="flex items-center gap-3 md:gap-4 group">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-zinc-100 border border-zinc-200 rounded-lg md:rounded-xl flex items-center justify-center text-zinc-900 text-[10px] font-black group-hover:bg-zinc-900 group-hover:text-white transition-all">
                    {receiver?.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-sm md:text-lg font-black text-zinc-900 tracking-tighter leading-none">
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
                          ? "bg-zinc-900 text-white rounded-2xl md:rounded-3xl rounded-tr-none shadow-md font-bold" 
                          : "bg-zinc-100 border border-zinc-200 text-zinc-900 rounded-2xl md:rounded-3xl rounded-tl-none shadow-sm"
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
              
              {isReceiverTyping && (
                <div className="flex justify-start">
                  <div className="bg-zinc-100 border border-zinc-200 text-zinc-500 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10 mb-0 bg-gradient-to-t from-white via-white/90 to-transparent z-20 pb-8 md:pb-10">
              <div className="max-w-4xl mx-auto relative group">
                <input
                  type="text"
                  placeholder="Say hello..."
                  className="w-full bg-zinc-100 border border-zinc-300 rounded-2xl md:rounded-[2rem] px-6 md:px-8 py-4 md:py-5 pr-[70px] md:pr-24 text-xs md:text-sm font-bold text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-500 transition-all shadow-lg"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button 
                  onClick={sendMessage}
                  className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full text-zinc-900 hover:text-zinc-600 hover:bg-zinc-200/50 transition-all active:scale-90 z-10"
                >
                  <FaPaperPlane size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-zinc-100 border border-zinc-200 rounded-[2rem] md:rounded-[2.5rem] flex items-center justify-center">
              <FiMessageSquare className="text-zinc-400 w-7 h-7 md:w-8 md:h-8" />
            </div>
            <div className="space-y-2 md:space-y-3">
              <h2 className="text-lg md:text-xl font-black tracking-tighter text-zinc-900">Select a chat</h2>
              <p className="text-zinc-500 text-xs md:text-sm max-w-xs mx-auto">
                Select a connection from the list to start messaging.
              </p>
            </div>
            {allChats.length === 0 && (
              <Link
                to="/explore"
                className="px-8 py-3 bg-zinc-900 text-white font-black text-[9px] uppercase tracking-[0.3em] rounded-full hover:bg-zinc-800 transition-all"
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